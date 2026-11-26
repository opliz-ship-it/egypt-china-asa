import {
  DEFAULT_ERP_CATEGORIES,
  DEFAULT_SITE_MEDIA,
  EDITORIAL_SLOTS,
  ERP_ASA_FILM_SKUS,
  type EditorialSlotItem,
  type ErpAsaSkuItem,
  type ErpCategoryOption,
} from "@/data/catalog";

export const SUPABASE_URL = "https://sahckfcxcdodjqvhdfdu.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_C9SePG4nsQ_tBEzIXIExBQ_4gndQaPF";
export const SUPABASE_STORAGE_BUCKET = "asa-media";
export const ADMIN_SESSION_STORAGE_KEY = "asa_admin_session_v1";
export const MAX_MEDIA_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MEDIA_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type InquiryStatusValue = "new" | "reviewed" | "sent";

export interface SupabaseCatalogItemRow {
  id: number | string;
  sort_order?: number | null;
  item_no?: number | null;
  code: string;
  item_group?: string | null;
  category?: string | null;
  category_slug?: string | null;
  color_en: string;
  color_ar: string;
  color_zh?: string | null;
  hex_color: string;
  finish_note?: string | null;
  image_url?: string | null;
  is_active?: boolean | null;
  in_stock?: boolean | null;
}

export interface SupabaseCategoryRow {
  id?: string;
  slug: string;
  name_ar: string;
  name_en: string;
  name_zh?: string | null;
  sort_order: number;
  is_active?: boolean | null;
}

export interface SupabaseMediaRow {
  slot_key: string;
  title_ar: string;
  caption_ar?: string | null;
  alt_ar?: string | null;
  image_url: string;
  updated_at?: string | null;
}

export interface SupabaseSettingKeyValueRow {
  setting_key: string;
  setting_value: string;
  updated_at?: string | null;
}

export interface SupabaseSettingsRow {
  company_name_ar: string;
  company_name_en: string;
  company_name_zh: string;
  tagline_en?: string;
  phone: string;
  whatsapp_number?: string | null;
  email: string;
  location_ar: string;
  location_en: string;
  facebook_url?: string | null;
  tiktok_url?: string | null;
  instagram_url?: string | null;
  video_url?: string | null;
  established_year?: string | null;
  plant_capacity?: string | null;
  doc_catalog_ar?: string | null;
  doc_catalog_en?: string | null;
  doc_brochure_ar?: string | null;
  doc_brochure_en?: string | null;
  doc_tds_ar?: string | null;
  doc_tds_en?: string | null;
  editorial_posts_json?: string | null;
}

export interface SupabaseInquiryRow {
  id?: number | string;
  company_name: string;
  contact_name: string;
  phone: string;
  requested_codes?: string | null;
  notes?: string | null;
  status?: InquiryStatusValue | string | null;
  created_at?: string;
}

export interface AdminSessionData {
  accessToken: string;
  refreshToken: string;
  email: string;
  expiresAt: number;
}

export interface AdminCatalogBundle {
  skus: ErpAsaSkuItem[];
  categories: ErpCategoryOption[];
  media: Record<string, string>;
  mediaRows: SupabaseMediaRow[];
  settings: SupabaseSettingsRow | null;
  inquiries: SupabaseInquiryRow[];
  editorialPosts: EditorialSlotItem[];
}

export const KNOWN_SKU_HEX_MAP: Record<string, string> = {
  ECCMG96279: "1E824C",
  ECCMA45050: "F3F4F6",
  ECCMO98501: "EAB308",
  ECRAL5012: "0089B6",
  ECCMB97508: "0F3B5F",
  ECCMO96398: "A6191E",
  ECCMA96681: "43474D",
  ECCMO96375: "C2410C",
  ECRAL7045: "8D949A",
  ECRAL1014: "DFCEA1",
  ECRAL6019: "B7D9B1",
  ECCMO96275: "EA580C",
  ECRAL9016: "F7F8F6",
};

const KNOWN_SKU_TOKEN_MAP: Record<string, string> = {
  ECCMG96279: "var(--sku-eccmg96279)",
  ECCMA45050: "var(--sku-eccma45050)",
  ECCMO98501: "var(--sku-eccmo98501)",
  ECRAL5012: "var(--sku-ecral5012)",
  ECCMB97508: "var(--sku-eccmb97508)",
  ECCMO96398: "var(--sku-eccmo96398)",
  ECCMA96681: "var(--sku-eccma96681)",
  ECCMO96375: "var(--sku-eccmo96375)",
  ECRAL7045: "var(--sku-ecral7045)",
  ECRAL1014: "var(--sku-ecral1014)",
  ECRAL6019: "var(--sku-ecral6019)",
  ECCMO96275: "var(--sku-eccmo96275)",
  ECRAL9016: "var(--sku-ecral9016)",
};

