import React from "react";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { GOOGLE_MAPS_EMBED_URL, GOOGLE_MAPS_URL } from "@/data/catalog";
import { ContactSummaryCard } from "@/components/ContactSummaryCard";
import { InquiryForm } from "@/components/InquiryForm";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;

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
            {dict.nav.contact}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl">
            {dict.inquiry.subtitle}
          </p>
        </div>
        <RiverRibbon />
      </section>

      {/* Contact Summary Card + Interactive Inquiry Form */}
      <section
        id="inquiry"
        className="py-12 lg:py-16 bg-ivory-watermark border-b border-[var(--color-sand-border)]"
      >
        <div className="catalog-container grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Live Supabase-Synced Contact Summary Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ContactSummaryCard locale={locale} dict={dict} />
          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <h2
              className="text-[var(--color-navy)] font-bold mb-4"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.inquiry.title}
            </h2>
            <InquiryForm locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      {/* Responsive Embedded Google Maps Iframe (R-40: explicit title, width, height, aspect-ratio) */}
      <section className="py-12 lg:py-16 bg-[var(--color-sand)]">
        <div className="catalog-container flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-navy)]">
                {locale === "ar"
                  ? "خريطة موقع المصنع في مدينة السادات (30°26'02.2\"N 30°36'45.7\"E)"
                  : "Sadat City Industrial Facility Map (30°26'02.2\"N 30°36'45.7\"E)"}
              </h2>
              <p className="text-sm text-[var(--color-charcoal)]">
                {dict.common.locationLabel}
              </p>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action self-start sm:self-auto bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
            >
              {dict.common.openMapAction}
            </a>
          </div>

          <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy-deep)] overflow-hidden">
            <iframe
              title={
                locale === "ar"
                  ? "موقع مصنع شركة مصر الصين لـ ASA في مدينة السادات"
                  : "EGYPT CHINA FOR ASA Sadat City Factory Location Map"
              }
              src={GOOGLE_MAPS_EMBED_URL}
              width="1280"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-80 sm:h-96 border-0 block"
              style={{ aspectRatio: "16 / 6" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
