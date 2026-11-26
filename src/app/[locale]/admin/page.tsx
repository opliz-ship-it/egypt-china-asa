import React from "react";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/i18n/config";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import { RiverRibbon } from "@/components/RiverRibbon";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col">
      <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
        <div className="catalog-container py-10 lg:py-12 flex flex-col gap-3">
          <h1
            className="text-[var(--color-gold-bright)] font-bold"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {locale === "ar"
              ? "لوحة تحكم العميل وإدارة الكتالوج والصور (Supabase CMS)"
              : "Client Catalog, SKU & Media Management Portal (Supabase CMS)"}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] max-w-3xl leading-relaxed">
            {locale === "ar"
              ? "إدارة متكاملة لطلبات العينات والرد الفوري عبر واتساب، أكواد وألوان أفلام ASA، صور الواجهة ومراحل التصنيع والشهادات، الأخبار والمشاريع، وبيانات التواصل وملفات التحميل."
              : "Unified portal for sample inquiry CRM and WhatsApp follow-up, ASA color SKUs, hero, production-stage and certificate photography, news/case publishing, and contact or PDF settings."}
          </p>
        </div>
        <RiverRibbon />
      </section>

      <section className="py-12 lg:py-16 bg-ivory-watermark">
        <div className="catalog-container">
          <AdminDashboardClient locale={locale} dict={dict} />
        </div>
      </section>
    </div>
  );
}