export function buildRestHeaders(accessToken?: string): Record<string, string> {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${accessToken ?? SUPABASE_PUBLISHABLE_KEY}`,
    "Content-Type": "application/json",
  };
}

/** Normalize raw phone string into international digits accepted by WhatsApp wa.me links. */
export function normalizeWhatsAppPhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.startsWith("00") && digits.length > 6) {
    return digits.slice(2);
  }
  if (/^01\d{9}$/.test(digits)) {
    return `2${digits}`;
  }
  return digits;
}

/** Build a safe WhatsApp deep link with optional prefilled inquiry/reply copy. */
export function buildWhatsAppHref(rawPhone: string, message?: string): string {
  const normalized = normalizeWhatsAppPhone(rawPhone);
  const base =
    normalized.length >= 9 ? `https://wa.me/${normalized}` : "https://wa.me/";
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Validate http(s) URL strings safely without allowing javascript: payloads. */
export function isValidHttpUrl(val?: string | null): boolean {
  if (!val) return false;
  const trimmed = val.trim();
  return trimmed.startsWith("https://") || trimmed.startsWith("http://");
}

/** Validate URLs usable as website images or document assets (http/https or /assets/). */
export function isValidAssetUrl(val?: string | null): boolean {
  if (!val) return false;
  const trimmed = val.trim();
  return isValidHttpUrl(trimmed) || trimmed.startsWith("/assets/");
}

/** Parse YouTube/direct-MP4 URLs into a safe video descriptor for the factory modal. */
export function resolveFactoryVideoSource(
  rawUrl?: string | null
): { kind: "youtube" | "video"; src: string } | null {
  if (!isValidHttpUrl(rawUrl)) return null;
  const trimmed = rawUrl!.trim();
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId && /^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
        return {
          kind: "youtube",
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return { kind: "youtube", src: trimmed };
      }
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "").trim();
      if (/^[A-Za-z0-9_-]{6,20}$/.test(id)) {
        return {
          kind: "youtube",
          src: `https://www.youtube.com/embed/${id}`,
        };
      }
    }
    return { kind: "video", src: trimmed };
  } catch {
    return null;
  }
}

export function normalizeHexColor(raw: string, fallback = "0089B6"): string {
  const cleaned = raw.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
  if (cleaned.length === 6) return cleaned;
  return fallback;
}

