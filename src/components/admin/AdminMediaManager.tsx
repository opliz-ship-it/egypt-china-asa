"use client";

import React, { useState } from "react";
import type { Locale } from "@/i18n/config";
import {
  buildRestHeaders,
  isValidHttpUrl,
  SUPABASE_URL,
  uploadImageToAsaMedia,
} from "@/lib/supabase";

interface MediaSlotDefinition {
  slotKey: string;
  labelAr: string;
  labelEn: string;
  fallbackPreview?: string;
}

const MEDIA_SLOT_GROUPS: Array<{
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  slots: MediaSlotDefinition[];
}> = [
  {
    id: "core",
    titleAr: "01. صور الواجهة الرئيسية والمصنع (6 خانات)",
    titleEn: "01. Primary Hero, Showcase & Factory Photos (6 Slots)",
    subtitleAr: "تظهر في السلايدر الرئيسي، صفحة عن الشركة، واستكشاف الخامات.",
    subtitleEn: "Displayed across Hero Showcase, Factory Overview, and Specimen previews.",
    slots: [
      {
        slotKey: "hero_partnership",
        labelAr: "صورة الشراكة المصرية الصينية (Hero Slide 01)",
        labelEn: "Sino-Egyptian Partnership Image (Slide 01)",
        fallbackPreview: "/assets/opt/hero-partnership.webp",
      },
      {
        slotKey: "hero_red_sheet",
        labelAr: "صورة عينة فيلم ASA الأحمر والحبيبات (Slide 01)",
        labelEn: "Red ASA Film & Granules Specimen (Slide 01)",
        fallbackPreview: "/assets/opt/asa-red-sheet.webp",
      },
      {
        slotKey: "jar_granules",
        labelAr: "صورة عبوات حبيبات ASA الملونة (Slide 02)",
        labelEn: "Colored ASA Granules in Glass Jars (Slide 02)",
        fallbackPreview: "/assets/opt/asa-color-jars.webp",
      },
      {
        slotKey: "black_corrugated",
        labelAr: "صورة عينة ASA السوداء الداكنة (Slide 02)",
        labelEn: "Charcoal Black ASA Specimen (Slide 02)",
        fallbackPreview: "/assets/opt/asa-black-corrugated.webp",
      },
      {
        slotKey: "factory_facade",
        labelAr: "صورة واجهة مصنع مدينة السادات",
        labelEn: "Sadat City Factory Exterior Photograph",
        fallbackPreview: "/assets/opt/factory-facade.webp",
      },
      {
        slotKey: "red_sheet_macro",
        labelAr: "صورة جودة السطح والالتصاق الحراري",
        labelEn: "Surface Uniformity & Thermal Adhesion Specimen",
        fallbackPreview: "/assets/opt/asa-red-sheet.webp",
      },
    ],
  },
  {
    id: "stages",
    titleAr: "02. صور مراحل التصنيع الست (STAGE_01 إلى STAGE_06)",
    titleEn: "02. Six Production Stage Photographs (STAGE_01 - STAGE_06)",
    subtitleAr: "عند رفع صورة أي مرحلة تحل مباشرة محل الرسم التوضيحي في الرئيسية وصفحة عن الشركة.",
    subtitleEn: "Uploaded stage images automatically replace placeholder frames on Home and About.",
    slots: [
      { slotKey: "stage_01", labelAr: "مرحلة 01: تجهيز الخامات والتجفيف", labelEn: "Stage 01: Raw Material Preparation" },
      { slotKey: "stage_02", labelAr: "مرحلة 02: معالجة الخامات والمزج الحراري", labelEn: "Stage 02: Material Processing" },
      { slotKey: "stage_03", labelAr: "مرحلة 03: خطوط البثق الفعلي", labelEn: "Stage 03: Extrusion Process" },
      { slotKey: "stage_04", labelAr: "مرحلة 04: معالجة السطح والدرفلة", labelEn: "Stage 04: Surface Treatment" },
      { slotKey: "stage_05", labelAr: "مرحلة 05: فحص الجودة المعملي", labelEn: "Stage 05: Quality Inspection" },
      { slotKey: "stage_06", labelAr: "مرحلة 06: تغليف الرولات والأكياس", labelEn: "Stage 06: Final Product Packaging" },
    ],
  },
  {
    id: "certs_lab",
    titleAr: "03. شهادات الجودة الـ 3، صورة الشحن، وأجهزة المعمل",
    titleEn: "03. QC Certificates (3 Slots), Packaging & Lab Instruments",
    subtitleAr: "تظهر الشهادات وصور أجهزة المعمل مباشرة في صفحة عن الشركة وقسم الخدمات.",
    subtitleEn: "Live certificates and instrument images populate About (#qualification, #factory) and Services.",
    slots: [
      { slotKey: "cert_01", labelAr: "شهادة اعتماد وفحص معملي رقم 01", labelEn: "Official Certificate Slot 01" },
      { slotKey: "cert_02", labelAr: "شهادة اعتماد وفحص معملي رقم 02", labelEn: "Official Certificate Slot 02" },
      { slotKey: "cert_03", labelAr: "شهادة اعتماد وفحص معملي رقم 03", labelEn: "Official Certificate Slot 03" },
      {
        slotKey: "packaging_pallet",
        labelAr: "صورة باليتات التغليف والشحن (الخدمات)",
        labelEn: "Export Packaging & Pallet Dispatch (Services)",
        fallbackPreview: "/assets/opt/factory-facade.webp",
      },
      { slotKey: "lab_01", labelAr: "جهاز القياس الطيفي LAB-01", labelEn: "LAB-01 Spectrophotometer" },
      { slotKey: "lab_02", labelAr: "جهاز تدفق الذوبان LAB-02", labelEn: "LAB-02 MFI Indexer" },
      { slotKey: "lab_03", labelAr: "جهاز فيكات للحرارة LAB-03", labelEn: "LAB-03 Vicat Tester" },
      { slotKey: "lab_04", labelAr: "بندول صدمات شاربي LAB-04", labelEn: "LAB-04 Charpy Impact" },
      { slotKey: "lab_05", labelAr: "غرفة التعتيق المتسارع LAB-05 (QUV)", labelEn: "LAB-05 QUV Chamber" },
    ],
  },
];

