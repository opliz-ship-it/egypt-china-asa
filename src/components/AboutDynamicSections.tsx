"use client";

import React from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";
import { isValidAssetUrl } from "@/lib/supabase";

/** Dynamic badge & factory capacity values synced from Supabase site_settings. */
export function AboutEstablishedBadge({ dict }: { dict: Dictionary }) {
  const { settings } = useSupabaseCatalog();
  return (
    <span className="inline-flex self-start px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] text-xs font-semibold border border-[var(--color-gold)]">
      {settings?.established_year?.trim() || dict.common.yearPendingBadge}
    </span>
  );
}

export function AboutPlantCapacityValue({ dict }: { dict: Dictionary }) {
  const { settings } = useSupabaseCatalog();
  return (
    <strong
      dir="ltr"
      className="block font-mono text-sm font-bold text-[var(--color-crimson)] mt-0.5"
    >
      {settings?.plant_capacity?.trim() || dict.common.clientMetricPending}
    </strong>
  );
}

export interface LabEquipmentItem {
  code: string;
  name: string;
  standard: string;
  purpose: string;
}

/** Lab equipment grid that renders live uploaded photos (lab_01..lab_05) when available in Supabase. */
export function AboutLabEquipmentGrid({
  items,
  locale,
}: {
  items: LabEquipmentItem[];
  locale: Locale;
}) {
  const { media } = useSupabaseCatalog();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((eq) => {
        const slotKey = eq.code.toLowerCase().replace("-", "_");
        const uploadedUrl = media[slotKey];
        const hasPhoto = isValidAssetUrl(uploadedUrl);

        return (
          <article
            key={eq.code}
            className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span
                  dir="ltr"
                  className="font-mono text-xs font-bold px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)]"
                >
                  {eq.code}
                </span>
                <span
                  dir="ltr"
                  className="font-mono text-xs font-semibold text-[var(--color-crimson)]"
                >
                  {eq.standard}
                </span>
              </div>
              <h3 className="text-base font-bold text-[var(--color-navy)]">
                {eq.name}
              </h3>
              <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                {eq.purpose}
              </p>
            </div>

            {hasPhoto ? (
              <div className="pt-3 border-t border-[var(--color-sand-border)]">
                <img
                  src={uploadedUrl}
                  width={420}
                  height={220}
                  loading="lazy"
                  alt={eq.name}
                  className="w-full h-36 object-cover rounded-[var(--radius-xs)] border border-[var(--color-gold)]"
                />
              </div>
            ) : (
              <div className="pt-3 border-t border-[var(--color-sand-border)] text-xs font-semibold text-[var(--color-charcoal)]">
                {locale === "ar"
                  ? `[صورة الجهاز ${eq.code} تُرفع من لوحة التحكم]`
                  : `[LAB_INSTRUMENT_PHOTO_SLOT: ${eq.code}]`}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

/** 3 Certificate cards wired to cert_01..cert_03 media slots uploaded from Admin Portal. */
export function AboutQualificationCertsGrid({ locale }: { locale: Locale }) {
  const { media } = useSupabaseCatalog();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((slotNum) => {
        const slotKey = `cert_0${slotNum}`;
        const certUrl = media[slotKey];
        const hasCert = isValidAssetUrl(certUrl);

        if (hasCert) {
          return (
            <div
              key={slotNum}
              className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-ivory-elevated)] p-4 flex flex-col justify-between gap-3"
            >
              <a
                href={certUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="zoom-frame rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] block"
              >
                <img
                  src={certUrl}
                  width={420}
                  height={280}
                  loading="lazy"
                  alt={
                    locale === "ar"
                      ? `شهادة اعتماد وفحص معملي رقم 0${slotNum}`
                      : `Official Lab & Production Certificate 0${slotNum}`
                  }
                  className="w-full h-48 object-contain bg-[var(--color-ivory)] block"
                />
              </a>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-sand-border)]">
                <strong className="text-sm font-bold text-[var(--color-navy)]">
                  {locale === "ar"
                    ? `شهادة اعتماد وفحص رقم 0${slotNum}`
                    : `Certificate 0${slotNum}`}
                </strong>
                <a
                  href={certUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[var(--color-crimson)] underline"
                >
                  {locale === "ar" ? "تكبير / معاينة" : "Open Full"}
                </a>
              </div>
            </div>
          );
        }

        return (
          <div
            key={slotNum}
            className="rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[220px]"
          >
            <span
              dir="ltr"
              className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] text-xs font-bold border border-[var(--color-gold)]"
            >
              [CERT_UPLOAD_SLOT_0{slotNum}]
            </span>
            <strong className="text-sm font-bold text-[var(--color-navy)]">
              {locale === "ar"
                ? `شهادة اعتماد وفحص معملي رقم 0${slotNum}`
                : `Official Lab & Production Certificate Slot 0${slotNum}`}
            </strong>
            <p className="text-xs text-[var(--color-charcoal)] max-w-xs">
              {locale === "ar"
                ? "تُرفع النسخة الممسوحة ضوئياً من لوحة التحكم لتظهر هنا مباشرة."
                : "Upload verified certificate scans from the Admin Portal to display them here."}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export interface DownloadDocRow {
  id: string;
  title: string;
  format: string;
  status: string;
  href: string;
  isAvailable: boolean;
  downloadLabel?: string;
}

/** Downloads ledger with dynamic Admin override links for DOC-01..03. */
export function AboutDownloadsTable({
  locale,
  dict,
  defaultRows,
}: {
  locale: Locale;
  dict: Dictionary;
  defaultRows: DownloadDocRow[];
}) {
  const { settings } = useSupabaseCatalog();

  const resolvedRows = defaultRows.map((row) => {
    let customUrl = "";
    if (row.id === "DOC-01") {
      customUrl = (
        locale === "ar" ? settings?.doc_catalog_ar : settings?.doc_catalog_en
      ) ?? "";
    } else if (row.id === "DOC-02") {
      customUrl = (
        locale === "ar" ? settings?.doc_brochure_ar : settings?.doc_brochure_en
      ) ?? "";
    } else if (row.id === "DOC-03") {
      customUrl = (
        locale === "ar" ? settings?.doc_tds_ar : settings?.doc_tds_en
      ) ?? "";
    }
    const finalHref = isValidAssetUrl(customUrl) ? customUrl.trim() : row.href;
    return {
      ...row,
      href: finalHref,
      isExternal: finalHref.startsWith("http"),
    };
  });

  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-gold)] bg-[var(--color-navy)] text-[var(--color-gold-bright)]">
            <th scope="col" className="p-4 text-start font-bold">
              ID
            </th>
            <th scope="col" className="p-4 text-start font-bold">
              {locale === "ar" ? "اسم الوثيقة الفنية" : "Document Title"}
            </th>
            <th scope="col" className="p-4 text-start font-bold">
              {locale === "ar" ? "الصيغة والحجم" : "Format & Size"}
            </th>
            <th scope="col" className="p-4 text-start font-bold">
              {locale === "ar" ? "الحالة" : "Status"}
            </th>
            <th scope="col" className="p-4 text-start font-bold">
              {locale === "ar" ? "الإجراء" : "Action"}
            </th>
          </tr>
        </thead>
        <tbody>
          {resolvedRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--color-navy-border)] last:border-b-0"
            >
              <td
                dir="ltr"
                className="p-4 font-mono text-xs text-[var(--color-gold-bright)]"
              >
                {row.id}
              </td>
              <td className="p-4 font-semibold text-[var(--color-on-navy)]">
                {row.title}
              </td>
              <td
                dir="ltr"
                className="p-4 font-mono text-xs text-[var(--color-on-navy-muted)]"
              >
                {row.format}
              </td>
              <td className="p-4 text-xs text-[var(--color-gold-bright)]">
                {row.status}
              </td>
              <td className="p-4">
                {row.isAvailable ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={row.href}
                      target={row.isExternal ? "_blank" : undefined}
                      rel={row.isExternal ? "noopener noreferrer" : undefined}
                      download={!row.isExternal}
                      className="min-h-[44px] inline-flex items-center px-3.5 py-1.5 rounded-[var(--radius-xs)] bg-[var(--color-gold)] text-[var(--color-navy-deep)] font-bold text-xs hover:bg-[var(--color-gold-bright)]"
                    >
                      {row.downloadLabel ?? dict.common.downloadPdfBtn}
                    </a>
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center px-3.5 py-1.5 rounded-[var(--radius-xs)] border border-[var(--color-gold)] text-[var(--color-gold-bright)] font-semibold text-xs hover:bg-[var(--color-navy)]"
                    >
                      {dict.common.previewPdfBtn}
                    </a>
                  </div>
                ) : (
                  <Link
                    href={`/${locale}/contact#inquiry`}
                    className="min-h-[44px] inline-flex items-center px-3.5 py-1.5 rounded-[var(--radius-xs)] border border-[var(--color-navy-border)] bg-[var(--color-navy)] text-xs text-[var(--color-on-navy-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
                  >
                    {dict.common.requestQuoteBtn}
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
