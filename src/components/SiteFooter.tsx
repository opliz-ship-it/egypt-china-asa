"use client";

import React from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import {
  GOOGLE_MAPS_URL,
  PRODUCTS,
  SOCIAL_CHANNELS,
  type SocialChannelId,
} from "@/data/catalog";
import { RiverRibbon } from "@/components/RiverRibbon";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";

interface SiteFooterProps {
  locale: Locale;
  dict: Dictionary;
}

function SocialPlatformIcon({ id }: { id: SocialChannelId }) {
  switch (id) {
    case "facebook":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H7.7v3h2.5V21h3.3z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M16.6 5.8A4.8 4.8 0 0 1 15.2 3h-3.1v12.4a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 2.6-2.6c.3 0 .6 0 .8.1V9.6a6 6 0 0 0-.8-.1 5.7 5.7 0 0 0-5.7 5.8A5.7 5.7 0 0 0 9.5 21a5.7 5.7 0 0 0 5.7-5.7V9.1a8 8 0 0 0 4.8 1.6V7.6a4.8 4.8 0 0 1-3.4-1.8z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M12.04 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12.04 3zm5.25 12.68c-.22.62-1.29 1.18-1.78 1.25-.46.07-1.04.1-1.68-.11-.39-.12-.89-.29-1.53-.57-2.69-1.16-4.44-3.87-4.58-4.05-.13-.18-1.09-1.45-1.09-2.77 0-1.32.69-1.97.94-2.24.25-.27.54-.34.72-.34h.52c.17 0 .39-.06.61.47.22.54.76 1.86.83 1.99.07.13.11.29.02.47-.09.18-.13.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.69 1.14 1.48 1.84 1.02.91 1.88 1.19 2.15 1.32.27.13.43.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.61-.13.25.09 1.58.74 1.85.88.27.13.45.2.52.31.07.11.07.64-.15 1.26z" />
        </svg>
      );
  }
}

function isConfiguredText(value: string | null | undefined): value is string {
  return Boolean(value && value.trim().length > 0 && !value.includes("["));
}

function isValidHttpUrl(value: string | null | undefined): value is string {
  return Boolean(
    value &&
      (value.trim().startsWith("https://") ||
        value.trim().startsWith("http://"))
  );
}

