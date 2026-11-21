import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { EDITORIAL_SLOTS } from "@/data/catalog";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NewsArchivePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const newsItems = EDITORIAL_SLOTS.filter((item) => item.type === "news");

  return (
    <div className="flex flex-col">
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-10 lg:py-14 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1
              className="text-[var(--color-gold-bright)] font-bold"
              style={{ fontSize: "var(--text-3xl)" }}
            >
              {dict.nav.newsCasesItems.news}
            </h1>
            <Link
              href={`/${locale}/cases`}
              className="btn-action bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
            >
              {dict.nav.newsCasesItems.cases}
            </Link>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl">
            {dict.newsPreview.subtitle}
          </p>
        </div>
        <RiverRibbon />
      </section>

      <section className="py-12 lg:py-16 bg-ivory-watermark">
        <div className="catalog-container grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.slug}
              className="interactive-card rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden flex flex-col justify-between"
              style={{ boxShadow: "var(--shadow-subtle)" }}
            >
              <div>
                <div className="zoom-frame relative border-b border-[var(--color-sand-border)] bg-[var(--color-navy-deep)]">
                  <img
                    src={item.image}
                    width={640}
                    height={380}
                    loading="lazy"
                    alt={item.imageAlt[locale]}
                    className="w-full h-60 object-cover block"
                  />
                  <span
                    dir="ltr"
                    className="absolute top-3 inset-inline-start-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] font-mono text-xs font-bold"
                  >
                    {item.slotCode}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[var(--color-crimson)]">
                      {item.categoryLabel[locale]}
                    </span>
                    <span className="font-mono text-[var(--color-charcoal)]">
                      {item.statusBadge[locale]}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--color-navy)]">
                    <Link
                      href={`/${locale}/news/${item.slug}`}
                      className="hover:underline"
                    >
                      {item.title[locale]}
                    </Link>
                  </h2>

                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                    {item.summary[locale]}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/${locale}/news/${item.slug}`}
                  className="btn-action w-full bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
                >
                  {dict.common.viewDetailsBtn}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
