import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export type Dictionary = typeof enMessages;

const dictionaries: Record<Locale, Dictionary> = {
  ar: arMessages,
  en: enMessages,
};

export function isValidLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.ar;
}