export function SiteFooter({ locale, dict }: SiteFooterProps) {
  const { buildWhatsAppUrl, settings } = useSupabaseCatalog();

  const resolvedLocation =
    locale === "ar"
      ? isConfiguredText(settings?.location_ar)
        ? settings.location_ar
        : dict.common.locationLabel
      : isConfiguredText(settings?.location_en)
        ? settings.location_en
        : dict.common.locationLabel;

  const resolvedPhone = isConfiguredText(settings?.phone)
    ? settings.phone
    : dict.common.phonePendingLabel;

  const resolvedWhatsapp = isConfiguredText(settings?.whatsapp_number)
    ? settings.whatsapp_number
    : dict.common.whatsappPendingLabel;

  const resolvedEmail = isConfiguredText(settings?.email)
    ? settings.email
    : dict.common.emailPendingLabel;

  const resolvedEmailHref = isConfiguredText(settings?.email)
    ? `mailto:${settings.email.trim()}`
    : "mailto:info@egyptchina-asa.example";

  return (
    <footer className="bg-sino-fretwork text-[var(--color-on-navy)] border-t-2 border-[var(--color-gold)]">
      <RiverRibbon />

      {/* Upper 3-Column Corporate Footer Grid */}
      <div className="catalog-container py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          {/* Column 1: Partnership Overview & Official Social Media Channels */}
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-bold text-[var(--color-gold-bright)] pb-2 border-b border-[var(--color-navy-border)]">
              <span dir="ltr" className="font-wordmark">
                {dict.common.brandNameEn}
              </span>
            </h2>

            <p className="text-sm text-[var(--color-on-navy-muted)] leading-relaxed">
              {dict.footer.partnershipSummary}
            </p>

            {/* Social Media Channels (Facebook, TikTok, Instagram, WhatsApp) */}
            <div className="flex flex-col gap-3 pt-1">
              <h3 className="text-sm font-bold text-[var(--color-gold-bright)]">
                {dict.footer.socialTitle}
              </h3>

              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5">
                {SOCIAL_CHANNELS.map((channel) => {
                  const label = dict.footer.socialChannels[channel.id];
                  const settingsSocialUrl =
                    channel.id === "facebook"
                      ? settings?.facebook_url
                      : channel.id === "tiktok"
                        ? settings?.tiktok_url
                        : channel.id === "instagram"
                          ? settings?.instagram_url
                          : null;
                  const resolvedHref =
                    channel.id === "whatsapp"
                      ? buildWhatsAppUrl(locale)
                      : isValidHttpUrl(settingsSocialUrl)
                        ? settingsSocialUrl.trim()
                        : channel.url;

                  if (resolvedHref) {
                    const isWhatsApp = channel.id === "whatsapp";
                    return (
                      <a
                        key={channel.id}
                        href={resolvedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={`min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] border text-sm font-semibold transition-[transform,background-color,border-color,color] duration-150 hover:-translate-y-0.5 ${
                          isWhatsApp
                            ? "bg-[var(--color-whatsapp)] border-[var(--color-gold)]/70 text-[var(--color-on-navy)] hover:bg-[var(--color-whatsapp-hover)]"
                            : "bg-[var(--color-navy-deep)] border-[var(--color-gold)]/60 text-[var(--color-on-navy)] hover:border-[var(--color-gold-bright)] hover:text-[var(--color-gold-bright)]"
                        }`}
                      >
                        <SocialPlatformIcon id={channel.id} />
                        <span>{label}</span>
                      </a>
                    );
                  }

                  return (
                    <div
                      key={channel.id}
                      role="status"
                      className="min-h-[44px] inline-flex items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-navy-border)] bg-[var(--color-navy-deep)]/65 text-xs sm:text-sm text-[var(--color-on-navy-muted)]"
                    >
                      <span className="inline-flex items-center gap-2 font-semibold text-[var(--color-on-navy)]">
                        <SocialPlatformIcon id={channel.id} />
                        <span>{label}</span>
                      </span>
                      <span className="text-[11px] text-[var(--color-gold-bright)] shrink-0">
                        {dict.footer.socialPending}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Featured Product links + Quick navigation */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-bold text-[var(--color-gold-bright)] mb-3 pb-2 border-b border-[var(--color-navy-border)]">
                {dict.footer.featuredProductsTitle}
              </h2>
              <ul className="flex flex-col gap-1.5">
                {PRODUCTS.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      className="min-h-[44px] flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
                    >
                      <span>{product.title[locale]}</span>
                      <span
                        dir="ltr"
                        className="text-xs font-mono text-[var(--color-gold)] shrink-0"
                      >
                        {product.code}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--color-gold-bright)] mb-2">
                {dict.footer.quickLinksTitle}
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  href={`/${locale}/about`}
                  className="min-h-[44px] flex items-center px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy-muted)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
                >
                  {dict.nav.about}
                </Link>
                <Link
                  href={`/${locale}/services`}
                  className="min-h-[44px] flex items-center px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy-muted)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
                >
                  {dict.nav.services}
                </Link>
                <Link
                  href={`/${locale}/faq`}
                  className="min-h-[44px] flex items-center px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy-muted)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
                >
                  {dict.nav.faq}
                </Link>
                <Link
                  href={`/${locale}/about#downloads`}
                  className="min-h-[44px] flex items-center px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy-muted)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
                >
                  {dict.nav.aboutItems.downloads}
                </Link>
                <Link
                  href={`/${locale}/news`}
                  className="min-h-[44px] flex items-center px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy-muted)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
                >
                  {dict.nav.newsCasesItems.news}
                </Link>
                <Link
                  href={`/${locale}/cases`}
                  className="min-h-[44px] flex items-center px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy-muted)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
                >
                  {dict.nav.newsCasesItems.cases}
                </Link>
                <Link
                  href={`/${locale}/admin`}
                  className="min-h-[44px] flex items-center px-2.5 py-1.5 rounded-[var(--radius-xs)] text-sm text-[var(--color-gold-bright)] hover:bg-[var(--color-navy-deep)]"
                >
                  {locale === "ar"
                    ? "لوحة إدارة الكتالوج والصور"
                    : "Catalog & Media Admin"}
                </Link>
              </div>
            </div>
          </div>

          {/* Column 3: Sadat City Location + Honest Contact Slots */}
          <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[var(--color-gold-bright)] pb-2 border-b border-[var(--color-navy-border)]">
              {dict.footer.contactColTitle}
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[var(--color-on-navy-muted)]">
                  {dict.footer.addressTitle}
                </span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center font-medium text-[var(--color-on-navy)] hover:text-[var(--color-gold-bright)] underline decoration-[var(--color-gold)] underline-offset-4"
                >
                  {resolvedLocation}
                </a>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-[var(--color-navy-border)]">
                <span className="text-xs text-[var(--color-on-navy-muted)]">
                  {dict.footer.phoneTitle}
                </span>
                <span dir="ltr" className="font-mono text-sm text-[var(--color-gold-bright)] text-start">
                  {resolvedPhone}
                </span>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-[var(--color-navy-border)]">
                <span className="text-xs text-[var(--color-on-navy-muted)]">
                  {dict.footer.whatsappTitle}
                </span>
                <span dir="ltr" className="font-mono text-sm text-[var(--color-gold-bright)] text-start">
                  {resolvedWhatsapp}
                </span>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-[var(--color-navy-border)]">
                <span className="text-xs text-[var(--color-on-navy-muted)]">
                  {dict.footer.emailTitle}
                </span>
                <a
                  href={resolvedEmailHref}
                  dir="ltr"
                  className="min-h-[44px] inline-flex items-center font-mono text-xs sm:text-sm text-[var(--color-on-navy)] hover:text-[var(--color-gold-bright)]"
                >
                  {resolvedEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Flagship Brand Masthead: Monumental Logo Lockup Anchoring the Page End */}
      <div className="border-t border-[var(--color-gold)]/35 bg-[var(--color-navy-deep)]/90">
        <div className="catalog-container py-9 sm:py-12 flex flex-col items-center text-center gap-4">
          <Link
            href={`/${locale}`}
            aria-label={dict.common.brandNameEn}
            className="group flex flex-col items-center gap-3.5 rounded-[var(--radius-md)] px-4 py-2 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <img
              src="/assets/opt/emblem-circle-sm.webp"
              width={104}
              height={104}
              loading="lazy"
              decoding="async"
              alt={dict.common.brandNameEn}
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-[104px] lg:h-[104px] rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-navy)] object-contain"
            />
            <div className="flex flex-col items-center gap-1.5">
              <span
                dir="ltr"
                className="font-wordmark text-xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-[var(--color-gold-bright)] group-hover:text-[var(--color-on-navy)] transition-colors duration-150"
              >
                {dict.common.brandNameEn}
              </span>
              <div
                dir="ltr"
                className="flex items-center justify-center gap-3 text-sm sm:text-base text-[var(--color-on-navy-muted)]"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-8 sm:w-16 bg-[var(--color-gold)]/70"
                />
                <span>{dict.common.brandNameZh}</span>
                <span
                  aria-hidden="true"
                  className="h-px w-8 sm:w-16 bg-[var(--color-gold)]/70"
                />
              </div>
              <span
                dir="ltr"
                className="text-xs sm:text-sm font-semibold text-[var(--color-gold)]"
              >
                {dict.common.brandMotto}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Deep Navy (#072136) Copyright Strip */}
      <div className="bg-[var(--color-navy-deep)] border-t border-[var(--color-gold)]/25 py-4 text-xs text-[var(--color-on-navy-muted)]">
        <div className="catalog-container flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-start">
          <p>{dict.footer.copyright}</p>
          <p className="text-[var(--color-gold-bright)]">
            {locale === "ar" ? "مدينة السادات، مصر" : "Sadat City, Egypt"}
          </p>
        </div>
      </div>
    </footer>
  );
}
