"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { PURCHASE_STEPS_11 } from "@/data/catalog";

interface ServicesTabsClientProps {
  locale: Locale;
  dict: Dictionary;
  initialTab?: string;
}

type ServiceTabId = "packaging" | "purchase" | "support" | "color-matching";

export function ServicesTabsClient({
  locale,
  dict,
  initialTab,
}: ServicesTabsClientProps) {
  const validTab: ServiceTabId =
    initialTab === "purchase" ||
    initialTab === "support" ||
    initialTab === "color-matching"
      ? initialTab
      : "packaging";

  const [activeTab, setActiveTab] = useState<ServiceTabId>(validTab);

  const tiles: Array<{
    id: ServiceTabId;
    num: string;
    title: string;
    subtitle: string;
  }> = [
    {
      id: "packaging",
      num: "01",
      title: dict.nav.servicesItems.packaging,
      subtitle:
        locale === "ar"
          ? "حماية من الرطوبة والتلوث والحرارة"
          : "Export protection & warehouse storage",
    },
    {
      id: "purchase",
      num: "02",
      title: dict.nav.servicesItems.purchase,
      subtitle:
        locale === "ar"
          ? "مسار التوريد المعتمد من 11 خطوة"
          : "Complete 11-step supply workflow",
    },
    {
      id: "support",
      num: "03",
      title: dict.nav.servicesItems.support,
      subtitle:
        locale === "ar"
          ? "5 ركائز للدعم الهندسي والمعايرة"
          : "5-pillar extrusion & QC support",
    },
    {
      id: "color-matching",
      num: "04",
      title: dict.nav.servicesItems.colorMatching,
      subtitle:
        locale === "ar"
          ? "معايرة طيفية لأكواد RAL والعينات"
          : "Spectrophotometer RAL & custom match",
    },
  ];

  return (
    <div id="service-tabs" className="flex flex-col gap-10">
      {/* Top 4-Tile Interactive Tab Switcher (Active tile highlighted in #c59b48 Gold with #08354d contrast ink) */}
      <div
        role="tablist"
        aria-label={dict.nav.services}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {tiles.map((tile) => {
          const isSelected = activeTab === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(tile.id)}
              className={`min-h-[88px] p-5 rounded-[var(--radius-md)] border-2 text-start flex flex-col justify-between gap-2 transition-colors duration-150 ${
                isSelected
                  ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)] border-[var(--color-navy)]"
                  : "bg-[var(--color-navy)] text-[var(--color-on-navy)] border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  dir="ltr"
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded-[var(--radius-xs)] ${
                    isSelected
                      ? "bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)]"
                      : "bg-[var(--color-navy-deep)] text-[var(--color-gold)]"
                  }`}
                >
                  {tile.num}
                </span>
              </div>
              <div>
                <strong className="block text-base font-bold leading-snug">
                  {tile.title}
                </strong>
                <span
                  className={`text-xs ${
                    isSelected
                      ? "text-[var(--color-navy-deep)] font-medium"
                      : "text-[var(--color-on-navy-muted)]"
                  }`}
                >
                  {tile.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div
        aria-live="polite"
        className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 sm:p-8 lg:p-10"
        style={{ boxShadow: "var(--shadow-subtle)" }}
      >
        {activeTab === "packaging" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-[var(--color-navy)]">
                {dict.nav.servicesItems.packaging}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed">
                {locale === "ar"
                  ? "تُطبق شركة مصر الصين لـ ASA إرشادات صارمة لحماية رولات الأفلام وأكياس الحبيبات والألواح المموجة أثناء المناولة والشحن والتخزين في مخازن المصانع (وفق صفحة 07 من الكتالوج الفني)."
                  : "EGYPT CHINA FOR ASA enforces strict export and domestic packaging protocols to safeguard ASA surface films, resin pellets, and corrugated sheets during transit and factory warehousing (per Catalogue Page 07)."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4">
                  <h3 className="text-base font-bold text-[var(--color-navy)] mb-1">
                    {locale === "ar"
                      ? "01. الحماية من التلوث والرطوبة"
                      : "01. Contamination & Moisture Barrier"}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal)]">
                    {locale === "ar"
                      ? "تُغلف رولات الأفلام وأكياس الراتنج بطبقات عازلة محكمة الغلق لمنع تسرب الغبار، الرطوبة، أو الزيوت إلى سطح المادة قبل التشغيل."
                      : "Film rolls and 25 kg resin bags are sealed inside multi-layer moisture and dust barriers to prevent surface contamination prior to hopper or calender loading."}
                  </p>
                </div>

                <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4">
                  <h3 className="text-base font-bold text-[var(--color-navy)] mb-1">
                    {locale === "ar"
                      ? "02. الوقاية من الحرارة غير المناسبة"
                      : "02. Thermal & UV Storage Control"}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal)]">
                    {locale === "ar"
                      ? "تُحفظ المنتجات في مستودعات مغطاة وجيدة التهوية بعيداً عن مصادر الحرارة المباشرة لضمان عدم تشوه الرولات أو تكتل الحبيبات."
                      : "Materials must be stored indoors in ventilated warehouses away from improper heat sources and direct sunlight to prevent roll blocking or pellet caking."}
                  </p>
                </div>

                <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4 sm:col-span-2">
                  <h3 className="text-base font-bold text-[var(--color-navy)] mb-1">
                    {locale === "ar"
                      ? "03. الالتزام بتعليمات التخزين القياسية للمورد"
                      : "03. Supplier Storage & FIFO Handling"}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal)]">
                    {locale === "ar"
                      ? "تُرفق مع كل تشغيلة بطاقة تعريف تتضمن رقم التشغيلة، السماكة، كود اللون، وتوصيات التجفيف المسبق (80 إلى 85 درجة مئوية) لضمان أفضل أداء على خط البثق."
                      : "Every pallet carries batch traceability labels detailing gauge, swatch code, and pre-drying parameters (80 to 85 °C for 3 to 4 hours) prior to processing."}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy)] p-4 text-[var(--color-on-navy)] flex flex-col gap-3">
                <img
                  src="/assets/opt/factory-facade.webp"
                  width={296}
                  height={162}
                  loading="lazy"
                  decoding="async"
                  alt={dict.common.brandNameEn}
                  className="w-full max-w-[340px] mx-auto aspect-[296/162] object-cover rounded-[var(--radius-sm)]"
                />
                <div className="p-2 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[var(--color-gold-bright)]">
                    [PACKAGING_PALLET_SLOT]
                  </span>
                  <p className="text-xs text-[var(--color-on-navy-muted)]">
                    {locale === "ar"
                      ? "نقطة الشحن والتوريد المباشر: المنطقة الصناعية، مدينة السادات، المنوفية."
                      : "Direct dispatch hub: Sadat City Industrial Zone, Monufia Governorate, Egypt."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "purchase" && (
          <div id="purchase-process" className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-navy)]">
                {dict.nav.servicesItems.purchase}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
                {locale === "ar"
                  ? "مسار التوريد الصناعي الكامل من استلام الاستفسار وتجربة العينة حتى الفحص المعملي والتسليم:"
                  : "Complete 11-step industrial supply chain from initial inquiry and sample trial to QC verification and dispatch:"}
              </p>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PURCHASE_STEPS_11.map((item) => (
                <li
                  key={item.step}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] p-5 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      dir="ltr"
                      className="px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] text-xs font-bold border border-[var(--color-gold)]"
                    >
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-navy)]">
                    {item.title[locale]}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                    {item.detail[locale]}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === "support" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-navy)]">
                {dict.nav.servicesItems.support}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
                {locale === "ar"
                  ? "خمس ركائز هندسية لمرافقة المصانع قبل وأثناء وبعد تشغيل مواد ASA:"
                  : "Five engineering pillars supporting extrusion and molding plants before, during, and after ASA processing:"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  num: "01",
                  title:
                    locale === "ar"
                      ? "التواصل الفني المسبق"
                      : "Pre-Communication",
                  desc:
                    locale === "ar"
                      ? "مراجعة تصميم القالب، نوع الركيزة، ونسبة البثق المشترك قبل اختيار الصنف."
                      : "Review extruder screw geometry, feedblock design, and base substrate compatibility.",
                },
                {
                  num: "02",
                  title:
                    locale === "ar"
                      ? "دقة ومطابقة الألوان"
                      : "Color Accuracy",
                  desc:
                    locale === "ar"
                      ? "ضبط كود الصبغة ودرجة اللمعان ومؤشر الانعكاس الشمسي لكل تشغيلة."
                      : "Spectrophotometer calibration ensuring ΔE < 1.5 consistency across production lots.",
                },
                {
                  num: "03",
                  title:
                    locale === "ar"
                      ? "المتابعة السريعة للتجارب"
                      : "Timely Trial Feedback",
                  desc:
                    locale === "ar"
                      ? "تحليل نتائج تجربة العينة على خط إنتاج العميل وضبط درجات حرارة المناطق."
                      : "Analyze line-trial peel adhesion and melt flow to fine-tune barrel temperature profiles.",
                },
                {
                  num: "04",
                  title:
                    locale === "ar"
                      ? "رقابة الجودة المعملية"
                      : "Quality Control",
                  desc:
                    locale === "ar"
                      ? "اختبار كل دفعة وفق معايير ISO 1133 و ISO 306 و ASTM G154 قبل الشحن."
                      : "Batch testing against ISO 1133 MFI, ISO 306 Vicat, and ASTM G154 weathering standards.",
                },
                {
                  num: "05",
                  title:
                    locale === "ar"
                      ? "خدمة ما بعد البيع"
                      : "After-Sales Engineering",
                  desc:
                    locale === "ar"
                      ? "دعم فني مستمر لحل أي تحديات في التشكيل الحراري أو الكبس أو التخزين."
                      : "Ongoing troubleshooting for thermoforming draw ratios, die-lip maintenance, and storage.",
                },
              ].map((pillar) => (
                <div
                  key={pillar.num}
                  className="rounded-[var(--radius-sm)] border-t-4 border-t-[var(--color-navy)] border-x border-b border-[var(--color-sand-border)] bg-[var(--color-ivory)] p-5 flex flex-col gap-2.5"
                >
                  <span
                    dir="ltr"
                    className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                  >
                    {pillar.num}
                  </span>
                  <h3 className="text-base font-bold text-[var(--color-navy)]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "color-matching" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-[var(--color-navy)]">
                {dict.nav.servicesItems.colorMatching}
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed">
                {locale === "ar"
                  ? "يوفر مختبر الألوان في مصنع مدينة السادات خدمة مطابقة الألوان المخصصة لأفلام وحبيبات ASA بناءً على عينة العميل الفعلية أو أكواد الألوان العالمية RAL و Pantone، مع اختبار ثبات الصبغة تحت الأشعة فوق البنفسجية قبل الإنتاج الكمي."
                  : "Our Sadat City laboratory formulates custom ASA masterbatch and surface film colors matched directly to physical client plaques or international RAL codes, verified for UV and thermal stability before bulk compounding."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4">
                  <strong className="block text-sm font-bold text-[var(--color-navy)] mb-1">
                    {locale === "ar"
                      ? "01. التحليل الطيفي للعينة"
                      : "01. Spectrophotometric Reading"}
                  </strong>
                  <p className="text-sm text-[var(--color-charcoal)]">
                    {locale === "ar"
                      ? "قياس إحداثيات اللون (L*a*b*) ودرجة اللمعان تحت زوايا إضاءة قياسية."
                      : "Measure L*a*b* coordinates and 60° gloss levels from your target roof tile or profile sample."}
                  </p>
                </div>

                <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4">
                  <strong className="block text-sm font-bold text-[var(--color-navy)] mb-1">
                    {locale === "ar"
                      ? "02. اختيار الأصباغ غير العضوية"
                      : "02. Heat-Stable Pigment Selection"}
                  </strong>
                  <p className="text-sm text-[var(--color-charcoal)]">
                    {locale === "ar"
                      ? "استخدام أصباغ تتحمل حرارة البثق (حتى 250 درجة مئوية) دون تفحم أو تغير لوني."
                      : "Select inorganic chromophores rated for 220 to 250 °C extrusion temperatures and QUV stability."}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/contact#inquiry`}
                  className="btn-action bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)]"
                >
                  {dict.common.requestQuoteBtn}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy)] p-4 text-[var(--color-on-navy)] flex flex-col gap-3">
                <img
                  src="/assets/opt/asa-color-jars.webp"
                  width={540}
                  height={340}
                  loading="lazy"
                  decoding="async"
                  alt={
                    locale === "ar"
                      ? "عبوات حبيبات راتنج ASA الملونة في المختبر"
                      : "Colored ASA resin granules in glass jars"
                  }
                  className="w-full aspect-[16/10] object-cover rounded-[var(--radius-sm)]"
                />
                <span className="text-xs text-[var(--color-gold-bright)] font-semibold">
                  {locale === "ar"
                    ? "الألوان القياسية المتوفرة فوراً: الأسود، البرتقالي، الأحمر، الأزرق، الرمادي الداكن، الأخضر، والعاجي."
                    : "Standard stocked shades: Black, Orange, Red, Blue, Dark Grey, Green, and Ivory."}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
