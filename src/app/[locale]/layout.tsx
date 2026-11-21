import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Alexandria,
  Cinzel,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "../globals.css";
import { getDictionary, isValidLocale, locales, type Locale } from "@/i18n/config";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SupabaseCatalogProvider } from "@/components/SupabaseCatalogProvider";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-alexandria",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-ar",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-en",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale: Locale = isValidLocale(locale) ? locale : "ar";
  const dict = getDictionary(validLocale);

  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    icons: {
      icon: "/assets/opt/emblem-circle-sm.webp",
    },
    other: {
      "page-type": "product",
      "site-kind": "other",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-type="product"
      className={`overflow-x-clip ${alexandria.variable} ${ibmPlexArabic.variable} ${ibmPlexSans.variable} ${cinzel.variable}`}
    >
      <body className="overflow-x-clip min-h-dvh flex flex-col justify-between">
        <SupabaseCatalogProvider>
          <a href="#main-content" className="skip-to-main">
            {dict.common.skipToMain}
          </a>
          <SiteHeader locale={locale} dict={dict} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale} dict={dict} />
        </SupabaseCatalogProvider>
      </body>
    </html>
  );
}
