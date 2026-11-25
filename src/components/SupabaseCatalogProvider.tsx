"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_ERP_CATEGORIES,
  DEFAULT_SITE_MEDIA,
  ERP_ASA_FILM_SKUS,
  type ErpAsaSkuItem,
  type ErpCategoryOption,
} from "@/data/catalog";
import {
  fetchLiveSupabaseCatalog,
  type SupabaseMediaRow,
  type SupabaseSettingsRow,
} from "@/lib/supabase";
import type { Locale } from "@/i18n/config";

interface SupabaseCatalogContextValue {
  skus: ErpAsaSkuItem[];
  categories: ErpCategoryOption[];
  media: Record<string, string>;
  mediaRows: SupabaseMediaRow[];
  settings: SupabaseSettingsRow | null;
  isSynced: boolean;
  selectedSkus: string[];
  toggleSku: (code: string) => void;
  addSku: (code: string) => void;
  removeSku: (code: string) => void;
  clearSkus: () => void;
  buildWhatsAppUrl: (locale: Locale, codesOverride?: string[]) => string;
  sendSkusToInquiryForm: (codesOverride?: string[]) => void;
  refreshCatalog: () => Promise<void>;
}

const SupabaseCatalogContext = createContext<SupabaseCatalogContextValue>({
  skus: ERP_ASA_FILM_SKUS,
  categories: DEFAULT_ERP_CATEGORIES,
  media: DEFAULT_SITE_MEDIA,
  mediaRows: [],
  settings: null,
  isSynced: false,
  selectedSkus: ["ECRAL5012"],
  toggleSku: () => {},
  addSku: () => {},
  removeSku: () => {},
  clearSkus: () => {},
  buildWhatsAppUrl: () => "https://wa.me/",
  sendSkusToInquiryForm: () => {},
  refreshCatalog: async () => {},
});

const STORAGE_KEY = "asa_selected_skus_v3";
const LEGACY_CODES = new Set([
  "CMG96279", "CMA45050", "CMO98501", "RAL5012", "CMB97508",
  "CMO96398", "CMA96681", "CMO96375", "RAL7045", "RAL1014",
  "RAL6019", "CMO96275", "RAL9016",
]);

export function SupabaseCatalogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [skus, setSkus] = useState<ErpAsaSkuItem[]>(ERP_ASA_FILM_SKUS);
  const [categories, setCategories] = useState<ErpCategoryOption[]>(
    DEFAULT_ERP_CATEGORIES
  );
  const [media, setMedia] = useState<Record<string, string>>(DEFAULT_SITE_MEDIA);
  const [mediaRows, setMediaRows] = useState<SupabaseMediaRow[]>([]);
  const [settings, setSettings] = useState<SupabaseSettingsRow | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const [selectedSkus, setSelectedSkus] = useState<string[]>(["ECRAL5012"]);

  const refreshCatalog = useCallback(async () => {
    const live = await fetchLiveSupabaseCatalog();
    setSkus(live.skus);
    setCategories(live.categories);
    setMedia(live.media);
    setMediaRows(live.mediaRows);
    setSettings(live.settings);
    setIsSynced(true);
  }, []);

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(STORAGE_KEY) ??
        window.localStorage.getItem("asa_selected_skus_v2");
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((item) => typeof item === "string")
        ) {
          const upgraded = parsed.map((c) => {
            const up = c.trim().toUpperCase();
            return LEGACY_CODES.has(up) ? `EC${up}` : c;
          });
          setSelectedSkus(upgraded);
        }
      }
    } catch {
      // ignore localStorage read restrictions
    }
    void refreshCatalog();
  }, [refreshCatalog]);

  const persistSelected = useCallback((next: string[]) => {
    setSelectedSkus(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore localStorage write restrictions
    }
  }, []);

  const toggleSku = useCallback(
    (code: string) => {
      setSelectedSkus((prev) => {
        const exists = prev.includes(code);
        const next = exists ? prev.filter((c) => c !== code) : [...prev, code];
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const addSku = useCallback((code: string) => {
    setSelectedSkus((prev) => {
      if (prev.includes(code)) return prev;
      const next = [...prev, code];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const removeSku = useCallback((code: string) => {
    setSelectedSkus((prev) => {
      const next = prev.filter((c) => c !== code);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearSkus = useCallback(() => {
    persistSelected([]);
  }, [persistSelected]);

  const buildWhatsAppUrl = useCallback(
    (locale: Locale, codesOverride?: string[]) => {
      const codes =
        codesOverride && codesOverride.length > 0
          ? codesOverride
          : selectedSkus.length > 0
            ? selectedSkus
            : ["ECRAL5012"];

      const detailedLines = codes.map((code) => {
        const found = skus.find((s) => s.code === code);
        if (!found) return `* ${code}`;
        return locale === "ar"
          ? `* ${found.code} (${found.colorAr} : ${found.category})`
          : `* ${found.code} (${found.colorEn} : ${found.category})`;
      });

      const text =
        locale === "ar"
          ? `مرحباً شركة مصر الصين لإنتاج (ASA)،\nأرغب في طلب طقم عينات وعرض سعر للأكواد التالية من الكتالوج:\n${detailedLines.join("\n")}\nيرجى إفادتنا بالمواصفات الفنية وتفاصيل التوريد من مصنع مدينة السادات.`
          : `Hello EGYPT CHINA FOR ASA,\nI would like to request a sample kit and quotation for the following ASA catalog codes:\n${detailedLines.join("\n")}\nPlease share technical data sheets and Sadat City dispatch terms.`;

      const rawPhone = (settings?.whatsapp_number || settings?.phone || "")
        .replace(/[^0-9]/g, "");

      const base =
        rawPhone.length >= 9
          ? `https://wa.me/${rawPhone}`
          : "https://wa.me/";

      return `${base}?text=${encodeURIComponent(text)}`;
    },
    [selectedSkus, settings, skus]
  );

  const sendSkusToInquiryForm = useCallback(
    (codesOverride?: string[]) => {
      const codes =
        codesOverride && codesOverride.length > 0
          ? codesOverride
          : selectedSkus.length > 0
            ? selectedSkus
            : ["ECRAL5012"];

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("asa:fill-inquiry-skus", {
            detail: { codes },
          })
        );
        const inquiryEl = document.getElementById("inquiry");
        if (inquiryEl) {
          inquiryEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [selectedSkus]
  );

  const value = useMemo<SupabaseCatalogContextValue>(
    () => ({
      skus,
      categories,
      media,
      mediaRows,
      settings,
      isSynced,
      selectedSkus,
      toggleSku,
      addSku,
      removeSku,
      clearSkus,
      buildWhatsAppUrl,
      sendSkusToInquiryForm,
      refreshCatalog,
    }),
    [
      skus,
      categories,
      media,
      mediaRows,
      settings,
      isSynced,
      selectedSkus,
      toggleSku,
      addSku,
      removeSku,
      clearSkus,
      buildWhatsAppUrl,
      sendSkusToInquiryForm,
      refreshCatalog,
    ]
  );

  return (
    <SupabaseCatalogContext.Provider value={value}>
      {children}
    </SupabaseCatalogContext.Provider>
  );
}

export function useSupabaseCatalog(): SupabaseCatalogContextValue {
  return useContext(SupabaseCatalogContext);
}
