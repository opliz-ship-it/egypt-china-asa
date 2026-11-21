import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, locales } from "@/i18n/config";
import { PRODUCT_CATEGORIES, PRODUCTS } from "@/data/catalog";
import { ProductDetailTabsClient } from "@/components/ProductDetailTabsClient";
import { InquiryForm } from "@/components/InquiryForm";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const paramsList: Array<{ locale: string; slug: string }> = [];
  for (const locale of locales) {
    for (const product of PRODUCTS) {
      paramsList.push({ locale, slug: product.slug });
    }
  }
  return paramsList;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const dict = getDictionary(locale);
  const relatedProducts = PRODUCTS.filter((p) => p.slug !== product.slug).slice(
    0,
    3
  );

  return (
    <div className="flex flex-col">
      {/* Header Band */}
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-8 lg:py-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/${locale}/products`}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm text-[var(--color-gold-bright)] hover:underline"
            >
              <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>
              <span>{dict.common.backToArchive}</span>
            </Link>
            <span
              dir="ltr"
              className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] border border-[var(--color-gold)] font-mono text-xs font-bold text-[var(--color-gold-bright)]"
            >
              {product.code}
            </span>
          </div>

          <h1
            className="text-[var(--color-on-navy)] font-bold"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            {product.title[locale]}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl">
            {product.shortSummary[locale]}
          </p>
        </div>
        <RiverRibbon />
      </section>

      {/* Main Content + Category Sidebar */}
      <section className="py-12 lg:py-16 bg-ivory-watermark">
        <div className="catalog-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Category Sidebar */}
            <aside className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-6">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-5 flex flex-col gap-3">
                <h2 className="text-base font-bold text-[var(--color-navy)] pb-2 border-b border-[var(--color-sand-border)]">
                  {dict.nav.products}
                </h2>
                <ul className="flex flex-col gap-1.5">
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const isCurrent = cat.slug === product.category;
                    return (
                      <li key={cat.slug}>
                        <Link
                          href={`/${locale}/products?category=${cat.slug}`}
                          className={`min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-[var(--radius-sm)] text-sm font-semibold transition-colors duration-150 ${
                            isCurrent
                              ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-s-4 border-[var(--color-gold)]"
                              : "bg-[var(--color-sand)] text-[var(--color-ink)] hover:bg-[var(--color-navy)] hover:text-[var(--color-on-navy)]"
                          }`}
                        >
                          <span>{cat.name[locale]}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Product Summary & Direct Actions Box */}
              <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-6 text-[var(--color-on-navy)] flex flex-col gap-4">
                <span
                  dir="ltr"
                  className="font-mono text-xs text-[var(--color-gold-bright)]"
                >
                  {product.code}
                </span>
                <h2 className="text-lg font-bold text-[var(--color-gold-bright)]">
                  {product.title[locale]}
                </h2>
                <p className="text-sm text-[var(--color-on-navy-muted)] leading-relaxed">
                  {product.description[locale]}
                </p>

                <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-[var(--color-navy-border)]">
                  {product.keyMetrics.map((m) => (
                    <div
                      key={m.value}
                      className="flex items-center justify-between text-xs sm:text-sm"
                    >
                      <span className="text-[var(--color-on-navy-muted)]">
                        {m.label[locale]}:
                      </span>
                      <strong
                        dir="ltr"
                        className="font-mono text-[var(--color-gold-bright)]"
                      >
                        {m.value}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5 pt-3">
                  <a
                    href="#inquiry"
                    className="btn-action w-full bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)]"
                  >
                    {dict.common.requestQuoteBtn}
                  </a>
                  <a
                    href={`mailto:info@egyptchina-asa.example?subject=${encodeURIComponent(
                      `Inquiry: ${product.code}`
                    )}`}
                    className="btn-action w-full bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)]"
                  >
                    {dict.common.sendEmailBtn}
                  </a>
                </div>
              </div>
            </aside>

            {/* Gallery & 3-Tab Technical Panel */}
            <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col gap-12">
              <ProductDetailTabsClient locale={locale} product={product} />

              {/* Inline Inquiry Form (#inquiry) */}
              <div id="inquiry" className="scroll-mt-24 flex flex-col gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-navy)]">
                  {dict.inquiry.title} ({product.code})
                </h2>
                <InquiryForm
                  locale={locale}
                  dict={dict}
                  defaultCategory={product.category}
                  productCode={product.code}
                  compact
                />
              </div>
            </div>
          </div>

          {/* Related Products Grid */}
          <div className="mt-16 pt-12 border-t border-[var(--color-sand-border)] flex flex-col gap-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-navy)]">
              {locale === "ar"
                ? "أصناف ASA ذات صلة"
                : "Related ASA Polymer Grades"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <article
                  key={rel.slug}
                  className="interactive-card rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="zoom-frame rounded-[var(--radius-sm)] border border-[var(--color-sand-border)]">
                      <img
                        src={rel.primaryImage}
                        width={420}
                        height={260}
                        loading="lazy"
                        alt={rel.title[locale]}
                        className="w-full h-44 object-cover block"
                      />
                    </div>
                    <span
                      dir="ltr"
                      className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                    >
                      {rel.code}
                    </span>
                    <h3 className="text-base font-bold text-[var(--color-navy)]">
                      <Link
                        href={`/${locale}/products/${rel.slug}`}
                        className="hover:underline"
                      >
                        {rel.title[locale]}
                      </Link>
                    </h3>
                  </div>
                  <Link
                    href={`/${locale}/products/${rel.slug}`}
                    className="btn-action w-full bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-sand-border)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)] text-sm"
                  >
                    {dict.common.viewDetailsBtn}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
