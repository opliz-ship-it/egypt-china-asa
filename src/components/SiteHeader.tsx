"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/i18n/config";
import { FAQ_ITEMS, GOOGLE_MAPS_URL, PRODUCTS } from "@/data/catalog";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";

interface SiteHeaderProps {
  locale: Locale;
  dict: Dictionary;
}

interface NavDropdownItem {
  label: string;
  href: string;
}

interface NavEntry {
  id: string;
  label: string;
  href: string;
  children?: NavDropdownItem[];
}

export function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const pathname = usePathname() || `/${locale}`;
  const { settings, selectedSkus } = useSupabaseCatalog();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const hoverTimestampRef = useRef<number>(0);

  // Switch locale while preserving current path
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const alternateHref = useMemo(() => {
    const segments = pathname.split("/");
    if (segments.length > 1 && (segments[1] === "ar" || segments[1] === "en")) {
      segments[1] = alternateLocale;
      return segments.join("/") || `/${alternateLocale}`;
    }
    return `/${alternateLocale}`;
  }, [pathname, alternateLocale]);

  const navEntries: NavEntry[] = useMemo(
    () => [
      {
        id: "home",
        label: dict.nav.home,
        href: `/${locale}`,
      },
      {
        id: "products",
        label: dict.nav.products,
        href: `/${locale}/products`,
        children: [
          {
            label: dict.nav.productsItems.all,
            href: `/${locale}/products`,
          },
          {
            label: dict.nav.productsItems.films,
            href: `/${locale}/products?category=films`,
          },
          {
            label: dict.nav.productsItems.granules,
            href: `/${locale}/products?category=granules`,
          },
          {
            label: dict.nav.productsItems.coextrusion,
            href: `/${locale}/products?category=coextrusion`,
          },
          {
            label: dict.nav.productsItems.sheets,
            href: `/${locale}/products?category=sheets`,
          },
        ],
      },
      {
        id: "about",
        label: dict.nav.about,
        href: `/${locale}/about`,
        children: [
          {
            label: dict.nav.aboutItems.overview,
            href: `/${locale}/about#overview`,
          },
          {
            label: dict.nav.aboutItems.productionProcess,
            href: `/${locale}/about#production-process`,
          },
          {
            label: dict.nav.aboutItems.factory,
            href: `/${locale}/about#factory`,
          },
          {
            label: dict.nav.aboutItems.qualification,
            href: `/${locale}/about#qualification`,
          },
          {
            label: dict.nav.aboutItems.downloads,
            href: `/${locale}/about#downloads`,
          },
        ],
      },
      {
        id: "services",
        label: dict.nav.services,
        href: `/${locale}/services`,
        children: [
          {
            label: dict.nav.servicesItems.packaging,
            href: `/${locale}/services?tab=packaging#service-tabs`,
          },
          {
            label: dict.nav.servicesItems.purchase,
            href: `/${locale}/services?tab=purchase#purchase-process`,
          },
          {
            label: dict.nav.servicesItems.support,
            href: `/${locale}/services?tab=support#service-tabs`,
          },
          {
            label: dict.nav.servicesItems.colorMatching,
            href: `/${locale}/services?tab=color-matching#service-tabs`,
          },
        ],
      },
      {
        id: "faq",
        label: dict.nav.faq,
        href: `/${locale}/faq`,
      },
      {
        id: "newsCases",
        label: dict.nav.newsCases,
        href: `/${locale}/news`,
        children: [
          {
            label: dict.nav.newsCasesItems.news,
            href: `/${locale}/news`,
          },
          {
            label: dict.nav.newsCasesItems.cases,
            href: `/${locale}/cases`,
          },
        ],
      },
      {
        id: "contact",
        label: dict.nav.contact,
        href: `/${locale}/contact`,
      },
    ],
    [dict, locale]
  );

  // Close overlays cleanly when navigating across routes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Close menus/search on Escape or outside click
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Live catalog search filtering products and FAQs
  const searchResults = useMemo(() => {
    if (!searchOpen) {
      return { products: [], faqs: [] };
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return {
        products: PRODUCTS.slice(0, 3),
        faqs: FAQ_ITEMS.slice(0, 2),
      };
    }
    const matchingProducts = PRODUCTS.filter(
      (p) =>
        p.title[locale].toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.shortSummary[locale].toLowerCase().includes(q) ||
        p.description[locale].toLowerCase().includes(q) ||
        p.specifications.some(
          (s) =>
            s.property[locale].toLowerCase().includes(q) ||
            s.value.toLowerCase().includes(q) ||
            s.method.toLowerCase().includes(q)
        )
    );
    const matchingFaqs = FAQ_ITEMS.filter(
      (f) =>
        f.question[locale].toLowerCase().includes(q) ||
        f.answer[locale].toLowerCase().includes(q) ||
        f.category[locale].toLowerCase().includes(q)
    );
    return {
      products: matchingProducts,
      faqs: matchingFaqs,
    };
  }, [searchOpen, searchQuery, locale]);

  const totalMatches = searchResults.products.length + searchResults.faqs.length;

  return (
    <>
      {/* Top Utility Bar (naturally scrolls out of view with zero JS layout thrashing) */}
      <div className="bg-[var(--color-navy-deep)] border-b border-[var(--color-navy-border)] text-xs text-[var(--color-on-navy)]">
        <div className="catalog-container flex flex-wrap items-center justify-between gap-2 py-1.5">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <a
              href="mailto:info@egyptchina-asa.example"
              className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[34px] py-1 text-[var(--color-on-navy-muted)] hover:text-[var(--color-gold-bright)]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
                <path d="M2 4l6 4.5L14 4" />
              </svg>
              <span dir="ltr">
                {settings?.email && !settings.email.includes("[")
                  ? settings.email
                  : dict.common.emailPendingLabel}
              </span>
            </a>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 min-h-[34px] py-1 text-[var(--color-on-navy-muted)] hover:text-[var(--color-gold-bright)]"
              aria-label={dict.common.openMapAction}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="8" cy="6.5" r="2.2" />
                <path d="M8 14.5c3.5-3.8 5-6 5-8a5 5 0 1 0-10 0c0 2 1.5 4.2 5 8Z" />
              </svg>
              <span>{dict.common.locationLabel}</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {selectedSkus.length > 0 && (
              <Link
                href={`/${locale}#erp-swatch-catalog`}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[32px] px-2.5 py-0.5 rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] font-semibold hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)]"
              >
                <span>
                  {locale === "ar"
                    ? `سلة العينات (${selectedSkus.length})`
                    : `Sample Tray (${selectedSkus.length})`}
                </span>
              </Link>
            )}

            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] border border-[var(--color-navy-border)] bg-[var(--color-navy)] text-[var(--color-on-navy-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-bright)] font-semibold"
            >
              <span>
                {locale === "ar" ? "لوحة تحكم العميل" : "Client Admin"}
              </span>
            </Link>

            <Link
              href={alternateHref}
              aria-label={dict.common.switchLangAria}
              className="sm:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 py-1 rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] font-semibold"
            >
              {dict.common.switchLangLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar (Single-row aligned, hardware sticky without JS scroll jitter) */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-[var(--color-navy)] text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]"
      >
        <div className="catalog-container flex items-center justify-between gap-2 sm:gap-3 py-2">
          {/* Brand Seal + Wordmark Lockup */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 sm:gap-2.5 min-h-[44px] min-w-0 py-0.5 xl:shrink-0"
          >
            <img
              src="/assets/opt/emblem-circle-sm.webp"
              width={40}
              height={40}
              alt={dict.common.brandNameEn}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--color-gold)] object-contain bg-[var(--color-navy-deep)] shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span
                dir="ltr"
                className="font-wordmark text-xs sm:text-sm font-bold text-[var(--color-gold-bright)] leading-tight whitespace-nowrap truncate"
              >
                {dict.common.brandNameEn}
              </span>
              <span
                dir="ltr"
                className="text-xs text-[var(--color-on-navy-muted)] leading-tight whitespace-nowrap truncate"
              >
                {dict.common.brandNameZh}
              </span>
            </div>
          </Link>

          {/* Desktop 7-Destination Single-Row Nav */}
          <nav
            aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}
            className="hidden xl:flex items-center gap-0.5"
          >
            {navEntries.map((item) => {
              const isActive =
                item.href === `/${locale}`
                  ? pathname === `/${locale}`
                  : pathname.startsWith(item.href);

              if (!item.children) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`inline-flex items-center min-h-[44px] px-2.5 py-2 rounded-[var(--radius-sm)] text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? "bg-[var(--color-navy-surface)] text-[var(--color-gold-bright)] border-b-2 border-[var(--color-gold)]"
                        : "text-[var(--color-on-navy)] hover:bg-[var(--color-navy-surface)] hover:text-[var(--color-gold-bright)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              const isOpen = openDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => {
                    hoverTimestampRef.current = Date.now();
                    setOpenDropdown(item.id);
                  }}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center min-h-[44px] ps-2.5 pe-1 py-2 rounded-s-[var(--radius-sm)] text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                        isActive
                          ? "bg-[var(--color-navy-surface)] text-[var(--color-gold-bright)] border-b-2 border-[var(--color-gold)]"
                          : "text-[var(--color-on-navy)] hover:bg-[var(--color-navy-surface)] hover:text-[var(--color-gold-bright)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-label={`${item.label} submenu`}
                      onClick={() => {
                        setOpenDropdown((prev) => {
                          if (
                            prev === item.id &&
                            Date.now() - hoverTimestampRef.current < 400
                          ) {
                            return item.id;
                          }
                          return prev === item.id ? null : item.id;
                        });
                      }}
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[28px] px-1 rounded-e-[var(--radius-sm)] text-[var(--color-gold-bright)] hover:bg-[var(--color-navy-surface)]"
                    >
                      <span
                        aria-hidden="true"
                        className={`text-xs transition-transform duration-150 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>
                  </div>

                  {isOpen && (
                    <div
                      role="menu"
                      className="absolute inset-inline-start-0 top-full pt-1 w-64 z-50"
                    >
                      <div
                        className="rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] p-2 flex flex-col gap-1"
                        style={{ boxShadow: "var(--shadow-dropdown)" }}
                      >
                        {item.children.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className="min-h-[44px] flex items-center px-3 py-2 rounded-[var(--radius-xs)] text-sm text-[var(--color-on-navy)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)]"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Controls: Search Trigger + Always-Accessible Language Switcher + CTA + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-expanded={searchOpen}
              aria-controls="catalog-live-search"
              aria-label={
                searchOpen ? dict.common.closeSearchButton : dict.common.searchButton
              }
              onClick={() => setSearchOpen((prev) => !prev)}
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-navy-deep)] text-sm text-[var(--color-on-navy)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-bright)] whitespace-nowrap"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="13.5"
                  y1="13.5"
                  x2="18"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="hidden sm:inline">
                {locale === "ar" ? "بحث" : "Search"}
              </span>
            </button>

            <Link
              href={alternateHref}
              aria-label={dict.common.switchLangAria}
              className="hidden sm:inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-sm font-semibold text-[var(--color-gold-bright)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)] whitespace-nowrap"
            >
              {dict.common.switchLangLabel}
            </Link>

            <Link
              href={`/${locale}/contact#inquiry`}
              className="hidden md:inline-flex items-center justify-center min-h-[44px] px-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] text-sm font-semibold hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)] whitespace-nowrap"
            >
              {dict.common.requestQuoteBtn}
            </Link>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] min-w-[44px] px-2.5 sm:px-3.5 py-2 rounded-[var(--radius-sm)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-xs sm:text-sm font-semibold text-[var(--color-gold-bright)] whitespace-nowrap shrink-0"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="3" y1="3" x2="13" y2="13" />
                    <line x1="13" y1="3" x2="3" y2="13" />
                  </>
                ) : (
                  <>
                    <line x1="2" y1="4" x2="14" y2="4" />
                    <line x1="2" y1="8" x2="14" y2="8" />
                    <line x1="2" y1="12" x2="14" y2="12" />
                  </>
                )}
              </svg>
              <span>
                {mobileMenuOpen ? dict.common.closeMenuButton : dict.common.menuButton}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Live Search Overlay */}
        {searchOpen && (
          <div
            id="catalog-live-search"
            role="region"
            aria-label={dict.common.searchResultsLabel}
            className="border-t border-[var(--color-gold)] bg-[var(--color-navy-deep)] py-4 text-[var(--color-on-navy)]"
          >
            <div className="catalog-container flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="header-search-input" className="sr-only">
                  {dict.common.searchButton}
                </label>
                <input
                  ref={searchInputRef}
                  id="header-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.common.searchPlaceholder}
                  className="flex-1 min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-gold)] bg-[var(--color-ivory)] px-4 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-charcoal)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="min-h-[44px] px-3.5 py-2 rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-navy)] text-xs font-semibold text-[var(--color-on-navy)] hover:border-[var(--color-gold)]"
                  >
                    {dict.common.searchReset}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="min-h-[44px] px-3.5 py-2 rounded-[var(--radius-sm)] border border-[var(--color-gold)] bg-[var(--color-navy)] text-xs font-semibold text-[var(--color-gold-bright)]"
                >
                  {dict.common.closeSearchButton}
                </button>
              </div>

              {totalMatches === 0 ? (
                <div className="rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-navy)] p-4 text-sm text-[var(--color-on-navy-muted)]">
                  {dict.common.searchEmpty}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-[var(--color-gold-bright)]">
                      {dict.nav.products} ({searchResults.products.length})
                    </h3>
                    {searchResults.products.map((prod) => (
                      <Link
                        key={prod.slug}
                        href={`/${locale}/products/${prod.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="min-h-[44px] flex items-center justify-between gap-3 rounded-[var(--radius-xs)] border border-[var(--color-navy-border)] bg-[var(--color-navy)] px-3.5 py-2.5 text-sm hover:border-[var(--color-gold)]"
                      >
                        <span className="font-medium text-[var(--color-on-navy)]">
                          {prod.title[locale]}
                        </span>
                        <span
                          dir="ltr"
                          className="text-xs font-bold text-[var(--color-gold-bright)] shrink-0"
                        >
                          {prod.code}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-[var(--color-gold-bright)]">
                      {dict.nav.faq} ({searchResults.faqs.length})
                    </h3>
                    {searchResults.faqs.map((faq) => (
                      <Link
                        key={faq.id}
                        href={`/${locale}/faq#${faq.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="min-h-[44px] flex flex-col justify-center rounded-[var(--radius-xs)] border border-[var(--color-navy-border)] bg-[var(--color-navy)] px-3.5 py-2.5 text-sm hover:border-[var(--color-gold)]"
                      >
                        <span className="font-medium text-[var(--color-on-navy)]">
                          {faq.question[locale]}
                        </span>
                        <span className="text-xs text-[var(--color-on-navy-muted)]">
                          {faq.category[locale]}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Accessible Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label={locale === "ar" ? "قائمة الجوال" : "Mobile navigation"}
            className="xl:hidden border-t border-[var(--color-gold)] bg-[var(--color-navy-deep)] max-h-[82dvh] overflow-y-auto"
          >
            <div className="catalog-container py-4 flex flex-col gap-3">
              {navEntries.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-1.5 border-b border-[var(--color-navy-border)] pb-3 last:border-b-0"
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-navy)] font-semibold text-[var(--color-gold-bright)]"
                  >
                    <span>{item.label}</span>
                  </Link>

                  {item.children && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 ps-3 pt-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="min-h-[44px] flex items-center px-3 py-2 rounded-[var(--radius-xs)] border border-[var(--color-navy-border)] bg-[var(--color-navy-surface)]/40 text-sm text-[var(--color-on-navy)] hover:border-[var(--color-gold)]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href={`/${locale}/contact#inquiry`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-action w-full bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)]"
                >
                  {dict.common.requestQuoteBtn}
                </Link>
                <Link
                  href={alternateHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-action w-full bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)]"
                >
                  {dict.common.switchLangLabel}
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