export function mapSupabaseRowToSku(row: SupabaseCatalogItemRow): ErpAsaSkuItem {
  const rawUpper = row.code.trim().toUpperCase();
  const normalizedCode = rawUpper.startsWith("EC") ? rawUpper : `EC${rawUpper}`;
  const existing = ERP_ASA_FILM_SKUS.find(
    (s) =>
      s.code.toUpperCase() === rawUpper ||
      s.code.toUpperCase() === normalizedCode
  );
  const defaultColorToken =
    KNOWN_SKU_TOKEN_MAP[rawUpper] ??
    KNOWN_SKU_TOKEN_MAP[normalizedCode] ??
    "var(--sku-ecral5012)";
  const defaultRealHex = existing ? undefined : row.hex_color;

  const normalizedDbHex = normalizeHexColor(row.hex_color || "", "");
  const knownDefaultHex =
    KNOWN_SKU_HEX_MAP[rawUpper] ?? KNOWN_SKU_HEX_MAP[normalizedCode];
  const resolvedHex = `#${normalizedDbHex || knownDefaultHex || "0089B6"}`;

  const isModifiedFromDefault =
    normalizedDbHex.length === 6 &&
    knownDefaultHex !== undefined &&
    knownDefaultHex !== normalizedDbHex;

  const resolvedColorToken =
    isModifiedFromDefault || defaultRealHex
      ? resolvedHex
      : (existing?.colorToken ?? defaultColorToken);

  const groupLabel = (row.item_group || row.category || "").trim();
  const isBottom =
    row.category_slug === "asa-film-bottom" ||
    row.category_slug === "bottom" ||
    groupLabel.toLowerCase().includes("bottom");

  const resolvedCategory =
    groupLabel || (isBottom ? "ASA Film (Bottom)" : "ASA Film (Top)");

  const customImage = isValidAssetUrl(row.image_url)
    ? row.image_url!.trim()
    : null;

  return {
    id: String(row.id || existing?.id || `sku-${normalizedCode}`),
    itemNo: row.sort_order ?? row.item_no ?? existing?.itemNo ?? 99,
    code: row.code,
    category: resolvedCategory,
    categorySlug:
      row.category_slug || (isBottom ? "asa-film-bottom" : "asa-film-top"),
    colorEn: row.color_en || existing?.colorEn || row.code,
    colorAr: row.color_ar || existing?.colorAr || row.color_en,
    colorZh: row.color_zh || existing?.colorZh || row.color_en,
    colorToken: resolvedColorToken,
    hexColor: resolvedHex,
    specimenImage:
      customImage ??
      existing?.specimenImage ??
      "/assets/opt/asa-red-sheet.webp",
    finish: existing?.finish ?? {
      ar: isBottom
        ? "طبقة تبطين سفلية متجانسة عالية الالتصاق الحراري"
        : "طبقة حماية خارجية مقاومة للأشعة فوق البنفسجية والعوامل الجوية",
      en: isBottom
        ? "Uniform Thermal-Bonding Backing Layer"
        : "UV-Stabilized Weather-Shield Exterior Capstock",
    },
    solar: existing?.solar ?? {
      ar: "ثبات لوني معتمد ΔE < 1.5 بعد 3000 ساعة QUV (ASTM G154)",
      en: "3000h QUV Verified (ASTM G154), Color Shift ΔE < 1.5",
    },
    substrate: existing?.substrate ?? {
      ar: "ألواح الأسقف المموجة وقطاعات UPVC و PVC",
      en: "Corrugated UPVC & PVC Roofing Panels and Profiles",
    },
    description: existing?.description ?? {
      ar: `صنف ${resolvedCategory} معتمد بكود (${row.code}) ودرجة لون ${row.color_ar} للتغليف الحراري والبثق المشترك في مصنع مدينة السادات.`,
      en: `Certified ${resolvedCategory} grade (Code ${row.code}, ${row.color_en}) engineered for inline thermal lamination and co-extrusion in Sadat City.`,
    },
    inStock: row.is_active ?? row.in_stock ?? true,
  };
}

