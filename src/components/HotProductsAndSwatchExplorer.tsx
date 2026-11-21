"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import {
  PRODUCT_CATEGORIES,
  PRODUCTS,
  type ProductCategorySlug,
} from "@/data/catalog";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";

interface HotProductsAndSwatchExplorerProps {
  locale: Locale;
  dict: Dictionary;
}

export function ErpRoofSheetCatalogExplorer({
  locale,
  dict,
}: HotProductsAndSwatchExplorerProps) {
  const {
    skus,
    categories,
    selectedSkus,
    toggleSku,
    removeSku,
    clearSkus,
    buildWhatsAppUrl,
    sendSkusToInquiryForm,
  } = useSupabaseCatalog();

  const [layerFilter, setLayerFilter] = useState<string>("all");
  const [skuSearch, setSkuSearch] = useState<string>("");
  const [activeCode, setActiveCode] = useState<string>("RAL5012");
  const [previewMode, setPreviewMode] = useState<"sheet" | "specimen">("sheet");

  const filteredSkus = useMemo(() => {
    const q = skuSearch.trim().toLowerCase();
    return skus.filter((sku) => {
      const matchesLayer =
        layerFilter === "all" ||
        sku.categorySlug === layerFilter ||
        sku.category.toLowerCase().includes(layerFilter.toLowerCase());
      if (!matchesLayer) return false;
      if (!q) return true;
      return (
        sku.code.toLowerCase().includes(q) ||
        sku.colorEn.toLowerCase().includes(q) ||
        sku.colorAr.toLowerCase().includes(q) ||
        sku.colorZh.toLowerCase().includes(q) ||
        sku.category.toLowerCase().includes(q)
      );
    });
  }, [skus, layerFilter, skuSearch]);

  const activeSku = useMemo(() => {
    return (
      skus.find((s) => s.code === activeCode) ??
      filteredSkus[0] ??
      skus[0]
    );
  }, [skus, activeCode, filteredSkus]);

  const isActiveSelected = activeSku
    ? selectedSkus.includes(activeSku.code)
    : false;

  return (
    <div
      id="erp-swatch-catalog"
      className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-sand)] p-5 sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-6">
        {/* Header + Layer Filter Tabs + Code Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--color-sand-border)] pb-5">
          <div>
            <h3
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-xl)" }}
            >
              {dict.swatchExplorer.title}
            </h3>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
              {dict.swatchExplorer.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 min-w-0 lg:w-72">
            <label htmlFor="erp-sku-search" className="sr-only">
              {dict.common.searchButton}
            </label>
            <input
              id="erp-sku-search"
              type="search"
              value={skuSearch}
              onChange={(e) => setSkuSearch(e.target.value)}
              placeholder={
                locale === "ar"
                  ? "ابحث بالكود (مثل RAL5012 أو CMO96398)..."
                  : "Search by code (e.g. RAL5012, CMO96398)..."
              }
              className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] px-3.5 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]/75"
            />
          </div>
        </div>

        {/* Layer Filter Tabs (All 13 / ASA Film Top 10 / ASA Film Bottom 3 + Dynamic Categories) */}
        <div
          role="tablist"
          aria-label={
            locale === "ar"
              ? "تصفية أكواد أفلام ASA حسب الطبقة"
              : "Filter ASA film codes by layer"
          }
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={layerFilter === "all"}
            onClick={() => setLayerFilter("all")}
            className={`min-h-[44px] px-4 py-2 rounded-[var(--radius-sm)] text-xs sm:text-sm font-bold border transition-colors duration-150 ${
              layerFilter === "all"
                ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-2 border-[var(--color-gold)]"
                : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
            }`}
          >
            {locale === "ar"
              ? `جميع الأكواد المعتمدة (${skus.length})`
              : `All Certified Codes (${skus.length})`}
          </button>

          {categories.map((cat) => {
            const count = skus.filter(
              (s) =>
                s.categorySlug === cat.slug ||
                s.category.toLowerCase().includes(cat.slug.toLowerCase())
            ).length;
            const isSelected = layerFilter === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setLayerFilter(cat.slug)}
                className={`min-h-[44px] px-4 py-2 rounded-[var(--radius-sm)] text-xs sm:text-sm font-bold border transition-colors duration-150 ${
                  isSelected
                    ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-2 border-[var(--color-gold)]"
                    : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
                }`}
              >
                {locale === "ar" ? cat.nameAr : cat.nameEn} ({count})
              </button>
            );
          })}
        </div>

        {/* 13-SKU Interactive Swatch Selector Grid */}
        {filteredSkus.length === 0 ? (
          <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 text-center flex flex-col items-center gap-3">
            <p className="text-sm font-semibold text-[var(--color-navy)]">
              {dict.common.searchEmpty}
            </p>
            <button
              type="button"
              onClick={() => {
                setLayerFilter("all");
                setSkuSearch("");
              }}
              className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-xs"
            >
              {dict.common.searchReset}
            </button>
          </div>
        ) : (
          <div
            role="group"
            aria-label={dict.swatchExplorer.title}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          >
            {filteredSkus.map((sku) => {
              const isSelected = activeSku?.code === sku.code;
              const isInTray = selectedSkus.includes(sku.code);
              const isBottom = sku.categorySlug === "bottom";

              return (
                <div
                  key={sku.code}
                  className={`rounded-[var(--radius-sm)] border flex flex-col justify-between overflow-hidden transition-colors duration-150 ${
                    isSelected
                      ? "bg-[var(--color-navy)] text-[var(--color-on-navy)] border-2 border-[var(--color-gold)]"
                      : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveCode(sku.code)}
                    className="w-full p-3 text-start flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span
                        aria-hidden="true"
                        className="w-8 h-8 rounded-[var(--radius-xs)] border border-[var(--color-gold)] shrink-0"
                        style={{ backgroundColor: sku.colorToken }}
                      />
                      <span
                        dir="ltr"
                        className={`px-2 py-0.5 rounded-[var(--radius-xs)] font-mono text-xs font-bold border ${
                          isSelected
                            ? "bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border-[var(--color-gold)]"
                            : "bg-[var(--color-sand)] text-[var(--color-navy)] border-[var(--color-sand-border)]"
                        }`}
                      >
                        {sku.code}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      <strong className="text-xs sm:text-sm font-bold leading-snug truncate">
                        {locale === "ar" ? sku.colorAr : sku.colorEn}
                      </strong>
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span
                          dir="ltr"
                          className={
                            isSelected
                              ? "text-[var(--color-gold)] font-semibold"
                              : isBottom
                                ? "text-[var(--color-navy)] font-semibold"
                                : "text-[var(--color-crimson)] font-semibold"
                          }
                        >
                          {sku.category}
                        </span>
                        <span
                          dir="ltr"
                          className={
                            isSelected
                              ? "text-[var(--color-on-navy-muted)]"
                              : "text-[var(--color-charcoal)]"
                          }
                        >
                          {sku.colorZh}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div
                    className={`px-3 py-1.5 border-t flex items-center justify-between gap-2 ${
                      isSelected
                        ? "border-[var(--color-navy-border)] bg-[var(--color-navy-deep)]"
                        : "border-[var(--color-sand-border)] bg-[var(--color-sand)]/50"
                    }`}
                  >
                    <span
                      dir="ltr"
                      className={`font-mono text-xs ${
                        isSelected
                          ? "text-[var(--color-on-navy-muted)]"
                          : "text-[var(--color-charcoal)]"
                      }`}
                    >
                      #{String(sku.itemNo).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleSku(sku.code)}
                      aria-pressed={isInTray}
                      className={`min-h-[36px] px-2.5 py-1 rounded-[var(--radius-xs)] text-xs font-bold border transition-colors duration-150 ${
                        isInTray
                          ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)] border-[var(--color-gold)]"
                          : isSelected
                            ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)]"
                            : "bg-[var(--color-ivory-elevated)] text-[var(--color-navy)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
                      }`}
                    >
                      {isInTray
                        ? locale === "ar"
                          ? "✓ في سلة العينات"
                          : "✓ In Sample Tray"
                        : locale === "ar"
                          ? "+ أضف للعينة"
                          : "+ Add Sample"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Swatch Live Photorealistic Corrugated Roof Sheet Previewer & Specification Panel */}
        {activeSku && (
          <div
            aria-live="polite"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-5 sm:p-6 text-[var(--color-on-navy)]"
          >
            {/* Left/Start Column: Live Color-Shifting Corrugated Roof Sheet Studio Preview */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[var(--color-gold-bright)]">
                  {locale === "ar"
                    ? "معاينة حية للون على لوح سقف مموج ASA"
                    : "Live ASA Corrugated Roof Sheet Color Preview"}
                </span>

                <div className="inline-flex rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("sheet")}
                    aria-pressed={previewMode === "sheet"}
                    className={`min-h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] text-xs font-semibold ${
                      previewMode === "sheet"
                        ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)]"
                        : "text-[var(--color-on-navy-muted)]"
                    }`}
                  >
                    {locale === "ar" ? "لوح السقف" : "Roof Sheet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("specimen")}
                    aria-pressed={previewMode === "specimen"}
                    className={`min-h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] text-xs font-semibold ${
                      previewMode === "specimen"
                        ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)]"
                        : "text-[var(--color-on-navy-muted)]"
                    }`}
                  >
                    {locale === "ar" ? "صورة الخامة" : "Specimen"}
                  </button>
                </div>
              </div>

              {previewMode === "sheet" ? (
                <div className="roof-sheet-stage rounded-[var(--radius-sm)] border-2 border-[var(--color-gold)]">
                  <div
                    className="roof-sheet-tint"
                    style={
                      {
                        "--active-swatch-color": activeSku.colorToken,
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src="/assets/opt/asa-sheet-studio.png"
                      width={1024}
                      height={447}
                      alt={
                        locale === "ar"
                          ? `معاينة لوح سقف مموج ASA باللون ${activeSku.colorAr} (${activeSku.code})`
                          : `Corrugated ASA roof sheet preview in ${activeSku.colorEn} (${activeSku.code})`
                      }
                      className="w-full h-auto block select-none"
                    />
                  </div>

                  <div className="bg-[var(--color-navy-deep)] border-t border-[var(--color-gold)] px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full border border-[var(--color-gold)] inline-block"
                        style={{ backgroundColor: activeSku.colorToken }}
                      />
                      <strong
                        dir="ltr"
                        className="font-mono text-[var(--color-gold-bright)]"
                      >
                        {activeSku.code}
                      </strong>
                      <span className="text-[var(--color-on-navy-muted)]">
                        ({activeSku.category})
                      </span>
                    </div>
                    <span
                      dir="ltr"
                      className="text-[var(--color-gold)] font-semibold"
                    >
                      {activeSku.colorEn} : {activeSku.colorZh}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="zoom-frame rounded-[var(--radius-sm)] border-2 border-[var(--color-gold)]">
                  <img
                    src={activeSku.specimenImage}
                    width={540}
                    height={340}
                    loading="lazy"
                    alt={
                      locale === "ar"
                        ? `${activeSku.colorAr} (${activeSku.code})`
                        : `${activeSku.colorEn} (${activeSku.code})`
                    }
                    className="w-full h-56 sm:h-64 object-cover block"
                  />
                </div>
              )}
            </div>

            {/* Right/End Column: Active SKU Technical Details & Actions */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-navy-border)] pb-3">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xl font-bold text-[var(--color-gold-bright)]">
                    {locale === "ar" ? activeSku.colorAr : activeSku.colorEn}
                  </h4>
                  <span
                    dir="ltr"
                    className="text-xs text-[var(--color-on-navy-muted)]"
                  >
                    {activeSku.category} : {activeSku.colorZh}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    dir="ltr"
                    className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-crimson)] border border-[var(--color-gold)] font-mono text-xs font-bold text-[var(--color-on-navy)]"
                  >
                    {activeSku.category}
                  </span>
                  <span
                    dir="ltr"
                    className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] border border-[var(--color-gold)] font-mono text-xs font-bold text-[var(--color-gold-bright)]"
                  >
                    {activeSku.code}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] leading-relaxed">
                {activeSku.description[locale]}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] p-3 border border-[var(--color-navy-border)]">
                  <span className="block text-xs text-[var(--color-on-navy-muted)]">
                    {dict.swatchExplorer.activeFinishLabel}
                  </span>
                  <strong className="text-xs sm:text-sm text-[var(--color-gold-bright)]">
                    {activeSku.finish[locale]}
                  </strong>
                </div>
                <div className="rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] p-3 border border-[var(--color-navy-border)]">
                  <span className="block text-xs text-[var(--color-on-navy-muted)]">
                    {dict.swatchExplorer.activeSolarLabel}
                  </span>
                  <strong className="text-xs sm:text-sm text-[var(--color-gold-bright)]">
                    {activeSku.solar[locale]}
                  </strong>
                </div>
                <div className="rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] p-3 border border-[var(--color-navy-border)]">
                  <span className="block text-xs text-[var(--color-on-navy-muted)]">
                    {dict.swatchExplorer.activeSubstrateLabel}
                  </span>
                  <strong className="text-xs sm:text-sm text-[var(--color-gold-bright)]">
                    {activeSku.substrate[locale]}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => toggleSku(activeSku.code)}
                  className={`btn-action text-xs sm:text-sm ${
                    isActiveSelected
                      ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)] border border-[var(--color-gold)]"
                      : "bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-crimson-hover)]"
                  }`}
                >
                  {isActiveSelected
                    ? locale === "ar"
                      ? `✓ الكود ${activeSku.code} مضاف لسلة العينات (إزالة)`
                      : `✓ Code ${activeSku.code} in Sample Tray (Remove)`
                    : locale === "ar"
                      ? `+ إضافة الكود ${activeSku.code} لسلة العينات`
                      : `+ Add Code ${activeSku.code} to Sample Tray`}
                </button>

                <button
                  type="button"
                  onClick={() => sendSkusToInquiryForm([activeSku.code])}
                  className="btn-action bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)] text-xs sm:text-sm"
                >
                  {locale === "ar"
                    ? `طلب عينة ${activeSku.code} في النموذج ↓`
                    : `Request ${activeSku.code} in Form ↓`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feature #6: Multi-SKU Sample Selection Tray & Direct WhatsApp / Form Bar */}
        <div className="rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] p-4 sm:p-5 text-[var(--color-on-navy)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-sm font-bold text-[var(--color-gold-bright)]">
                {locale === "ar"
                  ? `سلة الأكواد المختارة لطلب العينات (${selectedSkus.length}):`
                  : `Selected Sample Tray Codes (${selectedSkus.length}):`}
              </strong>
              {selectedSkus.length > 0 && (
                <button
                  type="button"
                  onClick={clearSkus}
                  className="text-xs text-[var(--color-on-navy-muted)] underline hover:text-[var(--color-gold-bright)]"
                >
                  {locale === "ar" ? "مسح الكل" : "Clear all"}
                </button>
              )}
            </div>

            {selectedSkus.length === 0 ? (
              <p className="text-xs text-[var(--color-on-navy-muted)]">
                {locale === "ar"
                  ? "اضغط على (+ أضف للعينة) على أي كود أعلاه لتجميع عدة ألوان في طلب واحد عبر واتساب أو نموذج العينات."
                  : "Click (+ Add Sample) on any SKU card above to bundle multiple color codes into a single WhatsApp or form inquiry."}
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {selectedSkus.map((code) => {
                  const item = skus.find((s) => s.code === code);
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy)] text-xs font-semibold text-[var(--color-on-navy)]"
                    >
                      {item && (
                        <span
                          aria-hidden="true"
                          className="w-3 h-3 rounded-full border border-[var(--color-gold)] shrink-0"
                          style={{ backgroundColor: item.colorToken }}
                        />
                      )}
                      <span dir="ltr" className="font-mono font-bold text-[var(--color-gold-bright)]">
                        {code}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSku(code)}
                        aria-label={`Remove ${code}`}
                        className="text-[var(--color-on-navy-muted)] hover:text-[var(--color-gold-bright)] font-bold px-1"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={buildWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action bg-[var(--color-whatsapp)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-whatsapp-hover)] text-xs sm:text-sm"
            >
              <span>
                {locale === "ar"
                  ? "طلب الأكواد المختارة عبر واتساب"
                  : "WhatsApp Quick Inquiry"}
              </span>
            </a>

            <button
              type="button"
              onClick={() => sendSkusToInquiryForm()}
              className="btn-action bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-crimson-hover)] text-xs sm:text-sm"
            >
              {locale === "ar"
                ? "تعبئة الأكواد في نموذج الطلب ↓"
                : "Fill Selected Codes in Form ↓"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HotProductsAndSwatchExplorer({
  locale,
  dict,
}: HotProductsAndSwatchExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ProductCategorySlug
  >("all");

  const filteredProducts =
    selectedCategory === "all"
      ? PRODUCTS.slice(0, 3)
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="products"
      className="py-14 lg:py-20 bg-ivory-watermark border-b border-[var(--color-sand-border)]"
    >
      <div className="catalog-container flex flex-col gap-12">
        {/* Part A: Category Filter Tabs + 3-Column Product Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                className="text-[var(--color-navy)] font-bold"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                {dict.nav.productsItems.all}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
                {locale === "ar"
                  ? "اختر فئة المنتج لاستعراض الأصناف القياسية المعتمدة والمواصفات المعملية، أو جرب الـ 13 كود لون مباشرة على لوح السقف أدناه."
                  : "Filter by product line to inspect standard grades and ISO metrics, or preview all 13 ERP film codes on the corrugated roof sheet below."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              <a
                href="#erp-swatch-catalog"
                className="btn-action bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-crimson-hover)] text-xs sm:text-sm"
              >
                {locale === "ar"
                  ? "معاينة الـ 13 كود لون (Top & Bottom) ↓"
                  : "Preview 13 ERP Color Codes ↓"}
              </a>
              <Link
                href={`/${locale}/products`}
                className="btn-action bg-[var(--color-navy)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)] text-xs sm:text-sm"
              >
                {dict.common.viewAllProductsBtn}
              </Link>
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div
            role="tablist"
            aria-label={dict.nav.products}
            className="flex flex-wrap gap-2 border-b border-[var(--color-sand-border)] pb-4"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              className={`min-h-[44px] px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold border transition-colors duration-150 ${
                selectedCategory === "all"
                  ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-t-4 border-t-[var(--color-gold)] border-x-[var(--color-navy)] border-b-[var(--color-navy)]"
                  : "bg-[var(--color-sand)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
              }`}
            >
              {dict.nav.productsItems.all}
            </button>

            {PRODUCT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`min-h-[44px] px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold border transition-colors duration-150 ${
                    isSelected
                      ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-t-4 border-t-[var(--color-gold)] border-x-[var(--color-navy)] border-b-[var(--color-navy)]"
                      : "bg-[var(--color-sand)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
                  }`}
                >
                  {cat.name[locale]}
                </button>
              );
            })}
          </div>

          {/* 3-Column Product Cards Grid (collapsing 3 -> 2 -> 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article
                key={product.slug}
                className="interactive-card rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] flex flex-col justify-between overflow-hidden"
                style={{ boxShadow: "var(--shadow-subtle)" }}
              >
                <div>
                  <div className="zoom-frame relative border-b border-[var(--color-sand-border)] bg-[var(--color-navy-deep)]">
                    <img
                      src={product.primaryImage}
                      width={520}
                      height={340}
                      loading="lazy"
                      alt={product.title[locale]}
                      className="w-full h-52 object-cover block"
                    />
                    <span
                      dir="ltr"
                      className="absolute top-3 inset-inline-end-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] font-mono text-xs font-bold"
                    >
                      {product.code}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <span className="text-xs font-semibold text-[var(--color-crimson)]">
                      {product.categoryName[locale]}
                    </span>

                    <h3 className="text-lg font-bold text-[var(--color-navy)]">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="hover:underline"
                      >
                        {product.title[locale]}
                      </Link>
                    </h3>

                    <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                      {product.shortSummary[locale]}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--color-sand-border)]">
                    {product.keyMetrics.map((m) => (
                      <div key={m.value} className="flex flex-col">
                        <span className="text-xs text-[var(--color-charcoal)]">
                          {m.label[locale]}
                        </span>
                        <strong
                          dir="ltr"
                          className="text-xs font-bold text-[var(--color-navy)]"
                        >
                          {m.value}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="btn-action w-full bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-sand-border)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)] text-sm"
                  >
                    {dict.common.viewDetailsBtn}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Part B: Integrated 13-SKU ERP Color Catalog, Live Roof Sheet Previewer & Multi-SKU Sample Tray */}
        <ErpRoofSheetCatalogExplorer locale={locale} dict={dict} />
      </div>
    </section>
  );
}
