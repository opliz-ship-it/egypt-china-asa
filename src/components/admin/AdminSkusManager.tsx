"use client";

import React, { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ErpAsaSkuItem, ErpCategoryOption } from "@/data/catalog";
import {
  buildRestHeaders,
  normalizeHexColor,
  SUPABASE_URL,
  uploadImageToAsaMedia,
} from "@/lib/supabase";

interface AdminSkusManagerProps {
  locale: Locale;
  accessToken: string | null;
  skus: ErpAsaSkuItem[];
  categories: ErpCategoryOption[];
  onRefresh: () => Promise<void>;
  onActionMessage: (msg: { type: "success" | "error"; text: string }) => void;
}

/** Full CRUD manager for catalog color SKUs with Color Picker, image upload, active toggle, and delete confirmation. */
export function AdminSkusManager({
  locale,
  accessToken,
  skus,
  categories,
  onRefresh,
  onActionMessage,
}: AdminSkusManagerProps) {
  const [skuItemNo, setSkuItemNo] = useState(skus.length + 1);
  const [skuCode, setSkuCode] = useState("");
  const [skuCategorySlug, setSkuCategorySlug] = useState(
    categories[0]?.slug ?? "asa-film-top"
  );
  const [skuColorAr, setSkuColorAr] = useState("");
  const [skuColorEn, setSkuColorEn] = useState("");
  const [skuColorZh, setSkuColorZh] = useState("");
  const [skuHex, setSkuHex] = useState("0089B6");
  const [skuImageUrl, setSkuImageUrl] = useState("");
  const [skuIsActive, setSkuIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [confirmDeleteCode, setConfirmDeleteCode] = useState<string | null>(null);

  const filteredSkus = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return skus.filter((s) => {
      if (statusFilter === "active" && !s.inStock) return false;
      if (statusFilter === "hidden" && s.inStock) return false;
      if (!q) return true;
      return (
        s.code.toLowerCase().includes(q) ||
        s.colorAr.toLowerCase().includes(q) ||
        s.colorEn.toLowerCase().includes(q) ||
        s.colorZh.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    });
  }, [skus, searchText, statusFilter]);

  const pickerHexValue = `#${normalizeHexColor(skuHex, "0089B6")}`;

  const resetForm = () => {
    setSkuCode("");
    setSkuItemNo(skus.length + 1);
    setSkuColorAr("");
    setSkuColorEn("");
    setSkuColorZh("");
    setSkuHex("0089B6");
    setSkuImageUrl("");
    setSkuIsActive(true);
  };

  const handleUploadSkuImage = async (file: File) => {
    if (!accessToken) {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "سجل دخولك بحساب المشرف أولاً لرفع صورة الكود."
            : "Please sign in as admin before uploading an SKU specimen photo.",
      });
      return;
    }

    setIsUploadingPhoto(true);
    const result = await uploadImageToAsaMedia(
      "skus",
      skuCode.trim() || "specimen",
      file,
      accessToken
    );
    setIsUploadingPhoto(false);

    if (!result.ok || !result.publicUrl) {
      const msg =
        result.errorCode === "too_large"
          ? locale === "ar"
            ? "حجم الصورة يجب أن يكون أقل من 5 ميجابايت."
            : "Image exceeds 5 MB storage bucket limit."
          : result.errorCode === "invalid_type"
            ? locale === "ar"
              ? "الصيغ المسموحة فقط: JPG، PNG، WebP."
              : "Allowed image types: JPG, PNG, WebP only."
            : locale === "ar"
              ? "تعذر رفع صورة الكود إلى Supabase Storage."
              : "Upload to Supabase Storage failed.";
      onActionMessage({ type: "error", text: msg });
      return;
    }

    setSkuImageUrl(result.publicUrl);
    onActionMessage({
      type: "success",
      text:
        locale === "ar"
          ? "تم رفع صورة العينة، اضغط «حفظ الكود في الكتالوج المباشر» لتثبيتها."
          : "Specimen image uploaded. Click Save SKU below to apply it.",
    });
  };

  const handleSaveSku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onActionMessage({
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

    const cleanHex = normalizeHexColor(skuHex, "0089B6");
    const matchedCat = categories.find((c) => c.slug === skuCategorySlug);
    const resolvedItemGroup = skuCategorySlug.includes("bottom")
      ? "ASA Film (Bottom)"
      : skuCategorySlug.includes("top")
        ? "ASA Film (Top)"
        : matchedCat?.nameEn || "ASA Material";

    setIsSaving(true);
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
            category_slug: matchedCat ? matchedCat.slug : null,
            color_ar: skuColorAr.trim(),
            color_en: skuColorEn.trim(),
            color_zh: skuColorZh.trim() || skuColorEn.trim(),
            hex_color: `#${cleanHex}`,
            image_url: skuImageUrl.trim() || null,
            is_active: skuIsActive,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حفظ الكود في جدول catalog_items."
              : "Failed to save SKU to catalog_items.",
        });
        return;
      }

      resetForm();
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم حفظ الكود (${cleanCode}) وتحديث الكتالوج المباشر.`
            : `Saved SKU (${cleanCode}) and synced live catalog.`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "خطأ في الاتصال أثناء حفظ الكود."
            : "Network error while saving SKU.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (sku: ErpAsaSkuItem) => {
    if (!accessToken) {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "سجل دخولك أولاً لتغيير حالة ظهور الكود."
            : "Sign in as admin to toggle SKU visibility.",
      });
      return;
    }
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/catalog_items?code=eq.${encodeURIComponent(sku.code)}`,
        {
          method: "PATCH",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            is_active: !sku.inStock,
            updated_at: new Date().toISOString(),
          }),
        }
      );
      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر تحديث حالة الكود في قاعدة البيانات."
              : "Failed to update SKU active state.",
        });
        return;
      }
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم ${!sku.inStock ? "إظهار" : "إخفاء"} الكود (${sku.code}).`
            : `${!sku.inStock ? "Activated" : "Hidden"} SKU (${sku.code}).`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "تعذر الاتصال بـ Supabase."
            : "Network error toggling SKU.",
      });
    }
  };

  const handleDeleteSku = async (code: string) => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/catalog_items?code=eq.${encodeURIComponent(code)}`,
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
              ? "تعذر حذف الكود من قاعدة البيانات."
              : "Failed to delete SKU from catalog_items.",
        });
        return;
      }
      setConfirmDeleteCode(null);
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم حذف الكود (${code}) نهائياً.`
            : `Deleted SKU (${code}) permanently.`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "خطأ اتصال أثناء حذف الكود."
            : "Network error deleting SKU.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Add / Edit SKU Form */}
      <form
        onSubmit={handleSaveSku}
        className="lg:col-span-5 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-6 flex flex-col gap-4"
        style={{ boxShadow: "var(--shadow-subtle)" }}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-sand-border)] pb-2">
          <h3 className="text-lg font-bold text-[var(--color-navy)]">
            {locale === "ar"
              ? "إضافة أو تعديل كود لون (SKU)"
              : "Add or Edit ASA Catalog SKU"}
          </h3>
          {skuCode && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-[var(--color-crimson)] underline"
            >
              {locale === "ar" ? "تفريغ النموذج" : "Reset"}
            </button>
          )}
        </div>

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
              placeholder="ECRAL5012"
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
              {locale === "ar" ? "اسم اللون (عربي)" : "Color (AR)"}
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
              {locale === "ar" ? "اسم اللون (EN)" : "Color (EN)"}
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
              {locale === "ar" ? "الاسم (صيني)" : "Color (ZH)"}
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

        {/* Synchronized Visual Color Picker + HEX Text Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="sku-hex-input"
            className="text-xs font-semibold text-[var(--color-ink)]"
          >
            {locale === "ar"
              ? "اختيار درجة اللون (Color Picker / HEX)"
              : "Pick Shade Color (Color Picker / HEX)"}
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              aria-label={locale === "ar" ? "منتقي اللون" : "Color picker"}
              value={pickerHexValue}
              onChange={(e) =>
                setSkuHex(e.target.value.replace("#", "").toUpperCase())
              }
              className="w-12 h-11 p-1 rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] cursor-pointer shrink-0"
            />
            <input
              id="sku-hex-input"
              type="text"
              dir="ltr"
              value={skuHex}
              onChange={(e) => setSkuHex(e.target.value.replace("#", "").toUpperCase())}
              placeholder="0089B6"
              className="min-h-[44px] flex-1 rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        {/* Optional Custom Specimen Photo Upload */}
        <div className="flex flex-col gap-2 rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)]/60 p-3">
          <span className="text-xs font-semibold text-[var(--color-navy)]">
            {locale === "ar"
              ? "صورة عينة مخصصة للكود (اختياري)"
              : "Custom Specimen Image (Optional)"}
          </span>

          {skuImageUrl && (
            <div className="flex items-center gap-3">
              <img
                src={skuImageUrl}
                alt={skuCode || "SKU"}
                className="w-14 h-14 rounded-[var(--radius-xs)] object-cover border border-[var(--color-gold)]"
              />
              <button
                type="button"
                onClick={() => setSkuImageUrl("")}
                className="text-xs font-semibold text-[var(--color-crimson)] underline"
              >
                {locale === "ar" ? "إزالة الصورة المخصصة" : "Remove Custom Photo"}
              </button>
            </div>
          )}

          <label className="btn-action w-full bg-[var(--color-ivory)] text-[var(--color-navy)] border border-[var(--color-navy)] text-xs cursor-pointer">
            <span>
              {isUploadingPhoto
                ? locale === "ar"
                  ? "جاري رفع الصورة..."
                  : "Uploading..."
                : locale === "ar"
                  ? "رفع صورة عينة لهذا الكود..."
                  : "Upload Specimen Photo..."}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploadingPhoto}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUploadSkuImage(file);
              }}
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--color-navy)] cursor-pointer min-h-[36px]">
          <input
            type="checkbox"
            checked={skuIsActive}
            onChange={(e) => setSkuIsActive(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-navy)]"
          />
          <span>
            {locale === "ar"
              ? "إظهار هذا الكود للعملاء في الكتالوج المباشر"
              : "Visible to customers in public catalog"}
          </span>
        </label>

        <button
          type="submit"
          disabled={isSaving || isUploadingPhoto}
          className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] text-sm disabled:opacity-50"
        >
          {isSaving
            ? locale === "ar"
              ? "جاري الحفظ..."
              : "Saving..."
            : locale === "ar"
              ? "حفظ الكود في الكتالوج المباشر"
              : "Save SKU to Live Catalog"}
        </button>
      </form>

      {/* Right Column: Filterable & Interactive SKUs Ledger */}
      <div className="lg:col-span-7 rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden">
        <div className="p-4 sm:p-5 bg-[var(--color-sand)] border-b border-[var(--color-sand-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[var(--color-navy)]">
            {locale === "ar"
              ? `أكواد الألوان المعتمدة (${filteredSkus.length} من ${skus.length})`
              : `Certified Color SKUs (${filteredSkus.length} of ${skus.length})`}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label={locale === "ar" ? "تصفية بالحالة" : "Filter status"}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "hidden")
              }
              className="min-h-[40px] rounded-[var(--radius-xs)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-2.5 text-xs font-semibold"
            >
              <option value="all">{locale === "ar" ? "كل الأكواد" : "All SKUs"}</option>
              <option value="active">{locale === "ar" ? "المفعّلة" : "Active"}</option>
              <option value="hidden">{locale === "ar" ? "المخفية" : "Hidden"}</option>
            </select>

            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={locale === "ar" ? "بحث بالكود أو الاسم..." : "Search SKU..."}
              className="min-h-[40px] w-44 rounded-[var(--radius-xs)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-2.5 text-xs"
            />
          </div>
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
                  {locale === "ar" ? "الاسم والحالة" : "Name & State"}
                </th>
                <th className="p-3 text-start">
                  {locale === "ar" ? "إجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSkus.map((s, idx) => (
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
                      className="w-6 h-6 rounded-[var(--radius-xs)] border border-[var(--color-gold)] inline-block align-middle"
                      style={{ backgroundColor: s.colorToken }}
                    />
                  </td>
                  <td
                    dir="ltr"
                    className="p-3 font-mono font-bold text-[var(--color-navy)] border-t border-[var(--color-sand-border)]"
                  >
                    <div>{s.code}</div>
                    <span className="text-[11px] font-sans font-semibold text-[var(--color-crimson)]">
                      {s.category}
                    </span>
                  </td>
                  <td className="p-3 border-t border-[var(--color-sand-border)]">
                    <div className="font-semibold text-[var(--color-ink)]">
                      {locale === "ar" ? s.colorAr : s.colorEn}
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleToggleActive(s)}
                      className={`mt-1 px-2 py-0.5 rounded-[var(--radius-xs)] text-[11px] font-bold border ${
                        s.inStock
                          ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]"
                          : "bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]"
                      }`}
                    >
                      {s.inStock
                        ? locale === "ar"
                          ? "متاح (اضغط للإخفاء)"
                          : "Active (Click to hide)"
                        : locale === "ar"
                          ? "مخفي (اضغط للتفعيل)"
                          : "Hidden (Click to show)"}
                    </button>
                  </td>
                  <td className="p-3 border-t border-[var(--color-sand-border)]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSkuItemNo(s.itemNo);
                          setSkuCode(s.code);
                          setSkuCategorySlug(s.categorySlug);
                          setSkuColorAr(s.colorAr);
                          setSkuColorEn(s.colorEn);
                          setSkuColorZh(s.colorZh);
                          setSkuHex((s.hexColor || "0089B6").replace("#", ""));
                          setSkuImageUrl(
                            s.specimenImage.startsWith("http")
                              ? s.specimenImage
                              : ""
                          );
                          setSkuIsActive(s.inStock);
                        }}
                        className="min-h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] border border-[var(--color-navy)] bg-[var(--color-sand)] text-xs font-semibold text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)]"
                      >
                        {locale === "ar" ? "تعديل" : "Load"}
                      </button>

                      {confirmDeleteCode === s.code ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleDeleteSku(s.code)}
                            className="min-h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-crimson)] text-[var(--color-on-navy)] text-xs font-bold"
                          >
                            {locale === "ar" ? "تأكيد" : "Yes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCode(null)}
                            className="min-h-[34px] px-2 py-1 rounded-[var(--radius-xs)] border border-[var(--color-sand-border)] text-xs"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteCode(s.code)}
                          className="min-h-[34px] px-2 py-1 rounded-[var(--radius-xs)] border border-[var(--color-error-border)] text-[var(--color-error)] text-xs font-semibold hover:bg-[var(--color-error-bg)]"
                        >
                          {locale === "ar" ? "حذف" : "Del"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
