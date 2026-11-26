"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import {
  PRODUCT_CATEGORIES,
  PRODUCTS,
  type ProductCategorySlug,
} from "@/data/catalog";
import { ErpRoofSheetCatalogExplorer } from "@/components/HotProductsAndSwatchExplorer";

interface ProductsArchiveClientProps {
  locale: Locale;
  dict: Dictionary;
  initialCategory?: string;
}

const ITEMS_PER_PAGE = 6;

export function ProductsArchiveClient({
  locale,
  dict,
  initialCategory,
}: ProductsArchiveClientProps) {
  const validInitialCategory = PRODUCT_CATEGORIES.some(
    (c) => c.slug === initialCategory
  )
    ? (initialCategory as ProductCategorySlug)
    : "all";

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ProductCategorySlug
  >(validInitialCategory);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        product.title[locale].toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q) ||
        product.shortSummary[locale].toLowerCase().includes(q) ||
        product.specifications.some(
          (s) =>
            s.property[locale].toLowerCase().includes(q) ||
            s.value.toLowerCase().includes(q) ||
            s.method.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedCategory, filterText, locale]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: "all" | ProductCategorySlug) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Horizontal Category Filter Bar + Technical Search Input */}
      <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label={dict.nav.products}
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            onClick={() => handleCategoryChange("all")}
            className={`min-h-[44px] px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold border transition-colors duration-150 ${
              selectedCategory === "all"
                ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-t-4 border-t-[var(--color-gold)] border-x-[var(--color-navy)] border-b-[var(--color-navy)]"
                : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
            }`}
          >
            {dict.nav.productsItems.all} ({PRODUCTS.length})
          </button>

          {PRODUCT_CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`min-h-[44px] px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold border transition-colors duration-150 ${
                  isSelected
                    ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-t-4 border-t-[var(--color-gold)] border-x-[var(--color-navy)] border-b-[var(--color-navy)]"
                    : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
                }`}
              >
                {cat.name[locale]} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 min-w-0 lg:w-72">
          <label htmlFor="archive-filter-input" className="sr-only">
            {dict.common.searchButton}
          </label>
          <input
            id="archive-filter-input"
            type="search"
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              locale === "ar"
                ? "تصفية بالكود أو معيار ISO..."
                : "Filter by code or ISO method..."
            }
            className="w-full min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3.5 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]/70"
          />
        </div>
      </div>

      {/* Empty Filter State (R-27) */}
      {paginatedProducts.length === 0 ? (
        <div
          role="status"
          className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-8 text-center flex flex-col items-center gap-4"
        >
          <p className="text-base font-semibold text-[var(--color-navy)]">
            {dict.common.searchEmpty}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setFilterText("");
              setCurrentPage(1);
            }}
            className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)]"
          >
            {dict.common.searchReset}
          </button>
        </div>
      ) : (
        <>
          {/* Responsive 2-Column Grid for balanced layout across 2 or 4 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedProducts.map((product) => (
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
                      className="w-full h-56 object-cover block"
                    />
                    <span
                      dir="ltr"
                      className="absolute top-3 inset-inline-end-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] font-mono text-xs font-bold"
                    >
                      {product.code}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <span className="text-xs font-semibold text-[var(--color-crimson)]">
                      {product.categoryName[locale]}
                    </span>
                    <h2 className="text-lg font-bold text-[var(--color-navy)]">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="hover:underline"
                      >
                        {product.title[locale]}
                      </Link>
                    </h2>
                    <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                      {product.shortSummary[locale]}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex flex-col gap-4">
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

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-xs sm:text-sm"
                    >
                      {dict.common.viewDetailsBtn}
                    </Link>
                    <Link
                      href={`/${locale}/products/${product.slug}#inquiry`}
                      className="btn-action bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-sand-border)] hover:border-[var(--color-navy)] text-xs sm:text-sm"
                    >
                      {dict.common.requestQuoteBtn}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          <nav
            aria-label={locale === "ar" ? "ترقيم صفحات المنتجات" : "Products pagination"}
            className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-sand-border)]"
          >
            <span className="text-sm text-[var(--color-charcoal)]">
              {locale === "ar"
                ? `عرض ${paginatedProducts.length} من إجمالي ${filteredProducts.length} صنفاً معتمداً`
                : `Showing ${paginatedProducts.length} of ${filteredProducts.length} verified ASA grades`}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="min-h-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] text-sm font-semibold text-[var(--color-navy)] disabled:opacity-40"
              >
                {dict.common.prevSlide}
              </button>
              <span className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] font-mono text-sm font-bold border border-[var(--color-gold)]">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="min-h-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] text-sm font-semibold text-[var(--color-navy)] disabled:opacity-40"
              >
                {dict.common.nextSlide}
              </button>
            </div>
          </nav>
        </>
      )}

      {/* 13-SKU ERP Color Catalog, Live Roof Sheet Previewer & Multi-SKU Sample Tray */}
      <div className="pt-6 border-t border-[var(--color-sand-border)]">
        <ErpRoofSheetCatalogExplorer locale={locale} dict={dict} />
      </div>
    </div>
  );
}
