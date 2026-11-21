import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { PRODUCTS } from "@/data/catalog";
import { FaqAccordionClient } from "@/components/FaqAccordionClient";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Header Band */}
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-10 lg:py-14 flex flex-col gap-3">
          <h1
            className="text-[var(--color-gold-bright)] font-bold"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {dict.nav.faq}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl">
            {locale === "ar"
              ? "إجابات هندسية موثقة حول كيمياء بوليمر ASA، الفروق الجزيئية عن مادة ABS، سماكات البثق المشترك فوق ألواح UPVC، وإعدادات التجفيف والتشغيل."
              : "Technical answers covering ASA terpolymer chemistry, UV weatherability versus ABS, UPVC co-extrusion capstock thicknesses, and factory drying parameters."}
          </p>
        </div>
        <RiverRibbon />
      </section>

      {/* 2-Column Layout: Left Accordion + Right Sidebar */}
      <section className="py-12 lg:py-16 bg-ivory-watermark">
        <div className="catalog-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Accessible Accordion */}
            <div className="lg:col-span-8">
              <FaqAccordionClient locale={locale} />
            </div>

            {/* Right Sidebar: Email CTA Card + Featured Products */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-6 text-[var(--color-on-navy)] flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[var(--color-gold-bright)]">
                  {locale === "ar"
                    ? "هل لديك استفسار فني خاص بخط إنتاجك؟"
                    : "Need Extrusion or Grade Consultation?"}
                </h2>
                <p className="text-sm text-[var(--color-on-navy-muted)] leading-relaxed">
                  {locale === "ar"
                    ? "تواصل مع مهندسي البوليمر في مصنع مدينة السادات لمراجعة درجات حرارة القالب أو طلب عينة تجريبية."
                    : "Contact our polymer engineering desk in Sadat City to review die temperatures, substrate adhesion, or sample roll dispatch."}
                </p>

                <div className="flex flex-col gap-2.5 pt-2">
                  <Link
                    href={`/${locale}/contact#inquiry`}
                    className="btn-action w-full bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)]"
                  >
                    {dict.common.requestQuoteBtn}
                  </Link>
                  <a
                    href="mailto:info@egyptchina-asa.example?subject=ASA%20Technical%20FAQ%20Inquiry"
                    className="btn-action w-full bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)]"
                  >
                    {dict.common.sendEmailBtn}
                  </a>
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4">
                <h2 className="text-base font-bold text-[var(--color-navy)] pb-2 border-b border-[var(--color-sand-border)]">
                  {dict.footer.featuredProductsTitle}
                </h2>

                <div className="flex flex-col gap-3">
                  {featuredProducts.map((prod) => (
                    <Link
                      key={prod.slug}
                      href={`/${locale}/products/${prod.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)]/50 hover:border-[var(--color-navy)]"
                    >
                      <img
                        src={prod.primaryImage}
                        width={64}
                        height={64}
                        loading="lazy"
                        alt={prod.title[locale]}
                        className="w-16 h-16 rounded-[var(--radius-xs)] object-cover shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span
                          dir="ltr"
                          className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                        >
                          {prod.code}
                        </span>
                        <strong className="text-xs sm:text-sm font-bold text-[var(--color-navy)] line-clamp-2">
                          {prod.title[locale]}
                        </strong>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
