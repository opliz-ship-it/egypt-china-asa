"use client";

import React from "react";
import type { Locale } from "@/i18n/config";
import type { ErpAsaSkuItem } from "@/data/catalog";
import {
  isValidHttpUrl,
  type SupabaseInquiryRow,
  type SupabaseSettingsRow,
} from "@/lib/supabase";

export type AdminDashboardTab =
  | "inquiries"
  | "skus"
  | "media"
  | "content"
  | "settings";

interface AdminOverviewBarProps {
  locale: Locale;
  skus: ErpAsaSkuItem[];
  inquiries: SupabaseInquiryRow[];
  media: Record<string, string>;
  settings: SupabaseSettingsRow | null;
  isAuthenticated: boolean;
  onSelectTab: (tab: AdminDashboardTab) => void;
}

/** Compact KPI summary and live site readiness alerts for the Admin Dashboard. */
export function AdminOverviewBar({
  locale,
  skus,
  inquiries,
  media,
  settings,
  isAuthenticated,
  onSelectTab,
}: AdminOverviewBarProps) {
  const activeSkuCount = skus.filter((s) => s.inStock).length;
  const hiddenSkuCount = skus.length - activeSkuCount;
  const newInquiryCount = inquiries.filter(
    (inq) => !inq.status || inq.status === "new"
  ).length;
  const customUploadedMediaCount = Object.values(media).filter((url) =>
    isValidHttpUrl(url)
  ).length;

  const missingWarnings: Array<{ label: string; tab: AdminDashboardTab }> = [];

  if (!settings?.phone || settings.phone.includes("[")) {
    missingWarnings.push({
      label:
        locale === "ar"
          ? "رقم هاتف المبيعات المباشر غير مضبوط بعد"
          : "Direct sales phone needs update",
      tab: "settings",
    });
  }
  if (!settings?.location_en?.trim()) {
    missingWarnings.push({
      label:
        locale === "ar"
          ? "عنوان المصنع بالإنجليزية غير مضاف"
          : "English factory address missing",
      tab: "settings",
    });
  }
  if (!isValidHttpUrl(settings?.tiktok_url) || !isValidHttpUrl(settings?.instagram_url)) {
    missingWarnings.push({
      label:
        locale === "ar"
          ? "روابط تيك توك أو إنستغرام بانتظار الإضافة"
          : "TikTok or Instagram URL pending",
      tab: "settings",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => onSelectTab("inquiries")}
          className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 text-start flex flex-col gap-1 hover:border-[var(--color-navy)] transition-colors"
          style={{ boxShadow: "var(--shadow-subtle)" }}
        >
          <span className="text-xs font-semibold text-[var(--color-charcoal)]">
            {locale === "ar" ? "طلبات العينات الجديدة" : "New Sample Inquiries"}
          </span>
          <strong className="text-2xl font-bold font-mono text-[var(--color-crimson)]">
            {isAuthenticated ? newInquiryCount : "--"}
          </strong>
          <span className="text-xs text-[var(--color-navy)]">
            {isAuthenticated
              ? locale === "ar"
                ? `إجمالي الطلبات المسجلة: ${inquiries.length}`
                : `Total logged: ${inquiries.length}`
              : locale === "ar"
                ? "تظهر بعد تسجيل دخول المشرف"
                : "Sign in to view inquiries"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("skus")}
          className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 text-start flex flex-col gap-1 hover:border-[var(--color-navy)] transition-colors"
          style={{ boxShadow: "var(--shadow-subtle)" }}
        >
          <span className="text-xs font-semibold text-[var(--color-charcoal)]">
            {locale === "ar" ? "الأكواد والألوان النشطة" : "Active Color SKUs"}
          </span>
          <strong className="text-2xl font-bold font-mono text-[var(--color-navy)]">
            {activeSkuCount} / {skus.length}
          </strong>
          <span className="text-xs text-[var(--color-charcoal)]">
            {hiddenSkuCount > 0
              ? locale === "ar"
                ? `${hiddenSkuCount} صنف مخفي مؤقتاً`
                : `${hiddenSkuCount} temporarily hidden`
              : locale === "ar"
                ? "جميع الأكواد ظاهرة للعملاء"
                : "All codes visible in catalog"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("media")}
          className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 text-start flex flex-col gap-1 hover:border-[var(--color-navy)] transition-colors"
          style={{ boxShadow: "var(--shadow-subtle)" }}
        >
          <span className="text-xs font-semibold text-[var(--color-charcoal)]">
            {locale === "ar" ? "الصور المرفوعة سحابياً" : "Cloud Media Slots"}
          </span>
          <strong className="text-2xl font-bold font-mono text-[var(--color-navy)]">
            {customUploadedMediaCount}
          </strong>
          <span className="text-xs text-[var(--color-charcoal)]">
            {locale === "ar"
              ? "يشمل الواجهة، مراحل الإنتاج، والشهادات"
              : "Hero, 6 plant stages & QC certs"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("settings")}
          className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 text-start flex flex-col gap-1 hover:border-[var(--color-navy)] transition-colors"
          style={{ boxShadow: "var(--shadow-subtle)" }}
        >
          <span className="text-xs font-semibold text-[var(--color-charcoal)]">
            {locale === "ar" ? "جاهزية بيانات التواصل" : "Site Contact Readiness"}
          </span>
          <strong
            className={`text-2xl font-bold ${
              missingWarnings.length === 0
                ? "text-[var(--color-success)]"
                : "text-[var(--color-gold-dark)]"
            }`}
          >
            {missingWarnings.length === 0
              ? locale === "ar"
                ? "مكتمل 100%"
                : "100% Ready"
              : locale === "ar"
                ? `${missingWarnings.length} بنود ناقصة`
                : `${missingWarnings.length} Pending`}
          </strong>
          <span className="text-xs text-[var(--color-charcoal)]">
            {locale === "ar"
              ? "اضغط لمراجعة الأرقام والعنوان والملفات"
              : "Click to complete contacts & links"}
          </span>
        </button>
      </div>

      {missingWarnings.length > 0 && (
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-gold)] bg-[var(--color-sand)] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-navy)] font-semibold">
            <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)]">
              {locale === "ar" ? "تنبيه الجاهزية" : "Readiness Check"}
            </span>
            {missingWarnings.map((w) => (
              <button
                key={w.label}
                type="button"
                onClick={() => onSelectTab(w.tab)}
                className="underline hover:text-[var(--color-crimson)] min-h-[32px]"
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
