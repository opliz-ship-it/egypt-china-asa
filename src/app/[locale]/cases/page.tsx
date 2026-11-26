import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { EditorialSlotsGridClient } from "@/components/EditorialSlotsListClient";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CasesArchivePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col">
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-10 lg:py-14 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1
              className="text-[var(--color-gold-bright)] font-bold"
              style={{ fontSize: "var(--text-3xl)" }}
            >
              {dict.nav.newsCasesItems.cases}
            </h1>
            <Link
              href={`/${locale}/news`}
              className="btn-action bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
            >
              {dict.nav.newsCasesItems.news}
            </Link>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl">
            {dict.newsPreview.subtitle}
          </p>
        </div>
        <RiverRibbon />
      </section>

      <section className="py-12 lg:py-16 bg-ivory-watermark">
        <div className="catalog-container">
          <EditorialSlotsGridClient locale={locale} dict={dict} filterType="case" />
        </div>
      </section>
    </div>
  );
}
