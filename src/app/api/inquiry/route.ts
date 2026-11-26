import { NextResponse } from "next/server";
import { getDictionary, isValidLocale } from "@/i18n/config";
import {
  inquiryRequestSchema,
  type InquiryApiResponse,
  type InquiryFieldErrors,
} from "@/lib/inquiry-schema";
import { insertSupabaseSampleInquiry } from "@/lib/supabase";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_BODY_BYTES = 16 * 1024;
const MIN_HUMAN_SUBMIT_MS = 1200;
const ipSubmissionWindows = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || "unknown";
}

function isRateLimited(clientIp: string, now: number): boolean {
  if (ipSubmissionWindows.size > 1000) {
    for (const [key, timestamps] of ipSubmissionWindows) {
      const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (recent.length === 0) {
        ipSubmissionWindows.delete(key);
      } else {
        ipSubmissionWindows.set(key, recent);
      }
    }
  }

  const existing = ipSubmissionWindows.get(clientIp) ?? [];
  const active = existing.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (active.length >= MAX_REQUESTS_PER_WINDOW) {
    ipSubmissionWindows.set(clientIp, active);
    return true;
  }

  active.push(now);
  ipSubmissionWindows.set(clientIp, active);
  return false;
}

function isCrossOriginBrowserRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export async function POST(request: Request): Promise<NextResponse<InquiryApiResponse>> {
  try {
    if (isCrossOriginBrowserRequest(request)) {
      return NextResponse.json(
        {
          ok: false,
          serverError: "Cross-origin inquiry submissions are not permitted.",
        },
        { status: 403 }
      );
    }

    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader) {
      const parsedLength = Number(contentLengthHeader);
      if (Number.isFinite(parsedLength) && parsedLength > MAX_BODY_BYTES) {
        return NextResponse.json(
          {
            ok: false,
            serverError: "Request payload exceeds maximum allowed size.",
          },
          { status: 413 }
        );
      }
    }

    const now = Date.now();
    const clientIp = getClientIp(request);

    const rawBody: unknown = await request.json();
    const localeValue =
      typeof rawBody === "object" &&
      rawBody !== null &&
      "locale" in rawBody &&
      typeof (rawBody as { locale?: unknown }).locale === "string" &&
      isValidLocale((rawBody as { locale: string }).locale)
        ? (rawBody as { locale: "ar" | "en" }).locale
        : "ar";

    if (isRateLimited(clientIp, now)) {
      return NextResponse.json(
        {
          ok: false,
          serverError:
            localeValue === "ar"
              ? "تم إرسال عدة طلبات خلال وقت قصير. يرجى الانتظار بضع دقائق قبل إعادة المحاولة أو التواصل عبر واتساب."
              : "Too many inquiry requests in a short period. Please wait a few minutes or contact us on WhatsApp.",
        },
        {
          status: 429,
          headers: { "Retry-After": "600" },
        }
      );
    }

    const dict = getDictionary(localeValue);
    const parsed = inquiryRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const fieldErrors: InquiryFieldErrors = {};

      if (flat.fullName) fieldErrors.fullName = dict.inquiry.validation.fullNameMin;
      if (flat.company) fieldErrors.company = dict.inquiry.validation.companyMin;
      if (flat.email) fieldErrors.email = dict.inquiry.validation.emailInvalid;
      if (flat.phone) fieldErrors.phone = dict.inquiry.validation.phoneMin;
      if (flat.category) fieldErrors.category = dict.inquiry.validation.categoryRequired;
      if (flat.message) fieldErrors.message = dict.inquiry.validation.messageMin;

      return NextResponse.json(
        {
          ok: false,
          fieldErrors,
          serverError: dict.inquiry.errorTitle,
        },
        { status: 400 }
      );
    }

    const hasHoneypotValue = Boolean(
      parsed.data.website && parsed.data.website.trim().length > 0
    );
    const elapsedMs =
      parsed.data.formStartedAt !== undefined ? now - parsed.data.formStartedAt : null;
    const isTooFastSubmission =
      elapsedMs !== null && elapsedMs >= 0 && elapsedMs < MIN_HUMAN_SUBMIT_MS;

    if (hasHoneypotValue || isTooFastSubmission) {
      return NextResponse.json(
        {
          ok: false,
          serverError:
            localeValue === "ar"
              ? "تعذر التحقق من الإرسال التلقائي. يرجى مراجعة البيانات والمحاولة مرة أخرى."
              : "Automated submission check failed. Please review your details and retry.",
        },
        { status: 400 }
      );
    }

    const timestampPart = now.toString(36).toUpperCase();
    const categoryPrefix = parsed.data.category.slice(0, 3).toUpperCase();
    const referenceId = `EC-ASA-${categoryPrefix}-${timestampPart}`;

    const inserted = await insertSupabaseSampleInquiry({
      company_name: parsed.data.company,
      contact_name: parsed.data.fullName,
      phone: `${parsed.data.phone} / ${parsed.data.email}`,
      requested_codes: parsed.data.productCode ?? parsed.data.category,
      notes: `[${referenceId}] ${parsed.data.message}`,
      status: "new",
    });

    if (!inserted) {
      return NextResponse.json(
        {
          ok: false,
          serverError:
            localeValue === "ar"
              ? "تعذر حفظ الطلب مؤقتاً في قاعدة البيانات. يرجى المحاولة بعد قليل أو التواصل عبر واتساب."
              : "Unable to record inquiry right now. Please try again shortly or reach out via WhatsApp.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        referenceId,
        submittedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        serverError: "Unable to process request payload. Please verify your input and retry.",
      },
      { status: 500 }
    );
  }
}