function mapSettingRowsToObject(
  rows: SupabaseSettingKeyValueRow[]
): SupabaseSettingsRow {
  const map = new Map<string, string>();
  for (const r of rows) {
    if (r.setting_key) {
      map.set(r.setting_key, r.setting_value ?? "");
    }
  }
  return {
    company_name_ar: map.get("company_ar") ?? "المصرية الصينية لإنتاج (ASA)",
    company_name_en: map.get("company_en") ?? "EGYPT CHINA FOR ASA",
    company_name_zh: map.get("company_zh") ?? "中埃ASA板材公司",
    tagline_en: map.get("tagline_en") ?? "QUALITY PANELS : STRONGER FUTURES",
    phone: map.get("phone_ar") ?? "",
    whatsapp_number: map.get("whatsapp_number") ?? "",
    email: map.get("email") ?? "",
    location_ar: map.get("address_ar") ?? "",
    location_en: map.get("address_en") ?? "",
    facebook_url: map.get("facebook_url") ?? "",
    tiktok_url: map.get("tiktok_url") ?? "",
    instagram_url: map.get("instagram_url") ?? "",
    video_url: map.get("video_url") ?? "",
    established_year: map.get("established_year") ?? "",
    plant_capacity: map.get("plant_capacity") ?? "",
    doc_catalog_ar: map.get("doc_catalog_ar") ?? "",
    doc_catalog_en: map.get("doc_catalog_en") ?? "",
    doc_brochure_ar: map.get("doc_brochure_ar") ?? "",
    doc_brochure_en: map.get("doc_brochure_en") ?? "",
    doc_tds_ar: map.get("doc_tds_ar") ?? "",
    doc_tds_en: map.get("doc_tds_en") ?? "",
    editorial_posts_json: map.get("editorial_posts_json") ?? "",
  };
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asLocalizedPair(
  v: unknown,
  fallback: { ar: string; en: string }
): { ar: string; en: string } {
  if (typeof v !== "object" || v === null) return fallback;
  const obj = v as Record<string, unknown>;
  return {
    ar: asString(obj.ar, fallback.ar),
    en: asString(obj.en, fallback.en),
  };
}

/** Validate and merge custom editorial posts from site_settings with static defaults. */
export function resolveEditorialPosts(
  rawJson?: string | null
): EditorialSlotItem[] {
  if (!rawJson || !rawJson.trim()) return EDITORIAL_SLOTS;
  try {
    const parsed: unknown = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) return EDITORIAL_SLOTS;
    const customItems: EditorialSlotItem[] = [];
    for (const entry of parsed) {
      if (typeof entry !== "object" || entry === null) continue;
      const r = entry as Record<string, unknown>;
      const slug = asString(r.slug).trim();
      const postType = r.type === "case" ? "case" : r.type === "news" ? "news" : null;
      if (!slug || !postType) continue;
      const bodyRaw =
        typeof r.bodyParagraphs === "object" && r.bodyParagraphs !== null
          ? (r.bodyParagraphs as Record<string, unknown>)
          : {};
      const bodyAr = Array.isArray(bodyRaw.ar)
        ? bodyRaw.ar.filter((x): x is string => typeof x === "string")
        : [];
      const bodyEn = Array.isArray(bodyRaw.en)
        ? bodyRaw.en.filter((x): x is string => typeof x === "string")
        : [];
      const specsRaw = Array.isArray(r.technicalSpecs) ? r.technicalSpecs : [];
      const specs: Array<{ label: { ar: string; en: string }; value: { ar: string; en: string } }> = [];
      for (const sp of specsRaw) {
        if (typeof sp !== "object" || sp === null) continue;
        const sObj = sp as Record<string, unknown>;
        specs.push({
          label: asLocalizedPair(sObj.label, { ar: "", en: "" }),
          value: asLocalizedPair(sObj.value, { ar: "", en: "" }),
        });
      }
      const imageCandidate = asString(r.image, "/assets/opt/factory-facade.webp");
      customItems.push({
        slug,
        slotCode: asString(r.slotCode, "[CMS_POST]"),
        type: postType,
        categoryLabel: asLocalizedPair(r.categoryLabel, {
          ar: "تحديثات المصنع",
          en: "Factory Update",
        }),
        statusBadge: asLocalizedPair(r.statusBadge, {
          ar: "منشور من لوحة التحكم",
          en: "Published",
        }),
        title: asLocalizedPair(r.title, { ar: slug, en: slug }),
        summary: asLocalizedPair(r.summary, { ar: "", en: "" }),
        bodyParagraphs: {
          ar: bodyAr.length > 0 ? bodyAr : [asString((r.summary as Record<string, unknown> | undefined)?.ar, "")],
          en: bodyEn.length > 0 ? bodyEn : [asString((r.summary as Record<string, unknown> | undefined)?.en, "")],
        },
        technicalSpecs: specs,
        image: isValidAssetUrl(imageCandidate)
          ? imageCandidate
          : "/assets/opt/factory-facade.webp",
        imageAlt: asLocalizedPair(r.imageAlt, {
          ar: "شركة مصر الصين لإنتاج ASA",
          en: "EGYPT CHINA FOR ASA",
        }),
      });
    }
    if (customItems.length === 0) return EDITORIAL_SLOTS;
    const customSlugs = new Set(customItems.map((c) => c.slug));
    return [
      ...customItems,
      ...EDITORIAL_SLOTS.filter((d) => !customSlugs.has(d.slug)),
    ];
  } catch {
    return EDITORIAL_SLOTS;
  }
}

