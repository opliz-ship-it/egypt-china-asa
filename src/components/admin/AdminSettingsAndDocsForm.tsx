"use client";

import React, { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import {
  buildRestHeaders,
  buildWhatsAppHref,
  SUPABASE_URL,
  type SupabaseSettingsRow,
} from "@/lib/supabase";

interface AdminSettingsAndDocsFormProps {
  locale: Locale;
  accessToken: string | null;
  settings: SupabaseSettingsRow | null;
  onRefresh: () => Promise<void>;
  onActionMessage: (msg: { type: "success" | "error"; text: string }) => void;
}

/** Complete contact, social, factory info, video link, and PDF document override settings form. */
export function AdminSettingsAndDocsForm({
  locale,
  accessToken,
  settings,
  onRefresh,
  onActionMessage,
}: AdminSettingsAndDocsFormProps) {
  const [phoneInput, setPhoneInput] = useState("");
  const [whatsappInput, setWhatsappInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [locationArInput, setLocationArInput] = useState("");
  const [locationEnInput, setLocationEnInput] = useState("");
  const [facebookInput, setFacebookInput] = useState("");
  const [tiktokInput, setTiktokInput] = useState("");
  const [instagramInput, setInstagramInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [establishedYearInput, setEstablishedYearInput] = useState("");
  const [plantCapacityInput, setPlantCapacityInput] = useState("");
  const [docCatalogAr, setDocCatalogAr] = useState("");
  const [docCatalogEn, setDocCatalogEn] = useState("");
  const [docBrochureAr, setDocBrochureAr] = useState("");
  const [docBrochureEn, setDocBrochureEn] = useState("");
  const [docTdsAr, setDocTdsAr] = useState("");
  const [docTdsEn, setDocTdsEn] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setPhoneInput(settings.phone || "");
      setWhatsappInput(settings.whatsapp_number || "");
      setEmailInput(settings.email || "");
      setLocationArInput(settings.location_ar || "");
      setLocationEnInput(settings.location_en || "");
      setFacebookInput(settings.facebook_url || "");
      setTiktokInput(settings.tiktok_url || "");
      setInstagramInput(settings.instagram_url || "");
      setVideoUrlInput(settings.video_url || "");
      setEstablishedYearInput(settings.established_year || "");
      setPlantCapacityInput(settings.plant_capacity || "");
      setDocCatalogAr(settings.doc_catalog_ar || "");
      setDocCatalogEn(settings.doc_catalog_en || "");
      setDocBrochureAr(settings.doc_brochure_ar || "");
      setDocBrochureEn(settings.doc_brochure_en || "");
      setDocTdsAr(settings.doc_tds_ar || "");
      setDocTdsEn(settings.doc_tds_en || "");
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "يرجى تسجيل دخول المشرف أعلاه لحفظ الإعدادات."
            : "Please sign in as admin above to save settings.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const nowIso = new Date().toISOString();
      const rows = [
        { setting_key: "phone_ar", setting_value: phoneInput.trim(), updated_at: nowIso },
        { setting_key: "whatsapp_number", setting_value: whatsappInput.trim(), updated_at: nowIso },
        { setting_key: "email", setting_value: emailInput.trim(), updated_at: nowIso },
        { setting_key: "address_ar", setting_value: locationArInput.trim(), updated_at: nowIso },
        { setting_key: "address_en", setting_value: locationEnInput.trim(), updated_at: nowIso },
        { setting_key: "facebook_url", setting_value: facebookInput.trim(), updated_at: nowIso },
        { setting_key: "tiktok_url", setting_value: tiktokInput.trim(), updated_at: nowIso },
        { setting_key: "instagram_url", setting_value: instagramInput.trim(), updated_at: nowIso },
        { setting_key: "video_url", setting_value: videoUrlInput.trim(), updated_at: nowIso },
        { setting_key: "established_year", setting_value: establishedYearInput.trim(), updated_at: nowIso },
        { setting_key: "plant_capacity", setting_value: plantCapacityInput.trim(), updated_at: nowIso },
        { setting_key: "doc_catalog_ar", setting_value: docCatalogAr.trim(), updated_at: nowIso },
        { setting_key: "doc_catalog_en", setting_value: docCatalogEn.trim(), updated_at: nowIso },
        { setting_key: "doc_brochure_ar", setting_value: docBrochureAr.trim(), updated_at: nowIso },
        { setting_key: "doc_brochure_en", setting_value: docBrochureEn.trim(), updated_at: nowIso },
        { setting_key: "doc_tds_ar", setting_value: docTdsAr.trim(), updated_at: nowIso },
        { setting_key: "doc_tds_en", setting_value: docTdsEn.trim(), updated_at: nowIso },
      ];

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/site_settings?on_conflict=setting_key`,
        {
          method: "POST",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify(rows),
        }
      );

      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حفظ الإعدادات في جدول site_settings."
              : "Failed updating site_settings.",
        });
        return;
      }

      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? "تم حفظ جميع بيانات التواصل، الروابط، وإعدادات الملفات بنجاح."
            : "Saved all contact, social, video, and document settings live.",
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "حدث خطأ اتصال أثناء حفظ الإعدادات."
            : "Network error while saving settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const previewWaHref = buildWhatsAppHref(whatsappInput || phoneInput);

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Contact & Social Channels */}
      <div className="lg:col-span-6 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
          {locale === "ar"
            ? "بيانات التواصل الرسمية وحسابات السوشيال"
            : "Official Contacts & Social Media Channels"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="set-phone" className="text-xs font-semibold">
              {locale === "ar" ? "رقم هاتف المبيعات" : "Direct Sales Phone"}
            </label>
            <input
              id="set-phone"
              type="text"
              dir="ltr"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="01222889889"
              className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="set-whatsapp" className="text-xs font-semibold">
              {locale === "ar" ? "رقم واتساب المبيعات" : "WhatsApp Number"}
            </label>
            <input
              id="set-whatsapp"
              type="text"
              dir="ltr"
              value={whatsappInput}
              onChange={(e) => setWhatsappInput(e.target.value)}
              placeholder="01222889889"
              className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        <div className="rounded-[var(--radius-xs)] bg-[var(--color-sand)] px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <span className="text-[var(--color-charcoal)]">
            {locale === "ar" ? "رابط واتساب الفعلي بعد التحويل الدولي:" : "Generated international WhatsApp URL:"}
          </span>
          <a
            href={previewWaHref}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="font-mono font-bold text-[var(--color-navy)] underline"
          >
            {previewWaHref}
          </a>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="set-email" className="text-xs font-semibold">
            {locale === "ar" ? "البريد الإلكتروني الرسمي" : "Official Email"}
          </label>
          <input
            id="set-email"
            type="email"
            dir="ltr"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="egychinaasa@gmail.com"
            className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="set-address-ar" className="text-xs font-semibold">
            {locale === "ar" ? "عنوان المصنع (عربي)" : "Factory Address (Arabic)"}
          </label>
          <input
            id="set-address-ar"
            type="text"
            value={locationArInput}
            onChange={(e) => setLocationArInput(e.target.value)}
            placeholder="المنوفية - مدينة السادات - المنطقة الصناعية السابعة"
            className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="set-address-en" className="text-xs font-semibold">
            {locale === "ar" ? "عنوان المصنع (إنجليزي)" : "Factory Address (English)"}
          </label>
          <input
            id="set-address-en"
            type="text"
            dir="ltr"
            value={locationEnInput}
            onChange={(e) => setLocationEnInput(e.target.value)}
            placeholder="Industrial Zone 7, Sadat City, Monufia, Egypt"
            className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="set-facebook" className="text-xs font-semibold">
            {locale === "ar" ? "رابط فيسبوك (Facebook)" : "Facebook Page URL"}
          </label>
          <input
            id="set-facebook"
            type="url"
            dir="ltr"
            value={facebookInput}
            onChange={(e) => setFacebookInput(e.target.value)}
            placeholder="https://facebook.com/..."
            className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="set-tiktok" className="text-xs font-semibold">
              {locale === "ar" ? "رابط تيك توك (TikTok)" : "TikTok URL"}
            </label>
            <input
              id="set-tiktok"
              type="url"
              dir="ltr"
              value={tiktokInput}
              onChange={(e) => setTiktokInput(e.target.value)}
              placeholder="https://www.tiktok.com/@..."
              className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="set-instagram" className="text-xs font-semibold">
              {locale === "ar" ? "رابط إنستغرام (Instagram)" : "Instagram URL"}
            </label>
            <input
              id="set-instagram"
              type="url"
              dir="ltr"
              value={instagramInput}
              onChange={(e) => setInstagramInput(e.target.value)}
              placeholder="https://www.instagram.com/..."
              className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Factory Profile, Video & Dynamic PDF Links */}
      <div className="lg:col-span-6 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
          {locale === "ar"
            ? "فيديو المصنع، بيانات الهوية، وروابط ملفات التحميل (PDF)"
            : "Factory Video, Plant Metrics & PDF Download Overrides"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="set-year" className="text-xs font-semibold">
              {locale === "ar" ? "سنة التأسيس (اختياري)" : "Establishment Year"}
            </label>
            <input
              id="set-year"
              type="text"
              value={establishedYearInput}
              onChange={(e) => setEstablishedYearInput(e.target.value)}
              placeholder={locale === "ar" ? "مثال: منذ 2022" : "e.g. Est. 2022"}
              className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="set-capacity" className="text-xs font-semibold">
              {locale === "ar" ? "الطاقة الإنتاجية / المساحة" : "Plant Capacity / Area"}
            </label>
            <input
              id="set-capacity"
              type="text"
              value={plantCapacityInput}
              onChange={(e) => setPlantCapacityInput(e.target.value)}
              placeholder={locale === "ar" ? "مثال: 6 خطوط بثق" : "e.g. 6 Extrusion Lines"}
              className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="set-video" className="text-xs font-semibold">
            {locale === "ar"
              ? "رابط فيديو خطوط الإنتاج (YouTube أو MP4 مباشر)"
              : "Factory Line Video URL (YouTube or Direct MP4)"}
          </label>
          <input
            id="set-video"
            type="url"
            dir="ltr"
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="pt-2 border-t border-[var(--color-sand-border)] flex flex-col gap-3">
          <p className="text-xs text-[var(--color-charcoal)]">
            {locale === "ar"
              ? "اترك الحقول التالية فارغة لاستخدام ملفات PDF الرسمية الافتراضية، أو الصق رابط PDF محدثًا لاستبداله فورًا في مركز التحميلات:"
              : "Leave blank to keep built-in verified PDFs, or paste custom HTTPS PDF links to override DOC-01 to DOC-03 live:"}
          </p>

          {[
            { id: "doc-cat-ar", label: locale === "ar" ? "DOC-01 الكتالوج (عربي)" : "DOC-01 Catalog (AR)", val: docCatalogAr, set: setDocCatalogAr, def: "/assets/ASA_Catalog_AR.pdf" },
            { id: "doc-cat-en", label: locale === "ar" ? "DOC-01 الكتالوج (إنجليزي)" : "DOC-01 Catalog (EN)", val: docCatalogEn, set: setDocCatalogEn, def: "/assets/ASA_Catalog_EN.pdf" },
            { id: "doc-bro-ar", label: locale === "ar" ? "DOC-02 البروشور (عربي)" : "DOC-02 Brochure (AR)", val: docBrochureAr, set: setDocBrochureAr, def: "/assets/ASA_Brochure_AR.pdf" },
            { id: "doc-bro-en", label: locale === "ar" ? "DOC-02 البروشور (إنجليزي)" : "DOC-02 Brochure (EN)", val: docBrochureEn, set: setDocBrochureEn, def: "/assets/ASA_Brochure_EN.pdf" },
            { id: "doc-tds-ar", label: locale === "ar" ? "DOC-03 المواصفات TDS (عربي)" : "DOC-03 TDS (AR)", val: docTdsAr, set: setDocTdsAr, def: "/assets/ASA_TDS_AR.pdf" },
            { id: "doc-tds-en", label: locale === "ar" ? "DOC-03 المواصفات TDS (إنجليزي)" : "DOC-03 TDS (EN)", val: docTdsEn, set: setDocTdsEn, def: "/assets/ASA_TDS_EN.pdf" },
          ].map((doc) => (
            <div key={doc.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <label htmlFor={doc.id} className="sm:col-span-4 text-xs font-semibold text-[var(--color-navy)]">
                {doc.label}
              </label>
              <input
                id={doc.id}
                type="url"
                dir="ltr"
                value={doc.val}
                onChange={(e) => doc.set(e.target.value)}
                placeholder={doc.def}
                className="sm:col-span-8 min-h-[40px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-1.5 text-xs font-mono"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-action mt-2 bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] text-sm disabled:opacity-50"
        >
          {isSaving
            ? locale === "ar"
              ? "جاري حفظ الإعدادات..."
              : "Saving Settings..."
            : locale === "ar"
              ? "حفظ جميع الإعدادات في الموقع"
              : "Save All Settings Live"}
        </button>
      </div>
    </form>
  );
}
