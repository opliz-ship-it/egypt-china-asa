import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { ProductionStagesSection } from "@/components/ProductionStagesSection";
import { RiverRibbon } from "@/components/RiverRibbon";
import {
  AboutDownloadsTable,
  AboutEstablishedBadge,
  AboutLabEquipmentGrid,
  AboutPlantCapacityValue,
  AboutQualificationCertsGrid,
} from "@/components/AboutDynamicSections";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  const labEquipmentList = [
    {
      code: "LAB-01",
      name:
        locale === "ar"
          ? "جهاز القياس الطيفي للألوان واللمعان (Spectrophotometer)"
          : "Spectrophotometer & 60° Gloss Meter",
      standard: "ASTM D2244 / ISO 2813",
      purpose:
        locale === "ar"
          ? "قياس إحداثيات اللون (L*a*b*) والتحقق من بقاء الفارق اللوني ΔE أقل من 1.5 بين التشغيلات."
          : "Measures L*a*b* coordinates and verifies batch-to-batch color tolerance within ΔE < 1.5.",
    },
    {
      code: "LAB-02",
      name:
        locale === "ar"
          ? "جهاز قياس معامل تدفق الذوبان (Melt Flow Indexer)"
          : "Melt Flow Rate Indexer (MFI)",
      standard: "ISO 1133 (220 °C / 10 kg)",
      purpose:
        locale === "ar"
          ? "فحص سيولة ولزوجة المصهور (15 إلى 25 جم/10 دقائق) لضمان انتظام البثق المشترك والحقن."
          : "Verifies polymer melt viscosity (15 to 25 g/10 min) for consistent co-extrusion die flow.",
    },
    {
      code: "LAB-03",
      name:
        locale === "ar"
          ? "جهاز اختبار درجة حرارة التليين فيكات (Vicat Tester)"
          : "Vicat Softening Temperature Apparatus",
      standard: "ISO 306 (Method B/50)",
      purpose:
        locale === "ar"
          ? "التأكد من تحمل المادة لدرجات الحرارة المرتفعة (95 إلى 102 °C) دون تشوه تحت أشعة الشمس."
          : "Confirms thermal distortion stability between 95 and 102 °C for desert roofing exposures.",
    },
    {
      code: "LAB-04",
      name:
        locale === "ar"
          ? "بندول اختبار صدمات شاربي المسننة (Charpy Impact)"
          : "Charpy Notched Impact Pendulum",
      standard: "ISO 179 (23 °C)",
      purpose:
        locale === "ar"
          ? "قياس مقاومة الصدمات الميكانيكية (12 إلى 18 كيلوجول/م²) لضمان متانة الألواح أثناء التركيب."
          : "Tests impact energy absorption (12 to 18 kJ/m²) against hail and mechanical load.",
    },
    {
      code: "LAB-05",
      name:
        locale === "ar"
          ? "غرفة التعتيق المتسارع بالأشعة فوق البنفسجية (QUV Chamber)"
          : "QUV Accelerated Weathering Chamber",
      standard: "ASTM G154 (3000 Hours)",
      purpose:
        locale === "ar"
          ? "تعريض العينات لدورات مكثفة من الأشعة فوق البنفسجية والتكثيف الحراري للتحقق من عدم الاصفرار."
          : "Simulates multi-year solar UV and moisture cycles to certify ΔE < 1.5 retention at 3000 hours.",
    },
  ];

  const downloadsRows: Array<{
    id: string;
    title: string;
    format: string;
    status: string;
    href: string;
    isAvailable: boolean;
    downloadLabel?: string;
  }> = [
    {
      id: "DOC-01",
      title:
        locale === "ar"
          ? "الكتالوج الرسمي الكامل لشركة مصر الصين لـ ASA (8 صفحات العربية PDF)"
          : "EGYPT CHINA FOR ASA Official 8-Page Product Catalog (English PDF)",
      format: locale === "ar" ? "PDF (8.35 MB)" : "PDF (7.96 MB)",
      status: locale === "ar" ? "متاح للتحميل المباشر" : "Verified & Ready",
      href:
        locale === "ar"
          ? "/assets/ASA_Catalog_AR.pdf"
          : "/assets/ASA_Catalog_EN.pdf",
      isAvailable: true,
    },
    {
      id: "DOC-02",
      title:
        locale === "ar"
          ? "البروشور التعريفي الرسمي لشركة مصر الصين لـ ASA (النسخة العربية PDF)"
          : "EGYPT CHINA FOR ASA Official Company Brochure (English PDF)",
      format: locale === "ar" ? "PDF (1.25 MB)" : "PDF (915 KB)",
      status: locale === "ar" ? "متاح للتحميل المباشر" : "Verified & Ready",
      href:
        locale === "ar"
          ? "/assets/ASA_Brochure_AR.pdf"
          : "/assets/ASA_Brochure_EN.pdf",
      isAvailable: true,
      downloadLabel:
        locale === "ar" ? "تحميل البروشور PDF" : "Download Brochure PDF",
    },
    {
      id: "DOC-03",
      title:
        locale === "ar"
          ? "نشرة البيانات الفنية الرسمية لأفلام ASA (النسخة العربية PDF)"
          : "EGYPT CHINA FOR ASA Official Technical Data Sheet (English PDF)",
      format: locale === "ar" ? "PDF (1.36 MB)" : "PDF (986 KB)",
      status: locale === "ar" ? "متاح للتحميل المباشر" : "Verified & Ready",
      href:
        locale === "ar"
          ? "/assets/ASA_TDS_AR.pdf"
          : "/assets/ASA_TDS_EN.pdf",
      isAvailable: true,
      downloadLabel:
        locale === "ar" ? "تحميل الداتا شيت PDF" : "Download Data Sheet PDF",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header Band */}
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-10 lg:py-14 flex flex-col gap-3">
          <h1
            className="text-[var(--color-gold-bright)] font-bold"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {dict.nav.about}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl">
            {dict.partnership.subtitle}
          </p>
        </div>
        <RiverRibbon />
      </section>

      {/* Section 1: Company Overview (#overview) */}
      <section
        id="overview"
        className="py-14 lg:py-20 bg-ivory-watermark border-b border-[var(--color-sand-border)] scroll-mt-20"
      >
        <div className="catalog-container grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <AboutEstablishedBadge dict={dict} />
            <h2
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.partnership.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed">
              {dict.partnership.paragraph1}
            </p>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed">
              {dict.partnership.paragraph2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4">
                <span className="text-xs text-[var(--color-charcoal)]">
                  {locale === "ar" ? "الموقع الصناعي" : "Manufacturing Site"}
                </span>
                <strong className="block text-sm font-bold text-[var(--color-navy)] mt-0.5">
                  {dict.common.locationLabel}
                </strong>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4">
                <span className="text-xs text-[var(--color-charcoal)]">
                  {locale === "ar"
                    ? "الطاقة الإنتاجية والمساحة"
                    : "Plant Capacity & Area"}
                </span>
                <AboutPlantCapacityValue dict={dict} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy)] p-4 text-[var(--color-on-navy)] sm:col-span-2 flex items-center justify-center">
              <img
                src="/assets/opt/factory-facade.webp"
                width={296}
                height={162}
                loading="lazy"
                decoding="async"
                alt={dict.common.brandNameEn}
                className="w-full max-w-[380px] aspect-[296/162] object-cover rounded-[var(--radius-sm)]"
              />
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-3">
              <img
                src="/assets/opt/brand-board-full.webp"
                width={420}
                height={280}
                loading="lazy"
                decoding="async"
                alt={
                  locale === "ar"
                    ? "لوحة الهوية البصرية الرسمية لشركة مصر الصين لـ ASA"
                    : "Official Brand Identity Board of EGYPT CHINA FOR ASA"
                }
                className="w-full h-44 object-cover rounded-[var(--radius-sm)]"
              />
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-3">
              <img
                src="/assets/opt/logo-lockup.webp"
                width={420}
                height={280}
                loading="lazy"
                decoding="async"
                alt={dict.common.brandNameEn}
                className="w-full h-44 object-contain bg-[var(--color-ivory)] rounded-[var(--radius-sm)] p-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1.5: 6-Stage Manufacturing & Quality Pipeline (#production-process) */}
      <section
        id="production-process"
        className="py-14 lg:py-20 bg-[var(--color-ivory)] border-b border-[var(--color-sand-border)] scroll-mt-20"
      >
        <div className="catalog-container">
          <ProductionStagesSection locale={locale} dict={dict} mode="grid" />
        </div>
      </section>

      {/* Section 2: Factory & Lab QC (#factory) */}
      <section
        id="factory"
        className="py-14 lg:py-20 bg-[var(--color-sand)] border-b border-[var(--color-sand-border)] scroll-mt-20"
      >
        <div className="catalog-container flex flex-col gap-8">
          <div>
            <h2
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.nav.aboutItems.factory}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
              {locale === "ar"
                ? "معدات الفحص المعملي ومعايير الرقابة على الجودة لكل تشغيلة من أفلام وحبيبات ASA:"
                : "Laboratory testing instruments and batch verification protocols governing every ASA film and resin lot:"}
            </p>
          </div>

          <AboutLabEquipmentGrid items={labEquipmentList} locale={locale} />
        </div>
      </section>

      {/* Section 3: Production Qualification & Partners (#qualification) */}
      <section
        id="qualification"
        className="py-14 lg:py-20 bg-[var(--color-ivory)] border-b border-[var(--color-sand-border)] scroll-mt-20"
      >
        <div className="catalog-container flex flex-col gap-8">
          <div>
            <h2
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.nav.aboutItems.qualification}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
              {locale === "ar"
                ? "مساحات مخصصة لرفع نسخ شهادات الجودة واعتمادات الفحص المعملي الرسمية فور إصدارها (دون ادعاءات غير موثقة)."
                : "Reserved containers for official quality management certificates and third-party laboratory test reports."}
            </p>
          </div>

          <AboutQualificationCertsGrid locale={locale} />
        </div>
      </section>

      {/* Section 4: Technical Downloads Table (#downloads) */}
      <section
        id="downloads"
        className="py-14 lg:py-20 bg-sino-fretwork text-[var(--color-on-navy)] scroll-mt-20"
      >
        <div className="catalog-container flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                className="text-[var(--color-gold-bright)] font-bold"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                {dict.nav.aboutItems.downloads}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] mt-1">
                {locale === "ar"
                  ? "حمّل الكتالوج الكامل (8 صفحات) والبروشور التعريفي ونشرة البيانات الفنية (TDS) لشركة مصر الصين لـ ASA بصيغة PDF:"
                  : "Download the official EGYPT CHINA FOR ASA 8-Page Product Catalog, Company Brochure, and Technical Data Sheet (TDS) PDFs:"}
              </p>
            </div>

            <Link
              href={`/${locale}/contact#inquiry`}
              className="btn-action self-start md:self-auto bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)]"
            >
              {dict.common.requestQuoteBtn}
            </Link>
          </div>

          <AboutDownloadsTable
            locale={locale}
            dict={dict}
            defaultRows={downloadsRows}
          />
        </div>
      </section>
    </div>
  );
}
