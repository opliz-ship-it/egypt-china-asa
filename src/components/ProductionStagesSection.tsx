"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { ProductionStageDiagram } from "@/components/RiverRibbon";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";
import { isValidAssetUrl } from "@/lib/supabase";

interface ProductionStagesSectionProps {
  locale: Locale;
  dict: Dictionary;
  mode?: "interactive" | "grid";
}

export function ProductionStagesSection({
  locale,
  dict,
  mode = "interactive",
}: ProductionStagesSectionProps) {
  const { media } = useSupabaseCatalog();
  const [activeIndex, setActiveIndex] = useState(0);
  const stages = dict.productionStages.stages;
  const activeStage = stages[activeIndex] ?? stages[0];
  const getStagePhoto = (step: string): string | null => {
    const candidate = media[`stage_${step}`];
    return isValidAssetUrl(candidate) ? candidate : null;
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? stages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === stages.length - 1 ? 0 : prev + 1));
  };

  if (mode === "grid") {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h2
            className="text-[var(--color-navy)] font-bold"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            {dict.productionStages.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1 max-w-3xl">
            {dict.productionStages.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <article
              key={stage.step}
              className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden flex flex-col justify-between"
              style={{ boxShadow: "var(--shadow-subtle)" }}
            >
              <div>
                {/* 16:10 Factory Photography (Live CMS or Architectural Placeholder) */}
                {(() => {
                  const stagePhoto = getStagePhoto(stage.step);
                  if (stagePhoto) {
                    return (
                      <div className="aspect-[16/10] w-full bg-[var(--color-navy)] border-b-2 border-[var(--color-gold)] overflow-hidden relative">
                        <img
                          src={stagePhoto}
                          width={560}
                          height={350}
                          loading="lazy"
                          alt={stage.title}
                          className="w-full h-full object-cover block"
                        />
                        <span
                          dir="ltr"
                          className="absolute top-3 inset-inline-start-3 px-2.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)]/90 border border-[var(--color-gold)] text-xs font-bold text-[var(--color-gold-bright)]"
                        >
                          STAGE {stage.step}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div className="aspect-[16/10] w-full bg-[var(--color-navy)] border-b-2 border-[var(--color-gold)] p-5 flex flex-col items-center justify-center text-center gap-3">
                      <ProductionStageDiagram step={stage.step} />
                      <span
                        dir="ltr"
                        className="px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] border border-[var(--color-gold)] text-xs font-bold text-[var(--color-gold-bright)]"
                      >
                        {stage.slotCode}
                      </span>
                      <span className="text-xs text-[var(--color-on-navy-muted)] max-w-xs">
                        {dict.productionStages.slotInstruction}
                      </span>
                    </div>
                  );
                })()}

                <div className="p-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      dir="ltr"
                      className="px-2.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--color-crimson)] text-[var(--color-on-navy)] text-xs font-bold"
                    >
                      {stage.step}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-navy)]">
                      {stage.specLabel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--color-navy)]">
                    {stage.title}
                  </h3>

                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-[var(--color-sand)] border-t border-[var(--color-sand-border)]">
                <strong
                  dir="ltr"
                  className="text-xs font-bold text-[var(--color-navy)]"
                >
                  {stage.specValue}
                </strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      id="production-stages"
      aria-labelledby="production-stages-heading"
      className="py-14 lg:py-20 bg-[var(--color-sand)] border-b border-[var(--color-sand-border)]"
    >
      <div className="catalog-container flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h2
              id="production-stages-heading"
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.productionStages.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-charcoal)] mt-1">
              {dict.productionStages.subtitle}
            </p>
          </div>

          <Link
            href={`/${locale}/about#production-process`}
            className="btn-action self-start md:self-auto bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-bright)] text-sm"
          >
            {dict.productionStages.viewAllStagesBtn}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left/Start 6-Stage Selector */}
          <div
            role="tablist"
            aria-label={dict.productionStages.title}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5"
          >
            {stages.map((stage, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={stage.step}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveIndex(idx)}
                  className={`min-h-[56px] p-3.5 rounded-[var(--radius-sm)] border text-start flex items-center justify-between gap-3 transition-colors duration-150 ${
                    isSelected
                      ? "bg-[var(--color-navy)] text-[var(--color-on-navy)] border-2 border-[var(--color-gold)]"
                      : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      dir="ltr"
                      className={`px-2.5 py-1 rounded-[var(--radius-xs)] text-xs font-bold shrink-0 ${
                        isSelected
                          ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)]"
                          : "bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-sand-border)]"
                      }`}
                    >
                      {stage.step}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <strong className="text-sm font-bold leading-snug">
                        {stage.title}
                      </strong>
                      <span
                        className={`text-xs ${
                          isSelected
                            ? "text-[var(--color-on-navy-muted)]"
                            : "text-[var(--color-charcoal)]"
                        }`}
                      >
                        {stage.specLabel}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right/End Active Stage Photo Slot & Process Panel */}
          <div
            aria-live="polite"
            className="lg:col-span-7 rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] text-[var(--color-on-navy)] p-5 sm:p-7 flex flex-col justify-between gap-5"
          >
            <div className="flex flex-col gap-5">
              {/* 16:10 Factory Photo Frame (Live CMS or Architectural Placeholder) */}
              {(() => {
                const activePhoto = getStagePhoto(activeStage.step);
                if (activePhoto) {
                  return (
                    <div className="aspect-[16/10] w-full rounded-[var(--radius-sm)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] overflow-hidden">
                      <img
                        src={activePhoto}
                        width={640}
                        height={400}
                        alt={activeStage.title}
                        className="w-full h-full object-cover block"
                      />
                    </div>
                  );
                }
                return (
                  <div className="aspect-[16/10] w-full rounded-[var(--radius-sm)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] p-6 flex flex-col items-center justify-center text-center gap-3">
                    <ProductionStageDiagram step={activeStage.step} />
                    <span
                      dir="ltr"
                      className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] border border-[var(--color-gold)] text-xs sm:text-sm font-bold text-[var(--color-gold-bright)]"
                    >
                      {activeStage.slotCode}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--color-on-navy-muted)] max-w-md">
                      {dict.productionStages.slotInstruction}
                    </p>
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-navy-border)] pb-3">
                <h3 className="text-xl font-bold text-[var(--color-gold-bright)]">
                  {activeStage.step}. {activeStage.title}
                </h3>
                <span
                  dir="ltr"
                  className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] border border-[var(--color-navy-border)] text-xs font-bold text-[var(--color-gold)]"
                >
                  {activeStage.specValue}
                </span>
              </div>

              <p className="text-sm sm:text-base text-[var(--color-on-navy-muted)] leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-navy-border)]">
              <span className="text-xs font-semibold text-[var(--color-gold)]">
                {activeStage.specLabel}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={dict.common.prevSlide}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)]"
                >
                  <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={dict.common.nextSlide}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-deep)]"
                >
                  <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
