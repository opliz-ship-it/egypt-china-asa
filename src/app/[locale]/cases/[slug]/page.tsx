import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, locales } from "@/i18n/config";
import { EDITORIAL_SLOTS } from "@/data/catalog";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const caseItems = EDITORIAL_SLOTS.filter((i) => i.type === "case");
  const out: Array<{ locale: string; slug: string }> = [];
  for (const locale of locales) {
    for (const item of caseItems) {
      out.push({ locale, slug: item.slug });
    }
  }
  return out;
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const caseItems = EDITORIAL_SLOTS.filter((i) => i.type === "case");
  const index = caseItems.findIndex((i) => i.slug === slug);
  if (index === -1) {
    notFound();
  }

  const item = caseItems[index];
  const prevItem = caseItems[(index - 1 + caseItems.length) % caseItems.length];
  const nextItem = caseItems[(index + 1) % caseItems.length];
  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col">
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-8 lg:py-12 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/${locale}/cases`}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm text-[var(--color-gold-bright)] hover:underline"
            >
              <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>
              <span>{dict.newsPreview.viewAllCases}</span>
            </Link>
            <span
              dir="ltr"
              className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] border border-[var(--color-gold)] font-mono text-xs font-bold text-[var(--color-gold-bright)]"
            >
              {item.slotCode}
            </span>
          </div>

          <h1
            className="text-[var(--color-on-navy)] font-bold"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            {item.title[locale]}
          </h1>
        </div>
        <RiverRibbon />
      </section>

      <section className="py-12 lg:py-16 bg-ivory-watermark">
        <div className="catalog-container max-w-4xl flex flex-col gap-8">
          <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy-deep)] overflow-hidden">
            <img
              src={item.image}
              width={860}
              height={460}
              fetchPriority="high"
              alt={item.imageAlt[locale]}
              className="w-full aspect-[16/9] object-cover block"
            />
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 sm:p-8 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--color-sand-border)]">
              <span className="text-sm font-bold text-[var(--color-crimson)]">
                {item.categoryLabel[locale]}
              </span>
              <span className="font-mono text-xs px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-sand)] text-[var(--color-navy)] font-bold">
                {item.statusBadge[locale]}
              </span>
            </div>

            {item.bodyParagraphs[locale].map((p) => (
              <p
                key={p}
                className="text-base text-[var(--color-charcoal)] leading-relaxed"
              >
                {p}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-sand-border)]">
              {item.technicalSpecs.map((spec) => (
                <div
                  key={spec.label.en}
                  className="rounded-[var(--radius-sm)] bg-[var(--color-sand)] p-4 border border-[var(--color-sand-border)]"
                >
                  <span className="block text-xs text-[var(--color-charcoal)]">
                    {spec.label[locale]}
                  </span>
                  <strong className="text-sm font-bold text-[var(--color-navy)]">
                    {spec.value[locale]}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next Navigation */}
          <nav
            aria-label="Case study navigation"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-sand-border)]"
          >
            {prevItem && (
              <Link
                href={`/${locale}/cases/${prevItem.slug}`}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 hover:border-[var(--color-navy)] flex flex-col gap-1"
              >
                <span className="text-xs text-[var(--color-charcoal)]">
                  {dict.common.prevSlide}
                </span>
                <strong className="text-sm font-bold text-[var(--color-navy)]">
                  {prevItem.title[locale]}
                </strong>
              </Link>
            )}
            {nextItem && (
              <Link
                href={`/${locale}/cases/${nextItem.slug}`}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 hover:border-[var(--color-navy)] flex flex-col gap-1 sm:text-end"
              >
                <span className="text-xs text-[var(--color-charcoal)]">
                  {dict.common.nextSlide}
                </span>
                <strong className="text-sm font-bold text-[var(--color-navy)]">
                  {nextItem.title[locale]}
                </strong>
              </Link>
            )}
          </nav>
        </div>
      </section>
    </div>
  );
}