export async function fetchLiveSupabaseCatalog(): Promise<{
  skus: ErpAsaSkuItem[];
  categories: ErpCategoryOption[];
  media: Record<string, string>;
  settings: SupabaseSettingsRow | null;
  mediaRows: SupabaseMediaRow[];
  editorialPosts: EditorialSlotItem[];
}> {
  const headers = buildRestHeaders();
  try {
    const [itemsRes, catsRes, mediaRes, settingsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/catalog_items?select=*&order=sort_order.asc`, {
        headers,
        cache: "no-store",
      }),
      fetch(
        `${SUPABASE_URL}/rest/v1/product_categories?select=*&order=sort_order.asc`,
        {
          headers,
          cache: "no-store",
        }
      ),
      fetch(`${SUPABASE_URL}/rest/v1/site_media?select=*&order=slot_key.asc`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, {
        headers,
        cache: "no-store",
      }),
    ]);

    let skus = ERP_ASA_FILM_SKUS;
    if (itemsRes.ok) {
      const rows = (await itemsRes.json()) as SupabaseCatalogItemRow[];
      if (Array.isArray(rows) && rows.length > 0) {
        skus = rows.map(mapSupabaseRowToSku);
      }
    }

    let categories = DEFAULT_ERP_CATEGORIES;
    if (catsRes.ok) {
      const catRows = (await catsRes.json()) as SupabaseCategoryRow[];
      if (Array.isArray(catRows) && catRows.length > 0) {
        categories = catRows.map((c) => ({
          slug: c.slug,
          nameAr: c.name_ar,
          nameEn: c.name_en,
          nameZh: c.name_zh ?? c.name_en,
          sortOrder: c.sort_order ?? 1,
          isActive: c.is_active ?? true,
        }));
      }
    }

    const media: Record<string, string> = { ...DEFAULT_SITE_MEDIA };
    let mediaRows: SupabaseMediaRow[] = [];
    if (mediaRes.ok) {
      const mRows = (await mediaRes.json()) as SupabaseMediaRow[];
      if (Array.isArray(mRows)) {
        mediaRows = mRows;
        for (const m of mRows) {
          if (m.slot_key && isValidHttpUrl(m.image_url)) {
            media[m.slot_key] = m.image_url.trim();
          }
        }
      }
    }

    let settings: SupabaseSettingsRow | null = null;
    if (settingsRes.ok) {
      const sRows = (await settingsRes.json()) as SupabaseSettingKeyValueRow[];
      if (Array.isArray(sRows) && sRows.length > 0) {
        settings = mapSettingRowsToObject(sRows);
      }
    }

    const editorialPosts = resolveEditorialPosts(settings?.editorial_posts_json);
    return { skus, categories, media, settings, mediaRows, editorialPosts };
  } catch {
    return {
      skus: ERP_ASA_FILM_SKUS,
      categories: DEFAULT_ERP_CATEGORIES,
      media: { ...DEFAULT_SITE_MEDIA },
      settings: null,
      mediaRows: [],
      editorialPosts: EDITORIAL_SLOTS,
    };
  }
}

/** Verify signed-in token belongs to a row in public.admin_users. */
export async function verifySupabaseAdminMembership(
  accessToken: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_users?select=id&limit=1`,
      {
        headers: buildRestHeaders(accessToken),
        cache: "no-store",
      }
    );
    if (!res.ok) return false;
    const rows = (await res.json()) as Array<{ id?: string }>;
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

/** Authenticate an admin user via Supabase password grant and verify admin_users membership. */
export async function signInSupabaseAdmin(
  identifier: string,
  password: string
): Promise<{ session: AdminSessionData | null; errorCode: string | null }> {
  const trimmedIdentifier = identifier.trim();
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
          password,
        }),
      }
    );
    const data = (await res.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      user?: { email?: string };
      error_description?: string;
      msg?: string;
    };
    if (!res.ok || !data.access_token) {
      return {
        session: null,
        errorCode: data.error_description || data.msg || "auth_failed",
      };
    }

    const isAdmin = await verifySupabaseAdminMembership(data.access_token);
    if (!isAdmin) {
      return { session: null, errorCode: "not_in_admin_users" };
    }

    const expiresInMs = (data.expires_in ?? 3600) * 1000;
    return {
      session: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? "",
        email: data.user?.email ?? resolvedAuthEmail,
        expiresAt: Date.now() + expiresInMs,
      },
      errorCode: null,
    };
  } catch {
    return { session: null, errorCode: "network_error" };
  }
}

/** Refresh an existing Supabase session token when nearing expiration. */
export async function refreshSupabaseSession(
  refreshToken: string
): Promise<AdminSessionData | null> {
  if (!refreshToken) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      user?: { email?: string };
    };
    if (!data.access_token) return null;
    const isAdmin = await verifySupabaseAdminMembership(data.access_token);
    if (!isAdmin) return null;
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      email: data.user?.email ?? "admin",
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    };
  } catch {
    return null;
  }
}

