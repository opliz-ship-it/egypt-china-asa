"use client";

import React, { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { EditorialSlotItem, ErpCategoryOption } from "@/data/catalog";
import {
  buildRestHeaders,
  SUPABASE_URL,
  uploadImageToAsaMedia,
} from "@/lib/supabase";

interface AdminCategoriesAndNewsManagerProps {
  locale: Locale;
  accessToken: string | null;
  categories: ErpCategoryOption[];
  editorialPosts: EditorialSlotItem[];
  customPostsJson: string;
  onRefresh: () => Promise<void>;
  onActionMessage: (msg: { type: "success" | "error"; text: string }) => void;
}

/** Combined manager for ERP filter categories (Top/Bottom) and live News & Case Studies. */
export function AdminCategoriesAndNewsManager({
  locale,
  accessToken,
  categories,
  editorialPosts,
  customPostsJson,
  onRefresh,
  onActionMessage,
}: AdminCategoriesAndNewsManagerProps) {
  // Categories Form State
  const [catSlug, setCatSlug] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameZh, setCatNameZh] = useState("");
  const [catSortOrder, setCatSortOrder] = useState(3);
  const [catSaving, setCatSaving] = useState(false);

  // Editorial News/Cases Form State
  const [postType, setPostType] = useState<"news" | "case">("news");
  const [postSlug, setPostSlug] = useState("");
  const [postSlotCode, setPostSlotCode] = useState("[FACTORY_UPDATE]");
  const [postCatAr, setPostCatAr] = useState("أخبار مصنع مدينة السادات");
  const [postCatEn, setPostCatEn] = useState("Sadat City Plant Update");
  const [postTitleAr, setPostTitleAr] = useState("");
  const [postTitleEn, setPostTitleEn] = useState("");
  const [postSummaryAr, setPostSummaryAr] = useState("");
  const [postSummaryEn, setPostSummaryEn] = useState("");
  const [postBodyAr, setPostBodyAr] = useState("");
  const [postBodyEn, setPostBodyEn] = useState("");
  const [postImage, setPostImage] = useState("/assets/opt/factory-facade.webp");
  const [postBusy, setPostBusy] = useState(false);

  const requireAuth = () => {
    if (accessToken) return true;
    onActionMessage({
      type: "error",
      text:
        locale === "ar"
          ? "يرجى تسجيل دخول المشرف أولاً للحفظ."
          : "Please sign in as admin first.",
    });
    return false;
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth() || !accessToken) return;

    const cleanSlug = catSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");
    if (!cleanSlug || !catNameAr.trim() || !catNameEn.trim()) return;

    setCatSaving(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/product_categories?on_conflict=slug`,
        {
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
            updated_at: new Date().toISOString(),
          }),
        }
      );
      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حفظ التصنيف في Supabase."
              : "Failed to save category to Supabase.",
        });
        return;
      }
      setCatSlug("");
      setCatNameAr("");
      setCatNameEn("");
      setCatNameZh("");
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم حفظ التصنيف (${cleanSlug}) بنجاح.`
            : `Saved product category (${cleanSlug}).`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "خطأ اتصال أثناء حفظ التصنيف."
            : "Network error saving category.",
      });
    } finally {
      setCatSaving(false);
    }
  };

  const handleToggleCategoryActive = async (cat: ErpCategoryOption) => {
    if (!requireAuth() || !accessToken) return;
    try {
      const nextActive = !(cat.isActive ?? true);
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/product_categories?slug=eq.${encodeURIComponent(cat.slug)}`,
        {
          method: "PATCH",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            is_active: nextActive,
            updated_at: new Date().toISOString(),
          }),
        }
      );
      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر تغيير حالة التصنيف."
              : "Failed updating category visibility.",
        });
        return;
      }
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم ${nextActive ? "تفعيل" : "إخفاء"} التصنيف (${cat.nameAr}).`
            : `${nextActive ? "Enabled" : "Hidden"} category (${cat.nameEn}).`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "تعذر الاتصال بـ Supabase."
            : "Network error.",
      });
    }
  };

  const persistEditorialList = async (nextItems: EditorialSlotItem[]) => {
    if (!accessToken) return false;
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?on_conflict=setting_key`,
      {
        method: "POST",
        headers: {
          ...buildRestHeaders(accessToken),
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify([
          {
            setting_key: "editorial_posts_json",
            setting_value: JSON.stringify(nextItems),
            updated_at: new Date().toISOString(),
          },
        ]),
      }
    );
    return res.ok;
  };

  const handleUploadPostImage = async (file: File) => {
    if (!requireAuth() || !accessToken) return;
    setPostBusy(true);
    const result = await uploadImageToAsaMedia(
      "editorial",
      postSlug.trim() || "post",
      file,
      accessToken
    );
    setPostBusy(false);
    if (!result.ok || !result.publicUrl) {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "تعذر رفع صورة المقال (الحد الأقصى 5 ميجابايت JPG/PNG/WebP)."
            : "Could not upload post photo (max 5 MB JPG/PNG/WebP).",
      });
      return;
    }
    setPostImage(result.publicUrl);
  };

  const handleSaveEditorialPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth() || !accessToken) return;

    const cleanSlug =
      postSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-") || `asa-${postType}-${Date.now()}`;

    const existingCustom: EditorialSlotItem[] = (() => {
      if (!customPostsJson.trim()) return [];
      try {
        const parsed = JSON.parse(customPostsJson) as unknown;
        return Array.isArray(parsed) ? (parsed as EditorialSlotItem[]) : [];
      } catch {
        return [];
      }
    })();

    const newEntry: EditorialSlotItem = {
      slug: cleanSlug,
      slotCode: postSlotCode.trim() || "[CMS_POST]",
      type: postType,
      categoryLabel: {
        ar: postCatAr.trim() || "تحديثات المصنع",
        en: postCatEn.trim() || "Factory Update",
      },
      statusBadge: {
        ar: "منشور وموثق",
        en: "Published",
      },
      title: {
        ar: postTitleAr.trim(),
        en: postTitleEn.trim() || postTitleAr.trim(),
      },
      summary: {
        ar: postSummaryAr.trim(),
        en: postSummaryEn.trim() || postSummaryAr.trim(),
      },
      bodyParagraphs: {
        ar: postBodyAr
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean),
        en: postBodyEn
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean),
      },
      technicalSpecs: [],
      image: postImage.trim() || "/assets/opt/factory-facade.webp",
      imageAlt: {
        ar: postTitleAr.trim(),
        en: postTitleEn.trim() || postTitleAr.trim(),
      },
    };

    const nextList = [
      newEntry,
      ...existingCustom.filter((item) => item.slug !== cleanSlug),
    ];

    setPostBusy(true);
    try {
      const ok = await persistEditorialList(nextList);
      if (!ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حفظ المقال في site_settings."
              : "Failed to save article.",
        });
        return;
      }
      setPostSlug("");
      setPostTitleAr("");
      setPostTitleEn("");
      setPostSummaryAr("");
      setPostSummaryEn("");
      setPostBodyAr("");
      setPostBodyEn("");
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم نشر المقال (${newEntry.title.ar}) في الموقع المباشر.`
            : `Published (${newEntry.title.en}) live.`,
      });
    } finally {
      setPostBusy(false);
    }
  };

  const handleRemoveCustomPost = async (slug: string) => {
    if (!requireAuth() || !accessToken) return;
    let existingCustom: EditorialSlotItem[] = [];
    try {
      const parsed = JSON.parse(customPostsJson || "[]") as unknown;
      if (Array.isArray(parsed)) existingCustom = parsed as EditorialSlotItem[];
    } catch {
      existingCustom = [];
    }
    const nextList = existingCustom.filter((item) => item.slug !== slug);
    setPostBusy(true);
    try {
      const ok = await persistEditorialList(nextList);
      if (!ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر إزالة التعديل الخاص بالمقال."
              : "Failed to remove custom post override.",
        });
        return;
      }
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? "تم حذف المقال المخصص / استعادة النص الافتراضي."
            : "Removed custom editorial post.",
      });
    } finally {
      setPostBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Section A: ERP Film Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSaveCategory}
          className="lg:col-span-5 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4"
        >
          <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
            {locale === "ar"
              ? "إضافة أو تعديل تصنيف ألوان (Top / Bottom)"
              : "Add or Edit Film Swatch Category"}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="cat-slug-input"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar"
                  ? "المعرف المختصر (Slug مثل top)"
                  : "Category Slug"}
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

          <div className="flex flex-col gap-1">
            <label
              htmlFor="cat-ar-input"
              className="text-xs font-semibold text-[var(--color-ink)]"
            >
              {locale === "ar" ? "اسم التصنيف (عربي)" : "Category Name (AR)"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="cat-en-input"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "الاسم (إنجليزي)" : "Name (EN)"}
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

            <div className="flex flex-col gap-1">
              <label
                htmlFor="cat-zh-input"
                className="text-xs font-semibold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "الاسم (صيني)" : "Name (ZH)"}
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
          </div>

          <button
            type="submit"
            disabled={catSaving}
            className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm disabled:opacity-50"
          >
            {locale === "ar" ? "حفظ التصنيف" : "Save Category"}
          </button>
        </form>

        <div className="lg:col-span-7 flex flex-col gap-3">
          {categories.map((cat) => {
            const isActive = cat.isActive ?? true;
            return (
              <div
                key={cat.slug}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 flex flex-wrap items-center justify-between gap-4"
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleToggleCategoryActive(cat)}
                    className={`min-h-[36px] px-2.5 py-1 rounded-[var(--radius-xs)] text-xs font-bold border ${
                      isActive
                        ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]"
                        : "bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]"
                    }`}
                  >
                    {isActive
                      ? locale === "ar"
                        ? "مفعّل"
                        : "Active"
                      : locale === "ar"
                        ? "مخفي"
                        : "Hidden"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCatSlug(cat.slug);
                      setCatNameAr(cat.nameAr);
                      setCatNameEn(cat.nameEn);
                      setCatNameZh(cat.nameZh);
                      setCatSortOrder(cat.sortOrder);
                    }}
                    className="min-h-[36px] px-3 py-1 rounded-[var(--radius-xs)] border border-[var(--color-navy)] bg-[var(--color-sand)] text-xs font-semibold text-[var(--color-navy)]"
                  >
                    {locale === "ar" ? "تعديل" : "Load"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section B: Factory News & Project Cases CMS */}
      <div className="border-t-2 border-[var(--color-sand-border)] pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSaveEditorialPost}
          className="lg:col-span-6 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4"
        >
          <h3 className="text-lg font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
            {locale === "ar"
              ? "نشر أو تحديث الأخبار ومشاريع التطبيقات (/news و /cases)"
              : "Publish or Edit News & Project Cases (/news & /cases)"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="post-type" className="text-xs font-semibold">
                {locale === "ar" ? "النوع" : "Type"}
              </label>
              <select
                id="post-type"
                value={postType}
                onChange={(e) => setPostType(e.target.value as "news" | "case")}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              >
                <option value="news">
                  {locale === "ar" ? "خبر مصنع / صناعة" : "Factory News"}
                </option>
                <option value="case">
                  {locale === "ar" ? "دراسة حالة مشروع" : "Project Case"}
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="post-slug" className="text-xs font-semibold">
                {locale === "ar" ? "الرابط (Slug)" : "Slug"}
              </label>
              <input
                id="post-slug"
                type="text"
                dir="ltr"
                value={postSlug}
                onChange={(e) => setPostSlug(e.target.value)}
                placeholder="new-extrusion-line-2026"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="post-badge" className="text-xs font-semibold">
                {locale === "ar" ? "الرمز المرجعي" : "Slot Tag"}
              </label>
              <input
                id="post-badge"
                type="text"
                dir="ltr"
                value={postSlotCode}
                onChange={(e) => setPostSlotCode(e.target.value)}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="post-title-ar" className="text-xs font-semibold">
                {locale === "ar" ? "العنوان (عربي)" : "Title (AR)"}
              </label>
              <input
                id="post-title-ar"
                type="text"
                required
                value={postTitleAr}
                onChange={(e) => setPostTitleAr(e.target.value)}
                placeholder="تشغيل خط بثق جديد لأفلام ASA..."
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="post-title-en" className="text-xs font-semibold">
                {locale === "ar" ? "العنوان (إنجليزي)" : "Title (EN)"}
              </label>
              <input
                id="post-title-en"
                type="text"
                dir="ltr"
                value={postTitleEn}
                onChange={(e) => setPostTitleEn(e.target.value)}
                placeholder="Commissioning New ASA Surface Film Line..."
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="post-sum-ar" className="text-xs font-semibold">
                {locale === "ar" ? "ملخص قصير (عربي)" : "Summary (AR)"}
              </label>
              <textarea
                id="post-sum-ar"
                rows={2}
                required
                value={postSummaryAr}
                onChange={(e) => setPostSummaryAr(e.target.value)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="post-sum-en" className="text-xs font-semibold">
                {locale === "ar" ? "ملخص قصير (إنجليزي)" : "Summary (EN)"}
              </label>
              <textarea
                id="post-sum-en"
                rows={2}
                dir="ltr"
                value={postSummaryEn}
                onChange={(e) => setPostSummaryEn(e.target.value)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="post-body-ar" className="text-xs font-semibold">
                {locale === "ar" ? "التفاصيل الكاملة (عربي)" : "Full Text (AR)"}
              </label>
              <textarea
                id="post-body-ar"
                rows={3}
                value={postBodyAr}
                onChange={(e) => setPostBodyAr(e.target.value)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="post-body-en" className="text-xs font-semibold">
                {locale === "ar" ? "التفاصيل الكاملة (إنجليزي)" : "Full Text (EN)"}
              </label>
              <textarea
                id="post-body-en"
                rows={3}
                dir="ltr"
                value={postBodyEn}
                onChange={(e) => setPostBodyEn(e.target.value)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <img
              src={postImage}
              alt="Post preview"
              className="w-16 h-12 rounded-[var(--radius-xs)] object-cover border border-[var(--color-gold)]"
            />
            <label className="btn-action bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-navy)] text-xs cursor-pointer">
              <span>
                {locale === "ar" ? "رفع صورة للخبر / المشروع" : "Upload Article Photo"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={postBusy}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUploadPostImage(file);
                }}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={postBusy}
            className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm disabled:opacity-50"
          >
            {locale === "ar" ? "نشر / حفظ المقال" : "Publish Editorial Post"}
          </button>
        </form>

        <div className="lg:col-span-6 flex flex-col gap-3">
          <h4 className="text-base font-bold text-[var(--color-navy)]">
            {locale === "ar"
              ? `المقالات ودراسات الحالة الحالية (${editorialPosts.length})`
              : `Live News & Case Studies (${editorialPosts.length})`}
          </h4>
          {editorialPosts.map((item) => (
            <div
              key={item.slug}
              className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.title[locale]}
                  className="w-16 h-16 rounded-[var(--radius-xs)] object-cover shrink-0 border border-[var(--color-sand-border)]"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] font-mono">
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-[var(--color-crimson)] font-semibold">
                      {item.statusBadge[locale]}
                    </span>
                  </div>
                  <strong className="text-sm font-bold text-[var(--color-navy)]">
                    {item.title[locale]}
                  </strong>
                  <p className="text-xs text-[var(--color-charcoal)] line-clamp-2">
                    {item.summary[locale]}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPostType(item.type);
                    setPostSlug(item.slug);
                    setPostSlotCode(item.slotCode);
                    setPostCatAr(item.categoryLabel.ar);
                    setPostCatEn(item.categoryLabel.en);
                    setPostTitleAr(item.title.ar);
                    setPostTitleEn(item.title.en);
                    setPostSummaryAr(item.summary.ar);
                    setPostSummaryEn(item.summary.en);
                    setPostBodyAr(item.bodyParagraphs.ar.join("\n"));
                    setPostBodyEn(item.bodyParagraphs.en.join("\n"));
                    setPostImage(item.image);
                  }}
                  className="min-h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] border border-[var(--color-navy)] bg-[var(--color-sand)] text-xs font-semibold text-[var(--color-navy)]"
                >
                  {locale === "ar" ? "تعديل" : "Edit"}
                </button>
                {customPostsJson.includes(item.slug) && (
                  <button
                    type="button"
                    onClick={() => void handleRemoveCustomPost(item.slug)}
                    className="min-h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] border border-[var(--color-error-border)] text-[var(--color-error)] text-xs font-semibold"
                  >
                    {locale === "ar" ? "حذف التعديل" : "Remove"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