interface AdminMediaManagerProps {
  locale: Locale;
  accessToken: string | null;
  media: Record<string, string>;
  onRefresh: () => Promise<void>;
  onActionMessage: (msg: { type: "success" | "error"; text: string }) => void;
}

/** Grouped site media manager covering Core Hero, 6 Production Stages, QC Certificates, and Lab Instruments. */
export function AdminMediaManager({
  locale,
  accessToken,
  media,
  onRefresh,
  onActionMessage,
}: AdminMediaManagerProps) {
  const [busySlot, setBusySlot] = useState<string | null>(null);

  const handleUploadSlot = async (slot: MediaSlotDefinition, file: File) => {
    if (!accessToken) {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "يرجى تسجيل دخول المشرف أعلاه أولاً لرفع الصور."
            : "Please sign in as admin above before uploading photos.",
      });
      return;
    }

    setBusySlot(slot.slotKey);
    const result = await uploadImageToAsaMedia("slots", slot.slotKey, file, accessToken);
    if (!result.ok || !result.publicUrl) {
      setBusySlot(null);
      const errMsg =
        result.errorCode === "too_large"
          ? locale === "ar"
            ? "حجم الصورة يتجاوز الحد الأقصى (5 ميجابايت)."
            : "Image file exceeds 5 MB upload limit."
          : result.errorCode === "invalid_type"
            ? locale === "ar"
              ? "يُسمح فقط بصيغ الصور JPG أو PNG أو WebP."
              : "Only JPG, PNG, or WebP images are allowed."
            : locale === "ar"
              ? "تعذر رفع الصورة إلى Supabase Storage."
              : "Failed to upload image to Supabase Storage.";
      onActionMessage({ type: "error", text: errMsg });
      return;
    }

    try {
      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/site_media?on_conflict=slot_key`,
        {
          method: "POST",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({
            slot_key: slot.slotKey,
            title_ar: slot.labelAr,
            image_url: result.publicUrl,
            updated_at: new Date().toISOString(),
          }),
        }
      );
      if (!patchRes.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تم رفع الصورة لكن فشل ربطها في جدول site_media."
              : "File uploaded, but failed to save link in site_media.",
        });
        return;
      }
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم تحديث الصورة (${slot.slotKey}) بنجاح في الموقع.`
            : `Updated media slot (${slot.slotKey}) across live site.`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "خطأ اتصال أثناء تحديث جدول الصور."
            : "Network error saving media record.",
      });
    } finally {
      setBusySlot(null);
    }
  };

  const handleResetSlot = async (slotKey: string) => {
    if (!accessToken) return;
    setBusySlot(slotKey);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/site_media?slot_key=eq.${encodeURIComponent(slotKey)}`,
        {
          method: "DELETE",
          headers: buildRestHeaders(accessToken),
        }
      );
      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر إعادة تعيين الصورة للافتراضي."
              : "Could not reset media slot.",
        });
        return;
      }
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تمت استعادة الحالة الافتراضية للخانة (${slotKey}).`
            : `Reset (${slotKey}) to default fallback.`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "خطأ اتصال أثناء إعادة التعيين."
            : "Network error resetting slot.",
      });
    } finally {
      setBusySlot(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {MEDIA_SLOT_GROUPS.map((group) => (
        <section key={group.id} className="flex flex-col gap-4">
          <div className="border-b border-[var(--color-sand-border)] pb-2">
            <h3 className="text-lg font-bold text-[var(--color-navy)]">
              {locale === "ar" ? group.titleAr : group.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-charcoal)] mt-0.5">
              {locale === "ar" ? group.subtitleAr : group.subtitleEn}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {group.slots.map((slot) => {
              const liveUrl = media[slot.slotKey];
              const isCloudUploaded = isValidHttpUrl(liveUrl);
              const previewSrc = isCloudUploaded ? liveUrl : slot.fallbackPreview;
              const isSlotBusy = busySlot === slot.slotKey;

              return (
                <article
                  key={slot.slotKey}
                  className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden flex flex-col justify-between"
                  style={{ boxShadow: "var(--shadow-subtle)" }}
                >
                  <div>
                    <div className="bg-[var(--color-navy-deep)] border-b border-[var(--color-sand-border)] p-3">
                      {previewSrc ? (
                        <img
                          src={previewSrc}
                          width={480}
                          height={260}
                          loading="lazy"
                          alt={locale === "ar" ? slot.labelAr : slot.labelEn}
                          className="w-full h-40 object-cover rounded-[var(--radius-xs)] block"
                        />
                      ) : (
                        <div className="w-full h-40 rounded-[var(--radius-xs)] border border-dashed border-[var(--color-gold)]/60 flex flex-col items-center justify-center text-center p-3 gap-1">
                          <span dir="ltr" className="font-mono text-xs font-bold text-[var(--color-gold-bright)]">
                            {slot.slotKey}
                          </span>
                          <span className="text-xs text-[var(--color-on-navy-muted)]">
                            {locale === "ar"
                              ? "بانتظار رفع صورة حقيقية (يعرض الافتراضي حالياً)"
                              : "Awaiting custom photo (showing default)"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          dir="ltr"
                          className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                        >
                          {slot.slotKey}
                        </span>
                        {isCloudUploaded && (
                          <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)] text-[11px] font-bold">
                            {locale === "ar" ? "صورة مخصصة نشطة" : "Live Cloud"}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[var(--color-navy)]">
                        {locale === "ar" ? slot.labelAr : slot.labelEn}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex flex-col gap-2">
                    <label className="btn-action w-full bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] text-xs cursor-pointer">
                      <span>
                        {isSlotBusy
                          ? locale === "ar"
                            ? "جاري التنفيذ..."
                            : "Uploading..."
                          : locale === "ar"
                            ? "رفع صورة جديدة (JPG/PNG/WebP)"
                            : "Upload New Photo (<= 5 MB)"}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isSlotBusy}
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleUploadSlot(slot, file);
                        }}
                      />
                    </label>

                    {isCloudUploaded && (
                      <button
                        type="button"
                        disabled={isSlotBusy}
                        onClick={() => void handleResetSlot(slot.slotKey)}
                        className="min-h-[38px] w-full rounded-[var(--radius-xs)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-crimson)] hover:text-[var(--color-crimson)]"
                      >
                        {locale === "ar"
                          ? "إعادة تعيين للافتراضي"
                          : "Reset to Default"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
