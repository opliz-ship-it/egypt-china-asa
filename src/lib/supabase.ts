import {
  DEFAULT_ERP_CATEGORIES,
  DEFAULT_SITE_MEDIA,
  ERP_ASA_FILM_SKUS,
  type ErpAsaSkuItem,
  type ErpCategoryOption,
} from "@/data/catalog";

export const SUPABASE_URL = "https://sahckfcxcdodjqvhdfdu.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_C9SePG4nsQ_tBEzIXIExBQ_4gndQaPF";
export const SUPABASE_STORAGE_BUCKET = "asa-media";

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
}

export interface SupabaseInquiryRow {
  id?: number | string;
  company_name: string;
  contact_name: string;
  phone: string;
  requested_codes?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string;
}

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

export function mapSupabaseRowToSku(row: SupabaseCatalogItemRow): ErpAsaSkuItem {
  const rawUpper = row.code.trim().toUpperCase();
  const normalizedCode = rawUpper.startsWith("EC") ? rawUpper : `EC${rawUpper}`;
  const existing = ERP_ASA_FILM_SKUS.find(
    (s) => s.code.toUpperCase() === rawUpper || s.code.toUpperCase() === normalizedCode
  );
  const defaultColorToken =
    KNOWN_SKU_TOKEN_MAP[rawUpper] ??
    KNOWN_SKU_TOKEN_MAP[normalizedCode] ??
    "var(--sku-ecral5012)";
  const defaultRealHex = existing ? undefined : row.hex_color;

  const defaultHexForKnown: Record<string, string> = {
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

  const normalizedDbHex = (row.hex_color || "")
    .replace(/[^0-9a-fA-F]/g, "")
    .toUpperCase();
  const knownDefaultHex =
    defaultHexForKnown[rawUpper] ?? defaultHexForKnown[normalizedCode];
  const isModifiedFromDefault =
    normalizedDbHex.length === 6 &&
    knownDefaultHex !== undefined &&
    knownDefaultHex !== normalizedDbHex;

  const resolvedColorToken =
    isModifiedFromDefault || defaultRealHex
      ? row.hex_color
      : existing?.colorToken ?? defaultColorToken;

  const groupLabel = (row.item_group || row.category || "").trim();
  const isBottom =
    row.category_slug === "asa-film-bottom" ||
    row.category_slug === "bottom" ||
    groupLabel.toLowerCase().includes("bottom");

  const resolvedCategory =
    groupLabel || (isBottom ? "ASA Film (Bottom)" : "ASA Film (Top)");

  return {
    id: String(row.id || existing?.id || `sku-${normalizedCode}`),
    itemNo: row.sort_order ?? row.item_no ?? existing?.itemNo ?? 99,
    code: row.code,
    category: resolvedCategory,
    categorySlug:
      row.category_slug ||
      (isBottom ? "asa-film-bottom" : "asa-film-top"),
    colorEn: row.color_en || existing?.colorEn || row.code,
    colorAr: row.color_ar || existing?.colorAr || row.color_en,
    colorZh: row.color_zh || existing?.colorZh || row.color_en,
    colorToken: resolvedColorToken,
    specimenImage:
      existing?.specimenImage ?? "/assets/opt/asa-red-sheet.webp",
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
  };
}

export async function fetchLiveSupabaseCatalog(): Promise<{
  skus: ErpAsaSkuItem[];
  categories: ErpCategoryOption[];
  media: Record<string, string>;
  settings: SupabaseSettingsRow | null;
  mediaRows: SupabaseMediaRow[];
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
          if (
            m.slot_key &&
            m.image_url &&
            (m.image_url.startsWith("http://") ||
              m.image_url.startsWith("https://"))
          ) {
            media[m.slot_key] = m.image_url;
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

    return { skus, categories, media, settings, mediaRows };
  } catch {
    return {
      skus: ERP_ASA_FILM_SKUS,
      categories: DEFAULT_ERP_CATEGORIES,
      media: { ...DEFAULT_SITE_MEDIA },
      settings: null,
      mediaRows: [],
    };
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
