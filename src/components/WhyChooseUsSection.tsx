"use client";

import React, { useState } from "react";
import type { Dictionary, Locale } from "@/i18n/config";
import { RiverRibbon } from "@/components/RiverRibbon";

interface WhyChooseUsSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export function WhyChooseUsSection({ locale, dict }: WhyChooseUsSectionProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cards = dict.whyChooseUs.cards;

  const handlePrev = () => {
    setActiveCardIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-sino-fretwork text-[var(--color-on-navy)] border-b-2 border-[var(--color-gold)]">
      <RiverRibbon />

      <div className="catalog-container py-14 lg:py-20 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2
              className="text-[var(--color-gold-bright)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.whyChooseUs.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] mt-1">
              {dict.whyChooseUs.subtitle}
            </p>
          </div>

          {/* User-Controlled Prev/Next Card Highlight Controls for Mobile/Tablet */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={dict.common.prevSlide}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)]"
            >
              <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>
            </button>
            <span className="text-xs font-mono text-[var(--color-gold-bright)] px-2">
              0{activeCardIndex + 1} / 0{cards.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label={dict.common.nextSlide}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)]"
            >
              <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
            </button>
          </div>
        </div>

        {/* 3 Architectural Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const isMobileVisible = idx === activeCardIndex;
            return (
              <article
                key={card.step}
                className={`interactive-card rounded-[var(--radius-md)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] overflow-hidden flex-col justify-between ${
                  isMobileVisible ? "flex" : "hidden lg:flex"
                }`}
              >
                <div>
                  <div className="zoom-frame relative border-b border-[var(--color-gold)]/50">
                    <img
                      src={card.image}
                      width={480}
                      height={300}
                      loading="lazy"
                      alt={card.imageAlt}
                      className="w-full h-52 object-cover block"
                    />
                    <span
                      dir="ltr"
                      className="absolute top-3 inset-inline-start-3 px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] font-mono text-xs font-bold"
                    >
                      {card.step}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-[var(--color-gold-bright)]">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[var(--color-on-navy-muted)] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-[var(--color-navy-border)]">
                  <span
                    dir="ltr"
                    className="inline-block text-xs font-mono font-semibold text-[var(--color-gold)]"
                  >
                    {card.specTag}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
