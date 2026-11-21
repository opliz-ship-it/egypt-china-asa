"use client";

import React, { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ProductItem } from "@/data/catalog";

interface ProductDetailTabsClientProps {
  locale: Locale;
  product: ProductItem;
}

export function ProductDetailTabsClient({
  locale,
  product,
}: ProductDetailTabsClientProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "advantages" | "applications">(
    "specs"
  );

  const activeImage =
    product.galleryImages[selectedImageIdx] ?? product.galleryImages[0];

  return (
    <div className="flex flex-col gap-10">
      {/* Gallery Viewer */}
      <div className="flex flex-col gap-3">
        <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy-deep)] overflow-hidden">
          {activeImage.isClientSlot ? (
            <div className="w-full aspect-[16/10] flex flex-col items-center justify-center gap-3 p-8 text-center bg-[var(--color-navy)] text-[var(--color-on-navy)]">
              <span
                dir="ltr"
                className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] border border-[var(--color-gold)] font-mono text-sm font-bold text-[var(--color-gold-bright)]"
              >
                {activeImage.slotCode ?? "[CLIENT_ASSET_SLOT]"}
              </span>
              <p className="text-sm text-[var(--color-on-navy-muted)] max-w-md">
                {activeImage.alt[locale]}
              </p>
            </div>
          ) : (
            <img
              src={activeImage.src}
              width={720}
              height={450}
              fetchPriority="high"
              alt={activeImage.alt[locale]}
              className="w-full aspect-[16/10] object-cover block"
            />
          )}
        </div>

        {/* Gallery Thumbnail Switcher */}
        <div className="grid grid-cols-3 gap-3">
          {product.galleryImages.map((img, idx) => {
            const isSelected = idx === selectedImageIdx;
            return (
              <button
                key={img.slotCode ?? img.src}
                type="button"
                onClick={() => setSelectedImageIdx(idx)}
                aria-pressed={isSelected}
                className={`min-h-[64px] rounded-[var(--radius-sm)] border overflow-hidden p-1.5 flex items-center justify-center text-center transition-colors duration-150 ${
                  isSelected
                    ? "border-2 border-[var(--color-gold)] bg-[var(--color-navy)] text-[var(--color-gold-bright)]"
                    : "border-[var(--color-sand-border)] bg-[var(--color-sand)] text-[var(--color-ink)] hover:border-[var(--color-navy)]"
                }`}
              >
                {img.isClientSlot ? (
                  <span dir="ltr" className="font-mono text-xs font-semibold px-2">
                    {img.slotCode}
                  </span>
                ) : (
                  <img
                    src={img.src}
                    width={180}
                    height={110}
                    loading="lazy"
                    alt={img.alt[locale]}
                    className="w-full h-16 object-cover rounded-[var(--radius-xs)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Tab Technical Panel (Specifications, Advantages, Applications with #c59b48 Gold top active border) */}
      <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden">
        <div
          role="tablist"
          aria-label={
            locale === "ar" ? "الأقسام الفنية للمنتج" : "Product technical tabs"
          }
          className="grid grid-cols-1 sm:grid-cols-3 border-b border-[var(--color-sand-border)] bg-[var(--color-sand)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "specs"}
            onClick={() => setActiveTab("specs")}
            className={`min-h-[48px] px-4 py-3 text-sm font-bold transition-colors duration-150 ${
              activeTab === "specs"
                ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-t-4 border-t-[var(--color-gold)]"
                : "text-[var(--color-ink)] hover:bg-[var(--color-ivory)]"
            }`}
          >
            {locale === "ar"
              ? "01. جدول المواصفات (Specifications)"
              : "01. Technical Specifications"}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "advantages"}
            onClick={() => setActiveTab("advantages")}
            className={`min-h-[48px] px-4 py-3 text-sm font-bold transition-colors duration-150 ${
              activeTab === "advantages"
                ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-t-4 border-t-[var(--color-gold)]"
                : "text-[var(--color-ink)] hover:bg-[var(--color-ivory)]"
            }`}
          >
            {locale === "ar"
              ? "02. المزايا الهندسية (Advantages)"
              : "02. Engineering Advantages"}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "applications"}
            onClick={() => setActiveTab("applications")}
            className={`min-h-[48px] px-4 py-3 text-sm font-bold transition-colors duration-150 ${
              activeTab === "applications"
                ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-t-4 border-t-[var(--color-gold)]"
                : "text-[var(--color-ink)] hover:bg-[var(--color-ivory)]"
            }`}
          >
            {locale === "ar"
              ? "03. مجالات التطبيق (Applications)"
              : "03. Industrial Applications"}
          </button>
        </div>

        <div className="p-6 sm:p-8" aria-live="polite">
          {activeTab === "specs" && (
            <div className="flex flex-col gap-5">
              <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--color-sand-border)]">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[var(--color-navy)] text-[var(--color-on-navy)]">
                      <th scope="col" className="p-3.5 text-start font-bold">
                        {locale === "ar" ? "الخاصية الهندسية" : "Engineering Property"}
                      </th>
                      <th scope="col" className="p-3.5 text-start font-bold">
                        {locale === "ar" ? "القيمة القياسية" : "Reference Value"}
                      </th>
                      <th scope="col" className="p-3.5 text-start font-bold">
                        {locale === "ar" ? "معيار الفحص" : "Test Standard"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specifications.map((row, idx) => (
                      <tr
                        key={row.method + idx}
                        className={
                          idx % 2 === 0
                            ? "bg-[var(--color-ivory)]"
                            : "bg-[var(--color-sand)]/60"
                        }
                      >
                        <td className="p-3.5 font-semibold text-[var(--color-ink)] border-t border-[var(--color-sand-border)]">
                          {row.property[locale]}
                        </td>
                        <td
                          dir="ltr"
                          className="p-3.5 font-mono font-bold text-[var(--color-crimson)] border-t border-[var(--color-sand-border)]"
                        >
                          {row.value}
                        </td>
                        <td
                          dir="ltr"
                          className="p-3.5 font-mono text-[var(--color-charcoal)] border-t border-[var(--color-sand-border)]"
                        >
                          {row.method}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4">
                <strong className="block text-sm font-bold text-[var(--color-navy)] mb-1">
                  {locale === "ar"
                    ? "توصيات التشغيل على خطوط الإنتاج:"
                    : "Production Line Processing Guidance:"}
                </strong>
                <p className="text-sm text-[var(--color-charcoal)]">
                  {product.processingNotes[locale]}
                </p>
              </div>
            </div>
          )}

          {activeTab === "advantages" && (
            <ul className="flex flex-col gap-3.5">
              {product.advantages[locale].map((adv) => (
                <li
                  key={adv}
                  className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] p-4"
                >
                  <span
                    aria-hidden="true"
                    className="w-6 h-6 rounded-full bg-[var(--color-navy)] text-[var(--color-gold-bright)] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  >
                    ✓
                  </span>
                  <span className="text-sm sm:text-base text-[var(--color-ink)]">
                    {adv}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "applications" && (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.applications[locale].map((app, i) => (
                <li
                  key={app}
                  className="rounded-[var(--radius-sm)] border-t-4 border-t-[var(--color-navy)] border-x border-b border-[var(--color-sand-border)] bg-[var(--color-ivory)] p-5 flex flex-col gap-2"
                >
                  <span
                    dir="ltr"
                    className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                  >
                    0{i + 1}
                  </span>
                  <p className="text-sm font-semibold text-[var(--color-ink)] leading-relaxed">
                    {app}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
