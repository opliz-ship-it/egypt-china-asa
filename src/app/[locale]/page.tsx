import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { EDITORIAL_SLOTS } from "@/data/catalog";
import { HomeHeroShowcase } from "@/components/HomeHeroShowcase";
import {
  ColorCalibrationGaugeIcon,
  ColorSwatchesGridIcon,
  CorrosionShieldIcon,
  PolymerMoleculeIcon,
  UvSunShieldIcon,
} from "@/components/RiverRibbon";
import { FactoryOverviewSection } from "@/components/FactoryOverviewSection";
import { HotProductsAndSwatchExplorer } from "@/components/HotProductsAndSwatchExplorer";
import { ProductionStagesSection } from "@/components/ProductionStagesSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { InquiryForm } from "@/components/InquiryForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  const capabilityIcons = [
    <UvSunShieldIcon key="uv" />,
    <ColorCalibrationGaugeIcon key="gauge" />,
    <PolymerMoleculeIcon key="mol" />,
    <CorrosionShieldIcon key="corr" />,
    <ColorSwatchesGridIcon key="swatches" />,
  ];

  const previewSlots = EDITORIAL_SLOTS.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Section 1: Hero Showcase (2-Slide Manual Switcher) */}
      <HomeHeroShowcase locale={locale} dict={dict} />

      {/* Section 2: 5-Column Core ASA Performance Standards */}
      <section
        aria-labelledby="capabilities-heading"
        className="py-12 lg:py-16 bg-[var(--color-ivory)] border-b border-[var(--color-sand-border)]"
      >
        <div className="catalog-container flex flex-col gap-8">
          <div className="max-w-3xl">
            <h2
              id="capabilities-heading"
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.capabilities.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
              {dict.capabilities.sectionSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {dict.capabilities.items.map((cap, idx) => (
              <article
                key={cap.title}
                className="rounded-[var(--radius-md)] border-t-4 border-t-[var(--color-navy)] border-x border-b border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-5 flex flex-col justify-between gap-4"
                style={{ boxShadow: "var(--shadow-subtle)" }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--color-sand)] border border-[var(--color-sand-border)] flex items-center justify-center">
                      {capabilityIcons[idx]}
                    </div>
                    <span
                      dir="ltr"
                      className="text-xs font-bold text-[var(--color-gold-dark)]"
                    >
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-navy)]">
                    {cap.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--color-charcoal)] leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-sand-border)] flex flex-col gap-0.5">
                  <span className="text-xs text-[var(--color-charcoal)]">
                    {cap.metricLabel}
                  </span>
                  <strong
                    dir="ltr"
                    className="text-xs font-bold text-[var(--color-crimson)]"
                  >
                    {cap.metricValue}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Partnership, Specialization & 3 Core Advantages (#architecture) */}
      <FactoryOverviewSection locale={locale} dict={dict} />

      {/* Section 4: Hot Products & Interactive 5-Swatch Explorer (#products) */}
      <HotProductsAndSwatchExplorer locale={locale} dict={dict} />

      {/* Section 5: Why Choose Us (Deep Blue #08354d Architectural Band) */}
      <WhyChooseUsSection locale={locale} dict={dict} />

      {/* Section 6: 6-Stage Manufacturing & Quality Pipeline */}
      <ProductionStagesSection locale={locale} dict={dict} mode="interactive" />

      {/* Section 7: Sample-to-Application 4-Step Workflow & 5 Selection Criteria */}
      <section
        aria-labelledby="workflow-heading"
        className="py-14 lg:py-20 bg-[var(--color-ivory)] border-b border-[var(--color-sand-border)]"
      >
        <div className="catalog-container flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                id="workflow-heading"
                className="text-[var(--color-navy)] font-bold"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                {dict.workflow.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
                {dict.workflow.subtitle}
              </p>
            </div>

            <Link
              href={`/${locale}/services?tab=purchase#purchase-process`}
              className="btn-action self-start md:self-auto bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)] text-sm"
            >
              {dict.workflow.fullProcessLink}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 4-Step Qualification Flow */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dict.workflow.steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-3"
                  style={{ boxShadow: "var(--shadow-subtle)" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      dir="ltr"
                      className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] text-xs font-bold border border-[var(--color-gold)]"
                    >
                      STEP {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-navy)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* 5 Selection Parameters Ledger */}
            <div className="lg:col-span-5 rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-6 text-[var(--color-on-navy)] flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[var(--color-gold-bright)] border-b border-[var(--color-navy-border)] pb-3">
                {dict.workflow.criteriaTitle}
              </h3>
              <dl className="flex flex-col gap-3">
                {dict.workflow.criteriaList.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] p-3.5 border border-[var(--color-navy-border)]"
                  >
                    <dt className="text-xs sm:text-sm font-bold text-[var(--color-gold-bright)]">
                      {item.label}
                    </dt>
                    <dd className="text-xs sm:text-sm text-[var(--color-on-navy-muted)] mt-1">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: News & Project Cases Preview (Honest [NEWS_ARTICLE_SLOT] / [PROJECT_CASE_SLOT] Cards) */}
      <section
        aria-labelledby="news-preview-heading"
        className="py-14 lg:py-20 bg-[var(--color-sand)] border-b border-[var(--color-sand-border)]"
      >
        <div className="catalog-container flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                id="news-preview-heading"
                className="text-[var(--color-navy)] font-bold"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                {dict.newsPreview.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
                {dict.newsPreview.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/news`}
                className="btn-action bg-[var(--color-navy)] text-[var(--color-on-navy)] border border-[var(--color-gold)] text-sm"
              >
                {dict.newsPreview.viewAllNews}
              </Link>
              <Link
                href={`/${locale}/cases`}
                className="btn-action bg-[var(--color-ivory-elevated)] text-[var(--color-navy)] border border-[var(--color-navy)] text-sm"
              >
                {dict.newsPreview.viewAllCases}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewSlots.map((slot) => {
              const targetHref =
                slot.type === "news"
                  ? `/${locale}/news/${slot.slug}`
                  : `/${locale}/cases/${slot.slug}`;

              return (
                <article
                  key={slot.slug}
                  className="interactive-card rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] flex flex-col justify-between overflow-hidden"
                  style={{ boxShadow: "var(--shadow-subtle)" }}
                >
                  <div>
                    <div className="zoom-frame relative border-b border-[var(--color-sand-border)] bg-[var(--color-navy-deep)]">
                      <img
                        src={slot.image}
                        width={520}
                        height={320}
                        loading="lazy"
                        alt={slot.imageAlt[locale]}
                        className="w-full h-52 object-cover block"
                      />
                      <span
                        dir="ltr"
                        className="absolute top-3 inset-inline-start-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] font-mono text-xs font-bold"
                      >
                        {slot.slotCode}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[var(--color-crimson)]">
                          {slot.categoryLabel[locale]}
                        </span>
                        <span className="font-mono text-[var(--color-charcoal)]">
                          {slot.statusBadge[locale]}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[var(--color-navy)]">
                        <Link href={targetHref} className="hover:underline">
                          {slot.title[locale]}
                        </Link>
                      </h3>

                      <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                        {slot.summary[locale]}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={targetHref}
                      className="btn-action w-full bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-sand-border)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)] text-sm"
                    >
                      {dict.common.viewDetailsBtn}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 8: Direct Inquiry Section (#inquiry) */}
      <section
        id="inquiry"
        aria-labelledby="inquiry-heading"
        className="py-14 lg:py-20 bg-ivory-watermark"
      >
        <div className="catalog-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 flex flex-col gap-5">
              <h2
                id="inquiry-heading"
                className="text-[var(--color-navy)] font-bold"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                {dict.inquiry.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed">
                {dict.inquiry.subtitle}
              </p>

              <div className="rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy)] p-6 text-[var(--color-on-navy)] flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-[var(--color-navy-border)] pb-3">
                  <img
                    src="/assets/opt/emblem-circle-sm.webp"
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    alt={dict.common.brandNameEn}
                    className="w-12 h-12 rounded-full border border-[var(--color-gold)] bg-[var(--color-navy-deep)] object-contain shrink-0"
                  />
                  <div>
                    <strong
                      dir="ltr"
                      className="block font-wordmark text-sm text-[var(--color-gold-bright)]"
                    >
                      {dict.common.brandNameEn}
                    </strong>
                    <span className="text-xs text-[var(--color-on-navy-muted)]">
                      {dict.common.locationLabel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs sm:text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--color-on-navy-muted)]">
                      {dict.footer.emailTitle}:
                    </span>
                    <span
                      dir="ltr"
                      className="font-semibold text-[var(--color-gold-bright)]"
                    >
                      info@egyptchina-asa.example
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--color-on-navy-muted)]">
                      {dict.footer.phoneTitle}:
                    </span>
                    <span className="font-semibold text-[var(--color-gold-bright)]">
                      {dict.common.phonePendingLabel}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/assets/Egypt_China_ASA_Brochure.pdf"
                    download
                    className="btn-action w-full bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)] text-sm"
                  >
                    {dict.common.downloadPdfBtn}
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <InquiryForm locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