/** Fetch all catalog, category, media, settings, and inquiry rows with admin JWT (including hidden rows). */
export async function fetchAdminCatalogBundle(
  accessToken: string
): Promise<AdminCatalogBundle | null> {
  const headers = buildRestHeaders(accessToken);
  try {
    const [itemsRes, catsRes, mediaRes, settingsRes, inqRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/catalog_items?select=*&order=sort_order.asc`, {
        headers,
        cache: "no-store",
      }),
      fetch(
        `${SUPABASE_URL}/rest/v1/product_categories?select=*&order=sort_order.asc`,
        {
          headers,
          cache: "no-store",
        }
      ),
      fetch(`${SUPABASE_URL}/rest/v1/site_media?select=*&order=slot_key.asc`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, {
        headers,
        cache: "no-store",
      }),
      fetch(
        `${SUPABASE_URL}/rest/v1/sample_inquiries?select=*&order=created_at.desc&limit=100`,
        {
          headers,
          cache: "no-store",
        }
      ),
    ]);

    let skus = ERP_ASA_FILM_SKUS;
    if (itemsRes.ok) {
      const rows = (await itemsRes.json()) as SupabaseCatalogItemRow[];
      if (Array.isArray(rows) && rows.length > 0) {
        skus = rows.map(mapSupabaseRowToSku);
      }
    }

    let categories = DEFAULT_ERP_CATEGORIES;
    if (catsRes.ok) {
      const catRows = (await catsRes.json()) as SupabaseCategoryRow[];
      if (Array.isArray(catRows) && catRows.length > 0) {
        categories = catRows.map((c) => ({
          slug: c.slug,
          nameAr: c.name_ar,
          nameEn: c.name_en,
          nameZh: c.name_zh ?? c.name_en,
          sortOrder: c.sort_order ?? 1,
          isActive: c.is_active ?? true,
        }));
      }
    }

    const media: Record<string, string> = { ...DEFAULT_SITE_MEDIA };
    let mediaRows: SupabaseMediaRow[] = [];
    if (mediaRes.ok) {
      const mRows = (await mediaRes.json()) as SupabaseMediaRow[];
      if (Array.isArray(mRows)) {
        mediaRows = mRows;
        for (const m of mRows) {
          if (m.slot_key && isValidHttpUrl(m.image_url)) {
            media[m.slot_key] = m.image_url.trim();
          }
        }
      }
    }

    let settings: SupabaseSettingsRow | null = null;
    if (settingsRes.ok) {
      const sRows = (await settingsRes.json()) as SupabaseSettingKeyValueRow[];
      if (Array.isArray(sRows) && sRows.length > 0) {
        settings = mapSettingRowsToObject(sRows);
      }
    }

    let inquiries: SupabaseInquiryRow[] = [];
    if (inqRes.ok) {
      const rows = (await inqRes.json()) as SupabaseInquiryRow[];
      if (Array.isArray(rows)) {
        inquiries = rows;
      }
    }

    const editorialPosts = resolveEditorialPosts(settings?.editorial_posts_json);
    return {
      skus,
      categories,
      media,
      mediaRows,
      settings,
      inquiries,
      editorialPosts,
    };
  } catch {
    return null;
  }
}

/** Upload a validated JPG/PNG/WebP image under 5 MB into Supabase Storage asa-media bucket. */
export async function uploadImageToAsaMedia(
  folderPrefix: string,
  slotKey: string,
  file: File,
  accessToken: string
): Promise<{ ok: boolean; publicUrl?: string; errorCode?: "invalid_type" | "too_large" | "upload_failed" }> {
  const mime = (file.type || "").toLowerCase();
  if (!ALLOWED_MEDIA_MIME_TYPES.has(mime)) {
    return { ok: false, errorCode: "invalid_type" };
  }
  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    return { ok: false, errorCode: "too_large" };
  }

  const ext =
    mime === "image/png" ? "png" : mime === "image/jpeg" ? "jpg" : "webp";
  const safeSlug = slotKey.replace(/[^a-zA-Z0-9_-]/g, "-");
  const objectPath = `${folderPrefix}/${safeSlug}-${Date.now()}.${ext}`;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${SUPABASE_STORAGE_BUCKET}/${objectPath}`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": mime,
          "x-upsert": "true",
        },
        body: file,
      }
    );
    if (!res.ok) {
      return { ok: false, errorCode: "upload_failed" };
    }
    return {
      ok: true,
      publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${objectPath}`,
    };
  } catch {
    return { ok: false, errorCode: "upload_failed" };
  }
}

export async function insertSupabaseSampleInquiry(
  payload: SupabaseInquiryRow
): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sample_inquiries`, {
      method: "POST",
      headers: {
        ...buildRestHeaders(),
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
