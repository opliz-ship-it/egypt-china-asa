import React from "react";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { ServicesTabsClient } from "@/components/ServicesTabsClient";
import { InquiryForm } from "@/components/InquiryForm";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ServicesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { tab } = await searchParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col">
      {/* Header Band */}
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-10 lg:py-14 flex flex-col gap-3">
          <h1
            className="text-[var(--color-gold-bright)] font-bold"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {dict.nav.services}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl">
            {locale === "ar"
              ? "منظومة التغليف والتخزين الآمن، مسار التوريد الصناعي من 11 خطوة، الدعم الهندسي لخطوط البثق، وخدمة مطابقة الألوان الطيفية."
              : "Export-grade packaging and storage rules, our 11-step supply chain, 5-pillar extrusion technical support, and spectrophotometer color matching."}
          </p>
        </div>
        <RiverRibbon />
      </section>

      {/* 4-Tile Interactive Services Switcher */}
      <section className="py-12 lg:py-16 bg-ivory-watermark border-b border-[var(--color-sand-border)]">
        <div className="catalog-container">
          <ServicesTabsClient locale={locale} dict={dict} initialTab={tab} />
        </div>
      </section>

      {/* Direct Sample & Technical Support Request */}
      <section id="inquiry" className="py-14 lg:py-20 bg-[var(--color-sand)]">
        <div className="catalog-container max-w-4xl">
          <div className="mb-6">
            <h2
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.inquiry.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
              {dict.inquiry.subtitle}
            </p>
          </div>
          <InquiryForm locale={locale} dict={dict} />
        </div>
      </section>
    </div>
  );
}
