"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/i18n/config";
import {
  inquiryCategoryValues,
  inquiryRequestSchema,
  type InquiryApiResponse,
  type InquiryFieldErrors,
} from "@/lib/inquiry-schema";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";

interface InquiryFormProps {
  locale: Locale;
  dict: Dictionary;
  defaultCategory?: (typeof inquiryCategoryValues)[number];
  productCode?: string;
  compact?: boolean;
}

export function InquiryForm({
  locale,
  dict,
  defaultCategory,
  productCode,
  compact = false,
}: InquiryFormProps) {
  const { selectedSkus, buildWhatsAppUrl } = useSupabaseCatalog();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<string>(defaultCategory ?? "");
  const [message, setMessage] = useState(
    productCode ? `[Grade: ${productCode}] ` : ""
  );

  const applySkuCodesToMessage = useCallback(
    (codes: string[]) => {
      if (codes.length === 0) return;
      const prefix =
        locale === "ar"
          ? `[الأكواد المطلوبة: ${codes.join(", ")}] `
          : `[Requested Codes: ${codes.join(", ")}] `;

      setCategory((prev) => prev || "films");
      setMessage((prev) => {
        const stripped = prev
          .replace(/^\[الأكواد المطلوبة:[^\]]*\]\s*/, "")
          .replace(/^\[Requested Codes:[^\]]*\]\s*/, "");
        return `${prefix}${stripped}`;
      });
    },
    [locale]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ codes?: string[] }>;
      if (custom.detail?.codes && Array.isArray(custom.detail.codes)) {
        applySkuCodesToMessage(custom.detail.codes);
      }
    };
    window.addEventListener("asa:fill-inquiry-skus", handler);
    return () => {
      window.removeEventListener("asa:fill-inquiry-skus", handler);
    };
  }, [applySkuCodesToMessage]);

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const validateClientSide = (): InquiryFieldErrors => {
    const errors: InquiryFieldErrors = {};
    const parsed = inquiryRequestSchema.safeParse({
      fullName,
      company,
      email,
      phone,
      category,
      message,
      locale,
      productCode,
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      if (flat.fullName) errors.fullName = dict.inquiry.validation.fullNameMin;
      if (flat.company) errors.company = dict.inquiry.validation.companyMin;
      if (flat.email) errors.email = dict.inquiry.validation.emailInvalid;
      if (flat.phone) errors.phone = dict.inquiry.validation.phoneMin;
      if (flat.category) errors.category = dict.inquiry.validation.categoryRequired;
      if (flat.message) errors.message = dict.inquiry.validation.messageMin;
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const clientErrors = validateClientSide();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatus("error");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          company,
          email,
          phone,
          category,
          message,
          locale,
          productCode,
        }),
      });

      const data = (await response.json()) as InquiryApiResponse;

      if (!response.ok || !data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setServerError(data.serverError ?? dict.inquiry.errorTitle);
        setStatus("error");
        return;
      }

      setReferenceId(data.referenceId ?? "EC-ASA-REQ");
      setStatus("success");
    } catch {
      setServerError(dict.inquiry.errorTitle);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFullName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setCategory(defaultCategory ?? "");
    setMessage(productCode ? `[Grade: ${productCode}] ` : "");
    setFieldErrors({});
    setServerError(null);
    setReferenceId(null);
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div
        className="rounded-[var(--radius-md)] border-2 border-[var(--color-success-border)] bg-[var(--color-success-bg)] p-6 sm:p-8 text-[var(--color-ink)]"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 text-[var(--color-success)] font-bold text-lg">
            <span aria-hidden="true">✓</span>
            <h3>{dict.inquiry.successTitle}</h3>
          </div>
          <p className="text-[var(--color-charcoal)]">
            {dict.inquiry.successBody}:{" "}
            <strong className="font-mono text-[var(--color-navy)]" dir="ltr">
              {referenceId}
            </strong>
          </p>
          <div>
            <button
              type="button"
              onClick={handleReset}
              className="btn-action bg-[var(--color-navy)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)]"
            >
              {dict.inquiry.resetFormBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8 lg:p-10"
      }`}
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      {status === "error" && (
        <div
          className="mb-6 rounded-[var(--radius-sm)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] p-4 text-sm text-[var(--color-error)] font-medium"
          role="alert"
        >
          {serverError ?? dict.inquiry.errorTitle}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`inquiry-name-${productCode ?? "main"}`}
            className="text-sm font-semibold text-[var(--color-ink)]"
          >
            {dict.inquiry.fullNameLabel} <span className="text-[var(--color-crimson)]">*</span>
          </label>
          <input
            id={`inquiry-name-${productCode ?? "main"}`}
            name="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fieldErrors.fullName) {
                setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
              }
            }}
            placeholder={dict.inquiry.fullNamePlaceholder}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={
              fieldErrors.fullName ? `err-name-${productCode ?? "main"}` : undefined
            }
            className="min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]/70"
          />
          {fieldErrors.fullName && (
            <p
              id={`err-name-${productCode ?? "main"}`}
              className="text-xs font-medium text-[var(--color-error)]"
            >
              {fieldErrors.fullName}
            </p>
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`inquiry-company-${productCode ?? "main"}`}
            className="text-sm font-semibold text-[var(--color-ink)]"
          >
            {dict.inquiry.companyLabel} <span className="text-[var(--color-crimson)]">*</span>
          </label>
          <input
            id={`inquiry-company-${productCode ?? "main"}`}
            name="company"
            type="text"
            required
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (fieldErrors.company) {
                setFieldErrors((prev) => ({ ...prev, company: undefined }));
              }
            }}
            placeholder={dict.inquiry.companyPlaceholder}
            aria-invalid={Boolean(fieldErrors.company)}
            aria-describedby={
              fieldErrors.company ? `err-company-${productCode ?? "main"}` : undefined
            }
            className="min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]/70"
          />
          {fieldErrors.company && (
            <p
              id={`err-company-${productCode ?? "main"}`}
              className="text-xs font-medium text-[var(--color-error)]"
            >
              {fieldErrors.company}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`inquiry-email-${productCode ?? "main"}`}
            className="text-sm font-semibold text-[var(--color-ink)]"
          >
            {dict.inquiry.emailLabel} <span className="text-[var(--color-crimson)]">*</span>
          </label>
          <input
            id={`inquiry-email-${productCode ?? "main"}`}
            name="email"
            type="email"
            dir="ltr"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder={dict.inquiry.emailPlaceholder}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? `err-email-${productCode ?? "main"}` : undefined
            }
            className="min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]/70"
          />
          {fieldErrors.email && (
            <p
              id={`err-email-${productCode ?? "main"}`}
              className="text-xs font-medium text-[var(--color-error)]"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Phone / WhatsApp */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`inquiry-phone-${productCode ?? "main"}`}
            className="text-sm font-semibold text-[var(--color-ink)]"
          >
            {dict.inquiry.phoneLabel} <span className="text-[var(--color-crimson)]">*</span>
          </label>
          <input
            id={`inquiry-phone-${productCode ?? "main"}`}
            name="phone"
            type="tel"
            dir="ltr"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) {
                setFieldErrors((prev) => ({ ...prev, phone: undefined }));
              }
            }}
            placeholder={dict.inquiry.phonePlaceholder}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={
              fieldErrors.phone ? `err-phone-${productCode ?? "main"}` : undefined
            }
            className="min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]/70"
          />
          {fieldErrors.phone && (
            <p
              id={`err-phone-${productCode ?? "main"}`}
              className="text-xs font-medium text-[var(--color-error)]"
            >
              {fieldErrors.phone}
            </p>
          )}
        </div>

        {/* Product Category Select */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor={`inquiry-category-${productCode ?? "main"}`}
            className="text-sm font-semibold text-[var(--color-ink)]"
          >
            {dict.inquiry.categoryLabel} <span className="text-[var(--color-crimson)]">*</span>
          </label>
          <select
            id={`inquiry-category-${productCode ?? "main"}`}
            name="category"
            required
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (fieldErrors.category) {
                setFieldErrors((prev) => ({ ...prev, category: undefined }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.category)}
            aria-describedby={
              fieldErrors.category ? `err-category-${productCode ?? "main"}` : undefined
            }
            className="min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
          >
            <option value="">{dict.inquiry.categoryOptions.select}</option>
            <option value="films">{dict.inquiry.categoryOptions.films}</option>
            <option value="granules">{dict.inquiry.categoryOptions.granules}</option>
            <option value="custom">{dict.inquiry.categoryOptions.custom}</option>
          </select>
          {fieldErrors.category && (
            <p
              id={`err-category-${productCode ?? "main"}`}
              className="text-xs font-medium text-[var(--color-error)]"
            >
              {fieldErrors.category}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={`inquiry-message-${productCode ?? "main"}`}
              className="text-sm font-semibold text-[var(--color-ink)]"
            >
              {dict.inquiry.messageLabel} <span className="text-[var(--color-crimson)]">*</span>
            </label>
            {selectedSkus.length > 0 && (
              <button
                type="button"
                onClick={() => applySkuCodesToMessage(selectedSkus)}
                className="text-xs font-semibold text-[var(--color-navy)] underline hover:text-[var(--color-crimson)]"
              >
                {locale === "ar"
                  ? `+ إدراج الأكواد المختارة (${selectedSkus.join(", ")})`
                  : `+ Insert Selected Tray Codes (${selectedSkus.join(", ")})`}
              </button>
            )}
          </div>
          <textarea
            id={`inquiry-message-${productCode ?? "main"}`}
            name="message"
            rows={4}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (fieldErrors.message) {
                setFieldErrors((prev) => ({ ...prev, message: undefined }));
              }
            }}
            placeholder={dict.inquiry.messagePlaceholder}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message ? `err-message-${productCode ?? "main"}` : undefined
            }
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] p-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]/70"
          />
          {fieldErrors.message && (
            <p
              id={`err-message-${productCode ?? "main"}`}
              className="text-xs font-medium text-[var(--color-error)]"
            >
              {fieldErrors.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-action w-full sm:w-auto bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)] disabled:opacity-60"
        >
          {status === "submitting" ? dict.inquiry.submittingBtn : dict.inquiry.submitBtn}
        </button>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <a
            href={buildWhatsAppUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-action w-full sm:w-auto bg-[var(--color-whatsapp)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-whatsapp-hover)] text-sm"
          >
            {locale === "ar" ? "طلب سريع عبر واتساب" : "WhatsApp Quick Inquiry"}
          </a>

          <a
            href="mailto:info@egyptchina-asa.example?subject=ASA%20Sample%20%26%20Specification%20Inquiry"
            className="btn-action w-full sm:w-auto bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-sand-border)] hover:border-[var(--color-navy)] text-sm"
          >
            {dict.common.sendEmailBtn}
          </a>
        </div>
      </div>
    </form>
  );
}
