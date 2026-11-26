"use client";

import React from "react";
import type { Dictionary, Locale } from "@/i18n/config";
import { GOOGLE_MAPS_URL } from "@/data/catalog";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";
import { buildWhatsAppHref, isValidAssetUrl } from "@/lib/supabase";

interface ContactSummaryCardProps {
  locale: Locale;
  dict: Dictionary;
}

/** Live Supabase-synced contact summary card for /[locale]/contact. */
export function ContactSummaryCard({
  locale,
  dict,
}: ContactSummaryCardProps) {
  const { settings } = useSupabaseCatalog();

  const resolvedAddress =
    locale === "ar"
      ? settings?.location_ar?.trim() || dict.common.locationLabel
      : settings?.location_en?.trim() || dict.common.locationLabel;

  const resolvedPhone =
    settings?.phone && !settings.phone.includes("[")
      ? settings.phone.trim()
      : dict.common.phonePendingLabel;

  const resolvedWhatsapp =
    settings?.whatsapp_number && !settings.whatsapp_number.includes("[")
      ? settings.whatsapp_number.trim()
      : dict.common.whatsappPendingLabel;

  const hasValidWhatsapp = Boolean(
    settings?.whatsapp_number && !settings.whatsapp_number.includes("[")
  );

  const resolvedEmail =
    settings?.email && !settings.email.includes("[")
      ? settings.email.trim()
      : null;

  const catalogHref =
    locale === "ar"
      ? isValidAssetUrl(settings?.doc_catalog_ar)
        ? settings!.doc_catalog_ar!.trim()
        : "/assets/ASA_Catalog_AR.pdf"
      : isValidAssetUrl(settings?.doc_catalog_en)
        ? settings!.doc_catalog_en!.trim()
        : "/assets/ASA_Catalog_EN.pdf";

  return (
    <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-6 sm:p-8 text-[var(--color-on-navy)] flex flex-col gap-5">
      <div className="flex items-center gap-3.5 pb-4 border-b border-[var(--color-navy-border)]">
        <img
          src="/assets/opt/emblem-circle-sm.webp"
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          alt={dict.common.brandNameEn}
          className="w-14 h-14 rounded-full border border-[var(--color-gold)] bg-[var(--color-navy-deep)] object-contain shrink-0"
        />
        <div>
          <h2
            dir="ltr"
            className="font-wordmark text-base sm:text-lg font-bold text-[var(--color-gold-bright)]"
          >
            {dict.common.brandNameEn}
          </h2>
          <span dir="ltr" className="text-xs text-[var(--color-on-navy-muted)]">
            {dict.common.brandNameZh}
          </span>
        </div>
      </div>

      <dl className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-[var(--color-on-navy-muted)]">
            {dict.footer.addressTitle}
          </dt>
          <dd className="font-semibold text-[var(--color-on-navy)]">
            {resolvedAddress}
          </dd>
        </div>

        <div className="flex flex-col gap-1 pt-3 border-t border-[var(--color-navy-border)]">
          <dt className="text-xs text-[var(--color-on-navy-muted)]">
            {dict.footer.phoneTitle}
          </dt>
          <dd className="font-mono text-[var(--color-gold-bright)]">
            {resolvedPhone}
          </dd>
        </div>

        <div className="flex flex-col gap-1 pt-3 border-t border-[var(--color-navy-border)]">
          <dt className="text-xs text-[var(--color-on-navy-muted)]">
            {dict.footer.whatsappTitle}
          </dt>
          <dd>
            {hasValidWhatsapp ? (
              <a
                href={buildWhatsAppHref(resolvedWhatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="font-mono text-[var(--color-gold-bright)] underline"
              >
                {resolvedWhatsapp}
              </a>
            ) : (
              <span className="font-mono text-[var(--color-gold-bright)]">
                {resolvedWhatsapp}
              </span>
            )}
          </dd>
        </div>

        <div className="flex flex-col gap-1 pt-3 border-t border-[var(--color-navy-border)]">
          <dt className="text-xs text-[var(--color-on-navy-muted)]">
            {dict.footer.emailTitle}
          </dt>
          <dd>
            <a
              href={
                resolvedEmail
                  ? `mailto:${resolvedEmail}`
                  : "mailto:info@egyptchina-asa.example"
              }
              dir="ltr"
              className="font-mono text-xs sm:text-sm text-[var(--color-gold-bright)] underline"
            >
              {resolvedEmail ?? dict.common.emailPendingLabel}
            </a>
          </dd>
        </div>
      </dl>

      <div className="pt-2 flex flex-col gap-2.5">
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-action w-full bg-[var(--color-gold)] text-[var(--color-navy-deep)] font-bold text-sm"
        >
          {dict.common.openMapAction}
        </a>
        <a
          href={catalogHref}
          target={catalogHref.startsWith("http") ? "_blank" : undefined}
          rel={catalogHref.startsWith("http") ? "noopener noreferrer" : undefined}
          download={!catalogHref.startsWith("http")}
          className="btn-action w-full bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
        >
          {dict.common.downloadPdfBtn}
        </a>
      </div>
    </div>
  );
}

/** Compact live-synced email, phone & PDF download block for the Home inquiry column. */
export function HomeContactMiniPanel({
  locale,
  dict,
}: ContactSummaryCardProps) {
  const { settings } = useSupabaseCatalog();

  const resolvedEmail =
    settings?.email && !settings.email.includes("[")
      ? settings.email.trim()
      : "info@egyptchina-asa.example";

  const resolvedPhone =
    settings?.phone && !settings.phone.includes("[")
      ? settings.phone.trim()
      : settings?.whatsapp_number && !settings.whatsapp_number.includes("[")
        ? settings.whatsapp_number.trim()
        : dict.common.phonePendingLabel;

  const catalogHref =
    locale === "ar"
      ? isValidAssetUrl(settings?.doc_catalog_ar)
        ? settings!.doc_catalog_ar!.trim()
        : "/assets/ASA_Catalog_AR.pdf"
      : isValidAssetUrl(settings?.doc_catalog_en)
        ? settings!.doc_catalog_en!.trim()
        : "/assets/ASA_Catalog_EN.pdf";

  return (
    <>
      <div className="flex flex-col gap-2 text-xs sm:text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-[var(--color-on-navy-muted)]">
            {dict.footer.emailTitle}:
          </span>
          <a
            href={`mailto:${resolvedEmail}`}
            dir="ltr"
            className="font-semibold text-[var(--color-gold-bright)] hover:underline"
          >
            {resolvedEmail}
          </a>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-[var(--color-on-navy-muted)]">
            {dict.footer.phoneTitle}:
          </span>
          <span
            dir="ltr"
            className="font-semibold text-[var(--color-gold-bright)]"
          >
            {resolvedPhone}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <a
          href={catalogHref}
          target={catalogHref.startsWith("http") ? "_blank" : undefined}
          rel={catalogHref.startsWith("http") ? "noopener noreferrer" : undefined}
          download={!catalogHref.startsWith("http")}
          className="btn-action w-full bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)] text-sm"
        >
          {dict.common.downloadPdfBtn}
        </a>
      </div>
    </>
  );
}

/** Dynamic email CTA button wired to live Supabase settings.email. */
export function DynamicEmailActionButton({
  dict,
  subject = "ASA Technical Inquiry",
}: {
  dict: Dictionary;
  subject?: string;
}) {
  const { settings } = useSupabaseCatalog();
  const resolvedEmail =
    settings?.email && !settings.email.includes("[")
      ? settings.email.trim()
      : "info@egyptchina-asa.example";

  return (
    <a
      href={`mailto:${resolvedEmail}?subject=${encodeURIComponent(subject)}`}
      className="btn-action w-full bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)]"
    >
      {dict.common.sendEmailBtn}
    </a>
  );
}
