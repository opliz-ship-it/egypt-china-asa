import { NextResponse } from "next/server";
import { getDictionary, isValidLocale } from "@/i18n/config";
import {
  inquiryRequestSchema,
  type InquiryApiResponse,
  type InquiryFieldErrors,
} from "@/lib/inquiry-schema";
import { insertSupabaseSampleInquiry } from "@/lib/supabase";

export async function POST(request: Request): Promise<NextResponse<InquiryApiResponse>> {
  try {
    const rawBody: unknown = await request.json();
    const localeValue =
      typeof rawBody === "object" &&
      rawBody !== null &&
      "locale" in rawBody &&
      typeof (rawBody as { locale?: unknown }).locale === "string" &&
      isValidLocale((rawBody as { locale: string }).locale)
        ? (rawBody as { locale: "ar" | "en" }).locale
        : "ar";

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

    const timestampPart = Date.now().toString(36).toUpperCase();
    const categoryPrefix = parsed.data.category.slice(0, 3).toUpperCase();
    const referenceId = `EC-ASA-${categoryPrefix}-${timestampPart}`;

    await insertSupabaseSampleInquiry({
      company_name: parsed.data.company,
      contact_name: parsed.data.fullName,
      phone: `${parsed.data.phone} / ${parsed.data.email}`,
      requested_codes: parsed.data.productCode ?? parsed.data.category,
      notes: `[${referenceId}] ${parsed.data.message}`,
      status: "new",
    });

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
