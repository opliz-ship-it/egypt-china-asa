"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { RiverRibbon } from "@/components/RiverRibbon";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";

interface HomeHeroShowcaseProps {
  locale: Locale;
  dict: Dictionary;
}

export function HomeHeroShowcase({ locale, dict }: HomeHeroShowcaseProps) {
  const { media } = useSupabaseCatalog();
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);

  const togglePrev = () => setActiveSlide((prev) => (prev === 0 ? 1 : 0));
  const toggleNext = () => setActiveSlide((prev) => (prev === 1 ? 0 : 1));

  const slide = activeSlide === 0 ? dict.hero.slide1 : dict.hero.slide2;

  return (
    <section
      aria-label={
        locale === "ar"
          ? "العرض الرئيسي لمنتجات شركة مصر الصين لـ ASA"
          : "Primary ASA Polymer Showcase"
      }
      className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]"
    >
      <div className="catalog-container py-7 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
          {/* Left/Start Architectural Identity & Headline Column */}
          <div className="lg:col-span-6 flex flex-col gap-5 min-w-0">
            {/* Official Seal & Trilingual Wordmark Lockup */}
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/opt/emblem-circle-sm.webp"
                width={68}
                height={68}
                fetchPriority="high"
                decoding="sync"
                alt={dict.common.brandNameEn}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[var(--color-gold)] bg-[var(--color-navy-deep)] object-contain shrink-0"
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  dir="ltr"
                  className="font-wordmark text-base sm:text-lg font-bold text-[var(--color-gold-bright)]"
                >
                  {dict.common.brandNameEn}
                </span>
                <span
                  dir="ltr"
                  className="text-xs sm:text-sm text-[var(--color-on-navy-muted)]"
                >
                  {dict.common.brandNameZh} : {dict.common.brandMotto}
                </span>
              </div>
            </div>

            {/* Hallmark Floor #9 & #12: Direct H1 without tracked uppercase pill eyebrow above it */}
            <h1
              className="text-[var(--color-on-navy)] font-bold"
              style={{ fontSize: "var(--text-hero)" }}
            >
              {slide.headline}
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-on-navy-muted)] max-w-[60ch] leading-relaxed">
              {slide.summary}
            </p>

            {/* Primary & Secondary CTAs (visible at 1280x800 without scrolling) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#inquiry"
                className="btn-action w-full sm:w-auto bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
              >
                {slide.primaryCta}
              </a>
              <Link
                href={
                  activeSlide === 0
                    ? `/${locale}/products`
                    : `/${locale}/about#factory`
                }
                className="btn-action w-full sm:w-auto bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)]"
              >
                {slide.secondaryCta}
              </Link>
            </div>

            {/* User-Controlled 2-Slide Switcher (No Auto-Advance Loop) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-navy-border)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSlide(0)}
                  aria-pressed={activeSlide === 0}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-[var(--radius-xs)] text-xs sm:text-sm font-semibold border transition-colors duration-150 ${
                    activeSlide === 0
                      ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)] border-[var(--color-gold)]"
                      : "bg-[var(--color-navy-deep)] text-[var(--color-on-navy-muted)] border-[var(--color-navy-border)] hover:border-[var(--color-gold)]"
                  }`}
                >
                  01. {locale === "ar" ? "الأفلام والألواح" : "Films & Sheets"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide(1)}
                  aria-pressed={activeSlide === 1}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-[var(--radius-xs)] text-xs sm:text-sm font-semibold border transition-colors duration-150 ${
                    activeSlide === 1
                      ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)] border-[var(--color-gold)]"
                      : "bg-[var(--color-navy-deep)] text-[var(--color-on-navy-muted)] border-[var(--color-navy-border)] hover:border-[var(--color-gold)]"
                  }`}
                >
                  02. {locale === "ar" ? "حبيبات الراتنج" : "Resin Granules"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePrev}
                  aria-label={dict.common.prevSlide}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)]"
                >
                  <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleNext}
                  aria-label={dict.common.nextSlide}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)]"
                >
                  <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right/End Visual Specimen & ISO Metrics Column */}
          <div className="lg:col-span-6 min-w-0">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] p-3 sm:p-4 flex flex-col gap-3.5">
              <div
                className={
                  activeSlide === 0
                    ? "grid grid-cols-1 sm:grid-cols-12 gap-3"
                    : "hidden"
                }
              >
                <div className="sm:col-span-7 zoom-frame rounded-[var(--radius-sm)] border border-[var(--color-navy-border)]">
                  <img
                    src={media.hero_partnership || "/assets/opt/hero-partnership.webp"}
                    width={640}
                    height={420}
                    fetchPriority="high"
                    decoding="sync"
                    alt={
                      locale === "ar"
                        ? "هوية الشراكة المصرية الصينية مع ألواح الأسقف الملونة ASA"
                        : "Sino-Egyptian partnership artwork featuring corrugated ASA roofing sheets"
                    }
                    className="w-full h-52 sm:h-60 object-cover block"
                  />
                </div>
                <div className="sm:col-span-5 zoom-frame rounded-[var(--radius-sm)] border border-[var(--color-navy-border)]">
                  <img
                    src={media.hero_red_sheet || "/assets/opt/asa-red-sheet.webp"}
                    width={480}
                    height={420}
                    fetchPriority="high"
                    decoding="sync"
                    alt={
                      locale === "ar"
                        ? "لوح سقف مموج ASA باللون الأحمر مع حبيبات البوليمر"
                        : "Red textured corrugated ASA sheet with polymer resin granules"
                    }
                    className="w-full h-52 sm:h-60 object-cover block"
                  />
                </div>
              </div>

              <div
                className={
                  activeSlide === 1
                    ? "grid grid-cols-1 sm:grid-cols-12 gap-3"
                    : "hidden"
                }
              >
                <div className="sm:col-span-7 zoom-frame rounded-[var(--radius-sm)] border border-[var(--color-navy-border)]">
                  <img
                    src={media.jar_granules || "/assets/opt/asa-color-jars.webp"}
                    width={640}
                    height={420}
                    decoding="async"
                    alt={
                      locale === "ar"
                        ? "سبع عبوات زجاجية تحتوي على حبيبات راتنج ASA الملونة"
                        : "Seven glass jars filled with colored ASA polymer granules"
                    }
                    className="w-full h-52 sm:h-60 object-cover block"
                  />
                </div>
                <div className="sm:col-span-5 zoom-frame rounded-[var(--radius-sm)] border border-[var(--color-navy-border)]">
                  <img
                    src={media.black_corrugated || "/assets/opt/asa-black-corrugated.webp"}
                    width={480}
                    height={420}
                    decoding="async"
                    alt={
                      locale === "ar"
                        ? "لوح ASA أسود مموج مع حبيبات البثق المشترك"
                        : "Charcoal black corrugated ASA sheet with co-extrusion pellets"
                    }
                    className="w-full h-52 sm:h-60 object-cover block"
                  />
                </div>
              </div>

              {/* Verified Catalogue & ISO Specification Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--color-gold)]/50">
                <div className="rounded-[var(--radius-xs)] bg-[var(--color-navy)] p-3 border border-[var(--color-navy-border)]">
                  <strong
                    dir="ltr"
                    className="block text-base sm:text-lg font-bold text-[var(--color-gold-bright)]"
                  >
                    {slide.spec1Value}
                  </strong>
                  <span className="text-xs text-[var(--color-on-navy-muted)]">
                    {slide.spec1Label}
                  </span>
                </div>
                <div className="rounded-[var(--radius-xs)] bg-[var(--color-navy)] p-3 border border-[var(--color-navy-border)]">
                  <strong
                    dir="ltr"
                    className="block text-base sm:text-lg font-bold text-[var(--color-gold-bright)]"
                  >
                    {slide.spec2Value}
                  </strong>
                  <span className="text-xs text-[var(--color-on-navy-muted)]">
                    {slide.spec2Label}
                  </span>
                </div>
                <div className="rounded-[var(--radius-xs)] bg-[var(--color-navy)] p-3 border border-[var(--color-navy-border)]">
                  <strong
                    dir="ltr"
                    className="block text-base sm:text-lg font-bold text-[var(--color-gold-bright)]"
                  >
                    {slide.spec3Value}
                  </strong>
                  <span className="text-xs text-[var(--color-on-navy-muted)]">
                    {slide.spec3Label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Brand Element #2: Twin-Ribbon River Motif */}
      <RiverRibbon />
    </section>
  );
}
