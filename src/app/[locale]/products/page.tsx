import React from "react";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { ProductsArchiveClient } from "@/components/ProductsArchiveClient";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsArchivePage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col">
      {/* Page Header Band */}
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-10 lg:py-14 flex flex-col gap-3">
          <h1
            className="text-[var(--color-gold-bright)] font-bold"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {dict.nav.productsItems.all}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl leading-relaxed">
            {locale === "ar"
              ? "كتالوج الأصناف المعتمدة لأفلام السطح الهندسية ASA، حبيبات البوليمر، مركبات البثق المشترك، وألواح الأسقف المموجة المصنعة في مدينة السادات."
              : "Complete specification catalog of UV-stabilized ASA surface films, extrusion/injection resin granules, co-extrusion capstock, and corrugated roofing sheets manufactured in Sadat City."}
          </p>
        </div>
        <RiverRibbon />
      </section>

      {/* Archive Filter & Grid */}
      <section className="py-12 lg:py-16 bg-ivory-watermark">
        <div className="catalog-container">
          <ProductsArchiveClient
            locale={locale}
            dict={dict}
            initialCategory={category}
          />
        </div>
      </section>
    </div>
  );
}
