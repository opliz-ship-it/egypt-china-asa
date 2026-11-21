"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";
import {
  buildRestHeaders,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_STORAGE_BUCKET,
  SUPABASE_URL,
  type SupabaseInquiryRow,
} from "@/lib/supabase";

interface AdminDashboardClientProps {
  locale: Locale;
  dict: Dictionary;
}

type AdminTab = "media" | "categories" | "skus" | "settings";

const DEFAULT_MEDIA_SLOTS: Array<{
  slotKey: string;
  labelAr: string;
  labelEn: string;
}> = [
  {
    slotKey: "hero_partnership",
    labelAr: "صورة الشراكة المصرية الصينية (Hero Slide 01)",
    labelEn: "Sino-Egyptian Partnership Hero Image (Slide 01)",
  },
  {
    slotKey: "hero_red_sheet",
    labelAr: "صورة لوح ASA الأحمر مع الحبيبات (Hero Slide 01)",
    labelEn: "Red ASA Sheet & Granules Specimen (Slide 01)",
  },
  {
    slotKey: "jar_granules",
    labelAr: "صورة العبوات الزجاجية لحبيبات ASA الملونة (Slide 02)",
    labelEn: "Colored ASA Resin Granules in Glass Jars (Slide 02)",
  },
  {
    slotKey: "black_corrugated",
    labelAr: "صورة لوح السقف الأسود المموج (Slide 02)",
    labelEn: "Charcoal Black Corrugated ASA Sheet (Slide 02)",
  },
  {
    slotKey: "factory_facade",
    labelAr: "صورة واجهة مصنع مدينة السادات",
    labelEn: "Sadat City Factory Exterior Photograph",
  },
  {
    slotKey: "red_sheet_macro",
    labelAr: "صورة جودة السطح والالتصاق الحراري",
    labelEn: "Surface Uniformity & Adhesion Macro Specimen",
  },
];

export function AdminDashboardClient({
  locale,
  dict,
}: AdminDashboardClientProps) {
  const {
    skus,
    categories,
    media,
    settings,
    refreshCatalog,
  } = useSupabaseCatalog();

  const [activeTab, setActiveTab] = useState<AdminTab>("skus");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // New Category Form State
  const [catSlug, setCatSlug] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameZh, setCatNameZh] = useState("");
  const [catSortOrder, setCatSortOrder] = useState(3);

  // New / Edit SKU Form State
  const [skuItemNo, setSkuItemNo] = useState(14);
  const [skuCode, setSkuCode] = useState("");
  const [skuCategorySlug, setSkuCategorySlug] = useState("asa-film-top");
  const [skuColorAr, setSkuColorAr] = useState("");
  const [skuColorEn, setSkuColorEn] = useState("");
  const [skuColorZh, setSkuColorZh] = useState("");
  const [skuHex, setSkuHex] = useState("0089B6");

  // Contact & Social Settings Form State
  const [phoneInput, setPhoneInput] = useState("");
  const [whatsappInput, setWhatsappInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [locationArInput, setLocationArInput] = useState("");
  const [locationEnInput, setLocationEnInput] = useState("");
  const [facebookInput, setFacebookInput] = useState("");
  const [tiktokInput, setTiktokInput] = useState("");
  const [instagramInput, setInstagramInput] = useState("");

  // Inquiries State
  const [inquiries, setInquiries] = useState<SupabaseInquiryRow[]>([]);

  useEffect(() => {
    setSkuItemNo(skus.length + 1);
  }, [skus.length]);

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
    }
  }, [settings]);

  const loadInquiries = useCallback(async (token: string) => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/sample_inquiries?select=*&order=created_at.desc&limit=25`,
        {
          headers: buildRestHeaders(token),
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as SupabaseInquiryRow[];
        if (Array.isArray(rows)) {
          setInquiries(rows);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus(null);
    setActionMessage(null);
    const trimmedIdentifier = loginEmail.trim();
    const resolvedAuthEmail = trimmedIdentifier.includes("@")
      ? trimmedIdentifier
      : `${trimmedIdentifier.toLowerCase()}@egychina-asa.com`;

    try {
      const res = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resolvedAuthEmail,
            password: loginPassword,
          }),
        }
      );
      const data = (await res.json()) as {
        access_token?: string;
        user?: { email?: string };
        error_description?: string;
        msg?: string;
      };
      if (!res.ok || !data.access_token) {
        setAuthStatus(
          data.error_description ||
            data.msg ||
            (locale === "ar"
              ? "تعذر تسجيل الدخول. تأكد من إنشاء حساب المشرف في Supabase Auth وربطه بجدول admin_users."
              : "Sign-in failed. Verify the admin user exists in Supabase Auth and public.admin_users.")
        );
        return;
      }
      setAccessToken(data.access_token);
      setAdminEmail(data.user?.email ?? loginEmail.trim());
      setLoginPassword("");
      void loadInquiries(data.access_token);
      setActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? "تم تسجيل دخول المشرف بنجاح. يمكنك الآن حفظ التعديلات ورفع الصور مباشرة."
            : "Admin authenticated. You can now upload images and save catalog changes.",
      });
    } catch {
      setAuthStatus(
        locale === "ar"
          ? "حدث خطأ في الاتصال بخادم المصادقة."
          : "Network error connecting to Supabase Auth."
      );
    }
  };

  const handleUploadMedia = async (slotKey: string, file: File) => {
    if (!accessToken) {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "يرجى تسجيل الدخول بحساب المشرف أولاً لحفظ الصور في قاعدة البيانات."
            : "Please sign in with your admin account above before uploading images.",
      });
      return;
    }

    const ext = (file.name.split(".").pop() || "webp").toLowerCase();
    const objectPath = `slots/${slotKey}-${Date.now()}.${ext}`;

    try {
      const uploadRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${SUPABASE_STORAGE_BUCKET}/${objectPath}`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": file.type || "image/webp",
            "x-upsert": "true",
          },
          body: file,
        }
      );

      if (!uploadRes.ok) {
        setActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر رفع الصورة. تأكد من أن حجم الملف أقل من 5 ميجابايت وأن حسابك مضاف في admin_users."
              : "Image upload rejected. Ensure file is under 5MB and your user ID is in public.admin_users.",
        });
        return;
      }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${objectPath}`;
      const matchedSlot = DEFAULT_MEDIA_SLOTS.find((s) => s.slotKey === slotKey);

      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/site_media?on_conflict=slot_key`,
        {
          method: "POST",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({
            slot_key: slotKey,
            title_ar: matchedSlot?.labelAr ?? slotKey,
            image_url: publicUrl,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!patchRes.ok) {
        setActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تم رفع الملف لكن تعذر تحديث الرابط في جدول site_media."
              : "File uploaded, but updating site_media row failed.",
        });
        return;
      }

      await refreshCatalog();
      setActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم تحديث صورة (${slotKey}) بنجاح وظهرت الآن في الموقع المباشر.`
            : `Updated image slot (${slotKey}) across the live catalog.`,
      });
    } catch {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "حدث خطأ أثناء رفع الصورة إلى Supabase Storage."
            : "Error uploading image to Supabase Storage.",
      });
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "يرجى تسجيل دخول المشرف أولاً لإضافة تصنيف جديد."
            : "Please sign in as admin first to save a new product category.",
      });
      return;
    }

    const cleanSlug = catSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");
    if (!cleanSlug || !catNameAr.trim() || !catNameEn.trim()) return;

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/product_categories`, {
        method: "POST",
        headers: {
          ...buildRestHeaders(accessToken),
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          slug: cleanSlug,
          name_ar: catNameAr.trim(),
          name_en: catNameEn.trim(),
          name_zh: catNameZh.trim() || catNameEn.trim(),
          sort_order: Number(catSortOrder) || 3,
        }),
      });

      if (!res.ok) {
        setActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حفظ التصنيف في قاعدة البيانات."
              : "Failed to save category to Supabase.",
        });
        return;
      }

      setCatSlug("");
      setCatNameAr("");
      setCatNameEn("");
      setCatNameZh("");
      await refreshCatalog();
      setActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? "تم حفظ تصنيف المنتجات الجديد بنجاح."
            : "Product category saved and synced to live catalog.",
      });
    } catch {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "خطأ في الاتصال أثناء حفظ التصنيف."
            : "Network error while saving category.",
      });
    }
  };

  const handleAddOrUpdateSku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "يرجى تسجيل دخول المشرف أولاً لإضافة أو تعديل كود لون."
            : "Please sign in as admin first to add or edit an SKU.",
      });
      return;
    }

    const cleanCode = skuCode.trim().toUpperCase();
    if (!cleanCode || !skuColorAr.trim() || !skuColorEn.trim()) return;

    const cleanHex = skuHex.replace(/[^0-9a-fA-F]/g, "").slice(0, 6) || "0089B6";
    const resolvedItemGroup =
      skuCategorySlug.includes("bottom")
        ? "ASA Film (Bottom)"
        : skuCategorySlug.includes("top")
          ? "ASA Film (Top)"
          : "Other";

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/catalog_items?on_conflict=code`,
        {
          method: "POST",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({
            sort_order: Number(skuItemNo) || skus.length + 1,
            code: cleanCode,
            item_group: resolvedItemGroup,
            category_slug: categories.some((c) => c.slug === skuCategorySlug)
              ? skuCategorySlug
              : null,
            color_ar: skuColorAr.trim(),
            color_en: skuColorEn.trim(),
            color_zh: skuColorZh.trim() || skuColorEn.trim(),
            hex_color: `#${cleanHex}`,
            is_active: true,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) {
        setActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حفظ الكود في جدول catalog_items."
              : "Failed to save SKU to catalog_items.",
        });
        return;
      }

      setSkuCode("");
      setSkuColorAr("");
      setSkuColorEn("");
      setSkuColorZh("");
      await refreshCatalog();
      setActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم حفظ الكود (${cleanCode}) وتحديث معاينة لوح السقف في الموقع.`
            : `Saved SKU (${cleanCode}) and synced live roof sheet previewer.`,
      });
    } catch {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "خطأ في الاتصال أثناء حفظ الكود."
            : "Network error while saving SKU.",
      });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "يرجى تسجيل دخول المشرف أولاً لحفظ بيانات التواصل."
            : "Please sign in as admin first to update contact settings.",
      });
      return;
    }

    try {
      const nowIso = new Date().toISOString();
      const settingRows = [
        { setting_key: "phone_ar", setting_value: phoneInput.trim(), updated_at: nowIso },
        { setting_key: "whatsapp_number", setting_value: whatsappInput.trim(), updated_at: nowIso },
        { setting_key: "email", setting_value: emailInput.trim(), updated_at: nowIso },
        { setting_key: "address_ar", setting_value: locationArInput.trim(), updated_at: nowIso },
        { setting_key: "address_en", setting_value: locationEnInput.trim(), updated_at: nowIso },
        { setting_key: "facebook_url", setting_value: facebookInput.trim(), updated_at: nowIso },
        { setting_key: "tiktok_url", setting_value: tiktokInput.trim(), updated_at: nowIso },
        { setting_key: "instagram_url", setting_value: instagramInput.trim(), updated_at: nowIso },
      ];

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/site_settings?on_conflict=setting_key`,
        {
          method: "POST",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify(settingRows),
        }
      );

      if (!res.ok) {
        setActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حفظ بيانات التواصل في جدول site_settings."
              : "Failed to update site_settings row.",
        });
        return;
      }

      await refreshCatalog();
      setActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? "تم تحديث أرقام الهاتف والواتساب والبريد الرسمي في الموقع."
            : "Updated phone, WhatsApp, and email across the live website.",
      });
    } catch {
      setActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "حدث خطأ أثناء حفظ إعدادات التواصل."
            : "Error updating contact settings.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Admin Authentication Bar */}
      <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-5 sm:p-6 text-[var(--color-on-navy)] flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-navy-border)] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-gold-bright)]">
              {locale === "ar"
                ? "بوابة مصادقة المشرف (Supabase Auth & RLS)"
                : "Admin Authentication Gate (Supabase Auth & RLS)"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-on-navy-muted)] mt-0.5">
              {accessToken
                ? locale === "ar"
                  ? `متصل الآن بحساب المشرف: ${adminEmail}`
                  : `Authenticated as admin: ${adminEmail}`
                : locale === "ar"
                  ? "يمكنك استعراض جميع الأقسام والبيانات الحية أدناه، ولتفعيل الحفظ ورفع الصور سجل دخولك بحساب المشرف."
                  : "Browse all live database tabs below. Sign in with your admin credentials to enable writes and image uploads."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-[var(--radius-xs)] text-xs font-bold border ${
                accessToken
                  ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]"
                  : "bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border-[var(--color-gold)]"
              }`}
            >
              {accessToken
                ? locale === "ar"
                  ? "✓ صلاحية تعديل كاملة"
                  : "✓ Write Access Active"
                : locale === "ar"
                  ? "وضع المعاينة الحية (قراءة)"
                  : "Live Preview Mode (Read)"}
            </span>

            <Link
              href={`/${locale}`}
              className="btn-action bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-xs"
            >
              {dict.common.backToArchive}
            </Link>
          </div>
        </div>

        {!accessToken ? (
          <form
            onSubmit={handleSignIn}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-5 flex flex-col gap-1">
              <label
                htmlFor="admin-login-email"
                className="text-xs font-semibold text-[var(--color-on-navy-muted)]"
              >
                {locale === "ar"
                  ? "اسم المستخدم أو البريد الإلكتروني"
                  : "Username or Email"}
              </label>
              <input
                id="admin-login-email"
                type="text"
                autoComplete="username"
                dir="ltr"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={locale === "ar" ? "اسم المستخدم" : "username"}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-ivory)] px-3.5 py-2 text-sm text-[var(--color-ink)]"
              />
            </div>

            <div className="sm:col-span-4 flex flex-col gap-1">
              <label
                htmlFor="admin-login-password"
                className="text-xs font-semibold text-[var(--color-on-navy-muted)]"
              >
                {locale === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                id="admin-login-password"
                type="password"
                dir="ltr"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-ivory)] px-3.5 py-2 text-sm text-[var(--color-ink)]"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="btn-action w-full bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-crimson-hover)] text-sm"
              >
                {locale === "ar" ? "تسجيل دخول المشرف" : "Admin Sign In"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setAccessToken(null);
                setAdminEmail("");
              }}
              className="btn-action bg-[var(--color-navy-deep)] text-[var(--color-on-navy)] border border-[var(--color-gold)] text-xs"
            >
              {locale === "ar" ? "تسجيل الخروج" : "Sign Out"}
            </button>
          </div>
        )}

        {authStatus && (
          <div
            role="alert"
            className="rounded-[var(--radius-xs)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] p-3 text-xs font-semibold text-[var(--color-error)]"
          >
            {authStatus}
          </div>
        )}
      </div>

      {actionMessage && (
        <div
          role="status"
          className={`rounded-[var(--radius-sm)] border p-4 text-sm font-semibold ${
            actionMessage.type === "success"
              ? "border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success)]"
              : "border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)]"
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* 4-Tab Admin Navigation */}
      <div
        role="tablist"
        aria-label={
          locale === "ar" ? "أقسام لوحة التحكم" : "Admin dashboard sections"
        }
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "skus"}
          onClick={() => setActiveTab("skus")}
          className={`min-h-[56px] p-4 rounded-[var(--radius-sm)] border text-start font-bold transition-colors duration-150 ${
            activeTab === "skus"
              ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-2 border-[var(--color-gold)]"
              : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
          }`}
        >
          {locale === "ar"
            ? `01. أكواد وألوان الكتالوج (${skus.length})`
            : `01. Catalog SKUs & Colors (${skus.length})`}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "media"}
          onClick={() => setActiveTab("media")}
          className={`min-h-[56px] p-4 rounded-[var(--radius-sm)] border text-start font-bold transition-colors duration-150 ${
            activeTab === "media"
              ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-2 border-[var(--color-gold)]"
              : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
          }`}
        >
          {locale === "ar"
            ? `02. تغيير صور الموقع (${DEFAULT_MEDIA_SLOTS.length} صور)`
            : `02. Replace Site Photos (${DEFAULT_MEDIA_SLOTS.length} Slots)`}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "categories"}
          onClick={() => setActiveTab("categories")}
          className={`min-h-[56px] p-4 rounded-[var(--radius-sm)] border text-start font-bold transition-colors duration-150 ${
            activeTab === "categories"
              ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-2 border-[var(--color-gold)]"
              : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
          }`}
        >
          {locale === "ar"
            ? `03. تصنيفات المنتجات (${categories.length})`
            : `03. Product Categories (${categories.length})`}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
          className={`min-h-[56px] p-4 rounded-[var(--radius-sm)] border text-start font-bold transition-colors duration-150 ${
            activeTab === "settings"
              ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-2 border-[var(--color-gold)]"
              : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
          }`}
        >
          {locale === "ar"
            ? "04. بيانات التواصل والطلبات"
            : "04. Contact & Sample Inquiries"}
        </button>
      </div>

      {/* Tab 1: SKUs & Live Color Management */}
      {activeTab === "skus" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add/Edit SKU Form */}
          <form
            onSubmit={handleAddOrUpdateSku}
            className="lg:col-span-5 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4"
            style={{ boxShadow: "var(--shadow-subtle)" }}
          >
            <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
              {locale === "ar"
                ? "إضافة أو تحديث كود صنف ولون (SKU)"
                : "Add or Update ASA Catalog SKU"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="sku-code-input"
                  className="text-xs font-semibold text-[var(--color-ink)]"
                >
                  {locale === "ar" ? "كود الصنف (ERP / RAL)" : "SKU Code"}
                </label>
                <input
                  id="sku-code-input"
                  type="text"
                  dir="ltr"
                  required
                  value={skuCode}
                  onChange={(e) => setSkuCode(e.target.value)}
                  placeholder="RAL5012 / CMO96398"
                  className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="sku-itemno-input"
                  className="text-xs font-semibold text-[var(--color-ink)]"
                >
                  {locale === "ar" ? "رقم الترتيب (م)" : "Serial No."}
                </label>
                <input
                  id="sku-itemno-input"
                  type="number"
                  dir="ltr"
                  required
                  value={skuItemNo}
                  onChange={(e) => setSkuItemNo(Number(e.target.value))}
                  className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="sku-cat-select"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "فئة الصنف (Top / Bottom)" : "Product Category"}
              </label>
              <select
                id="sku-cat-select"
                value={skuCategorySlug}
                onChange={(e) => setSkuCategorySlug(e.target.value)}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {locale === "ar" ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="sku-color-ar"
                  className="text-xs font-semibold text-[var(--color-ink)]"
                >
                  {locale === "ar" ? "اسم اللون (عربي)" : "Color Name (AR)"}
                </label>
                <input
                  id="sku-color-ar"
                  type="text"
                  required
                  value={skuColorAr}
                  onChange={(e) => setSkuColorAr(e.target.value)}
                  placeholder="أزرق سماوي"
                  className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="sku-color-en"
                  className="text-xs font-semibold text-[var(--color-ink)]"
                >
                  {locale === "ar" ? "اسم اللون (EN)" : "Color Name (EN)"}
                </label>
                <input
                  id="sku-color-en"
                  type="text"
                  dir="ltr"
                  required
                  value={skuColorEn}
                  onChange={(e) => setSkuColorEn(e.target.value)}
                  placeholder="Blue"
                  className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="sku-color-zh"
                  className="text-xs font-semibold text-[var(--color-ink)]"
                >
                  {locale === "ar" ? "اسم اللون (صيني)" : "Color Name (ZH)"}
                </label>
                <input
                  id="sku-color-zh"
                  type="text"
                  dir="ltr"
                  value={skuColorZh}
                  onChange={(e) => setSkuColorZh(e.target.value)}
                  placeholder="天蓝色"
                  className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="sku-hex-input"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar"
                  ? "كود درجة اللون (HEX مثل 0089B6)"
                  : "Color Hex Code (e.g. 0089B6)"}
              </label>
              <input
                id="sku-hex-input"
                type="text"
                dir="ltr"
                value={skuHex}
                onChange={(e) => setSkuHex(e.target.value)}
                placeholder="0089B6"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] text-sm"
            >
              {locale === "ar"
                ? "حفظ الكود في الكتالوج المباشر"
                : "Save SKU to Live Catalog"}
            </button>
          </form>

          {/* Current 13 SKUs Table */}
          <div className="lg:col-span-7 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden">
            <div className="p-4 sm:p-5 bg-[var(--color-sand)] border-b border-[var(--color-sand-border)] flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-navy)]">
                {locale === "ar"
                  ? `جدول الأصناف المعتمدة في قاعدة البيانات (${skus.length} صنفاً)`
                  : `Certified Catalog SKUs in Database (${skus.length} Grades)`}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[var(--color-navy)] text-[var(--color-on-navy)]">
                    <th className="p-3 text-start">#</th>
                    <th className="p-3 text-start">
                      {locale === "ar" ? "اللون" : "Swatch"}
                    </th>
                    <th className="p-3 text-start">
                      {locale === "ar" ? "الكود" : "Code"}
                    </th>
                    <th className="p-3 text-start">
                      {locale === "ar" ? "نوع الصنف" : "Layer"}
                    </th>
                    <th className="p-3 text-start">
                      {locale === "ar" ? "الاسم" : "Shade Name"}
                    </th>
                    <th className="p-3 text-start">
                      {locale === "ar" ? "تعديل سريع" : "Quick Edit"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {skus.map((s, idx) => (
                    <tr
                      key={s.code}
                      className={
                        idx % 2 === 0
                          ? "bg-[var(--color-ivory)]"
                          : "bg-[var(--color-sand)]/50"
                      }
                    >
                      <td
                        dir="ltr"
                        className="p-3 font-mono border-t border-[var(--color-sand-border)]"
                      >
                        {s.itemNo}
                      </td>
                      <td className="p-3 border-t border-[var(--color-sand-border)]">
                        <span
                          aria-hidden="true"
                          className="w-6 h-6 rounded-[var(--radius-xs)] border border-[var(--color-gold)] inline-block"
                          style={{ backgroundColor: s.colorToken }}
                        />
                      </td>
                      <td
                        dir="ltr"
                        className="p-3 font-mono font-bold text-[var(--color-navy)] border-t border-[var(--color-sand-border)]"
                      >
                        {s.code}
                      </td>
                      <td
                        dir="ltr"
                        className="p-3 font-semibold text-[var(--color-crimson)] border-t border-[var(--color-sand-border)]"
                      >
                        {s.category}
                      </td>
                      <td className="p-3 border-t border-[var(--color-sand-border)]">
                        {locale === "ar" ? s.colorAr : s.colorEn} ({s.colorZh})
                      </td>
                      <td className="p-3 border-t border-[var(--color-sand-border)]">
                        <button
                          type="button"
                          onClick={() => {
                            setSkuItemNo(s.itemNo);
                            setSkuCode(s.code);
                            setSkuCategorySlug(s.categorySlug);
                            setSkuColorAr(s.colorAr);
                            setSkuColorEn(s.colorEn);
                            setSkuColorZh(s.colorZh);
                          }}
                          className="px-2.5 py-1 rounded-[var(--radius-xs)] border border-[var(--color-navy)] bg-[var(--color-sand)] text-xs font-semibold text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)]"
                        >
                          {locale === "ar" ? "تعديل" : "Load"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Site Photos & Media Replacement */}
      {activeTab === "media" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_MEDIA_SLOTS.map((slot) => {
            const currentSrc = media[slot.slotKey] || "/assets/opt/hero-partnership.webp";
            return (
              <article
                key={slot.slotKey}
                className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden flex flex-col justify-between"
                style={{ boxShadow: "var(--shadow-subtle)" }}
              >
                <div>
                  <div className="bg-[var(--color-navy-deep)] border-b border-[var(--color-sand-border)] p-3">
                    <img
                      src={currentSrc}
                      width={480}
                      height={280}
                      loading="lazy"
                      alt={locale === "ar" ? slot.labelAr : slot.labelEn}
                      className="w-full h-44 object-cover rounded-[var(--radius-xs)] block"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1.5">
                    <span
                      dir="ltr"
                      className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                    >
                      {slot.slotKey}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--color-navy)]">
                      {locale === "ar" ? slot.labelAr : slot.labelEn}
                    </h3>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <label className="btn-action w-full bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] text-xs sm:text-sm cursor-pointer">
                    <span>
                      {locale === "ar"
                        ? "اختر صورة جديدة للرفع..."
                        : "Select New Photo to Upload..."}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleUploadMedia(slot.slotKey, file);
                        }
                      }}
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Tab 3: Dynamic Product Categories (Feature #10) */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleAddCategory}
            className="lg:col-span-5 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4"
          >
            <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
              {locale === "ar"
                ? "إضافة خط إنتاج أو تصنيف جديد"
                : "Add New Product Line Category"}
            </h3>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="cat-slug-input"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar"
                  ? "المعرف الإنجليزي المختصر (Slug مثل granules أو sheets)"
                  : "Category Slug (e.g. granules, sheets)"}
              </label>
              <input
                id="cat-slug-input"
                type="text"
                dir="ltr"
                required
                value={catSlug}
                onChange={(e) => setCatSlug(e.target.value)}
                placeholder="granules"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="cat-ar-input"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "اسم التصنيف (عربي)" : "Category Name (Arabic)"}
              </label>
              <input
                id="cat-ar-input"
                type="text"
                required
                value={catNameAr}
                onChange={(e) => setCatNameAr(e.target.value)}
                placeholder="حبيبات راتنج ASA"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="cat-en-input"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar"
                  ? "اسم التصنيف (إنجليزي)"
                  : "Category Name (English)"}
              </label>
              <input
                id="cat-en-input"
                type="text"
                dir="ltr"
                required
                value={catNameEn}
                onChange={(e) => setCatNameEn(e.target.value)}
                placeholder="ASA Resin Granules"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="cat-zh-input"
                  className="text-xs font-semibold text-[var(--color-ink)]"
                >
                  {locale === "ar" ? "الاسم (صيني)" : "Name (Chinese)"}
                </label>
                <input
                  id="cat-zh-input"
                  type="text"
                  dir="ltr"
                  value={catNameZh}
                  onChange={(e) => setCatNameZh(e.target.value)}
                  placeholder="ASA 树脂颗粒"
                  className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="cat-sort-input"
                  className="text-xs font-semibold text-[var(--color-ink)]"
                >
                  {locale === "ar" ? "ترتيب العرض" : "Sort Order"}
                </label>
                <input
                  id="cat-sort-input"
                  type="number"
                  dir="ltr"
                  value={catSortOrder}
                  onChange={(e) => setCatSortOrder(Number(e.target.value))}
                  className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
            >
              {locale === "ar" ? "حفظ التصنيف" : "Save Category"}
            </button>
          </form>

          <div className="lg:col-span-7 flex flex-col gap-3">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span
                    dir="ltr"
                    className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                  >
                    slug: {cat.slug} (order: {cat.sortOrder})
                  </span>
                  <strong className="text-base font-bold text-[var(--color-navy)]">
                    {cat.nameAr}
                  </strong>
                  <span dir="ltr" className="text-xs text-[var(--color-charcoal)]">
                    {cat.nameEn} : {cat.nameZh}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Contact Settings & Sample Inquiries */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleSaveSettings}
            className="lg:col-span-5 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4"
          >
            <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
              {locale === "ar"
                ? "بيانات التواصل الرسمية وأرقام واتساب"
                : "Official Contact & WhatsApp Settings"}
            </h3>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="set-phone"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "رقم هاتف المبيعات" : "Sales Phone"}
              </label>
              <input
                id="set-phone"
                type="text"
                dir="ltr"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+20 10 XXXX XXXX"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="set-whatsapp"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar"
                  ? "رقم واتساب لاستقبال طلبات العينات (مع كود الدولة مثل 2010...)"
                  : "WhatsApp Number for Sample Tray Inquiries (e.g. 2010...)"}
              </label>
              <input
                id="set-whatsapp"
                type="text"
                dir="ltr"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                placeholder="2010XXXXXXXX"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="set-email"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "البريد الإلكتروني الرسمي" : "Official Email"}
              </label>
              <input
                id="set-email"
                type="text"
                dir="ltr"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="sales@egychina-asa.com"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="set-address-ar"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "عنوان المصنع (عربي)" : "Factory Address (AR)"}
              </label>
              <input
                id="set-address-ar"
                type="text"
                value={locationArInput}
                onChange={(e) => setLocationArInput(e.target.value)}
                placeholder="المنطقة الصناعية، مدينة السادات، المنوفية"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="set-facebook"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
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

            <div className="flex flex-col gap-1">
              <label
                htmlFor="set-tiktok"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "رابط تيك توك (TikTok)" : "TikTok Profile URL"}
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
              <label
                htmlFor="set-instagram"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "رابط إنستغرام (Instagram)" : "Instagram Profile URL"}
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

            <button
              type="submit"
              className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
            >
              {locale === "ar" ? "حفظ بيانات التواصل" : "Save Contact Details"}
            </button>
          </form>

          <div className="lg:col-span-7 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
              {locale === "ar"
                ? `طلبات العينات الواردة من الموقع (${inquiries.length})`
                : `Submitted Sample Inquiries (${inquiries.length})`}
            </h3>

            {inquiries.length === 0 ? (
              <p className="text-sm text-[var(--color-charcoal)]">
                {accessToken
                  ? locale === "ar"
                    ? "لا توجد طلبات عينات مسجلة حتى الآن."
                    : "No sample inquiries logged yet."
                  : locale === "ar"
                    ? "سجل دخولك بحساب المشرف أعلاه لعرض سجل طلبات العينات الواردة من العملاء."
                    : "Sign in as admin above to inspect customer sample inquiries."}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {inquiries.map((inq, i) => (
                  <div
                    key={inq.id ?? i}
                    className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] p-4 flex flex-col gap-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm font-bold text-[var(--color-navy)]">
                        {inq.contact_name} ({inq.company_name})
                      </strong>
                      <span
                        dir="ltr"
                        className="font-mono text-xs font-bold text-[var(--color-crimson)]"
                      >
                        {inq.requested_codes}
                      </span>
                    </div>
                    <span dir="ltr" className="font-mono text-xs text-[var(--color-charcoal)]">
                      {inq.phone}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--color-ink)]">
                      {inq.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
