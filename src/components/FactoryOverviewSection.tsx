"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";
import { resolveFactoryVideoSource } from "@/lib/supabase";

interface FactoryOverviewSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export function FactoryOverviewSection({
  locale,
  dict,
}: FactoryOverviewSectionProps) {
  const { media, settings } = useSupabaseCatalog();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const videoSource = resolveFactoryVideoSource(settings?.video_url);
  const establishedBadge = settings?.established_year?.trim()
    ? settings.established_year.trim()
    : dict.common.yearPendingBadge;
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!videoModalOpen) return;
    closeBtnRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVideoModalOpen(false);
        triggerBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoModalOpen]);

  const closeModal = () => {
    setVideoModalOpen(false);
    triggerBtnRef.current?.focus();
  };

  return (
    <section
      id="architecture"
      className="py-14 lg:py-20 bg-[var(--color-sand)] border-y border-[var(--color-sand-border)]"
    >
      <div className="catalog-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Narrative & Honest Establishment Slot Column */}
          <div className="lg:col-span-6 flex flex-col gap-5 min-w-0">
            <div className="inline-flex items-center self-start px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] text-xs font-semibold border border-[var(--color-gold)]">
              {establishedBadge}
            </div>

            <h2
              className="text-[var(--color-navy)] font-bold"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {dict.partnership.title}
            </h2>

            <p className="text-base font-semibold text-[var(--color-ink)]">
              {dict.partnership.subtitle}
            </p>

            <p className="text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed">
              {dict.partnership.paragraph1}
            </p>

            <p className="text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed">
              {dict.partnership.paragraph2}
            </p>

            {/* Three Core Product Advantages Ledger */}
            <div className="rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-4 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[var(--color-navy)] border-b border-[var(--color-sand-border)] pb-2">
                {dict.partnership.coreAdvantagesTitle}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {dict.partnership.coreAdvantages.map((adv) => (
                  <li key={adv.code} className="flex items-start gap-3">
                    <span
                      dir="ltr"
                      className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] text-xs font-bold shrink-0 mt-0.5"
                    >
                      {adv.code}
                    </span>
                    <div className="flex flex-col">
                      <strong className="text-sm font-bold text-[var(--color-navy)]">
                        {adv.title}
                      </strong>
                      <span className="text-xs sm:text-sm text-[var(--color-charcoal)]">
                        {adv.detail}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/${locale}/about`}
                className="btn-action w-full sm:w-auto bg-[var(--color-navy)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-navy-deep)] hover:text-[var(--color-gold-bright)]"
              >
                {dict.partnership.ctaInspect}
              </Link>

              <button
                ref={triggerBtnRef}
                type="button"
                onClick={() => setVideoModalOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={videoModalOpen}
                className="btn-action w-full sm:w-auto bg-[var(--color-ivory-elevated)] text-[var(--color-navy)] border border-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-[var(--color-on-navy)]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <polygon points="3,2 12,7 3,12" />
                </svg>
                <span>{dict.partnership.videoBtnLabel}</span>
              </button>
            </div>
          </div>

          {/* Factory Visual & Video Showcase Trigger Card */}
          <div className="lg:col-span-6 min-w-0">
            <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-4 sm:p-5 text-[var(--color-on-navy)] flex flex-col gap-4">
              <div className="rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-navy-deep)] p-4 flex items-center justify-center">
                <img
                  src={media.factory_facade || "/assets/opt/factory-facade.webp"}
                  width={296}
                  height={162}
                  loading="lazy"
                  decoding="async"
                  alt={
                    locale === "ar"
                      ? "واجهة مصنع شركة مصر الصين لـ ASA في مدينة السادات"
                      : "EGYPT CHINA FOR ASA factory exterior in Sadat City"
                  }
                  className="w-full max-w-[380px] aspect-[296/162] object-cover rounded-[var(--radius-xs)] block"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--color-navy-border)] text-xs text-[var(--color-on-navy-muted)]">
                <span>{dict.common.locationLabel}</span>
                <span
                  dir="ltr"
                  className="font-semibold text-[var(--color-gold-bright)]"
                >
                  {videoSource
                    ? locale === "ar"
                      ? "فيديو المصنع الموثق"
                      : "Verified Plant Video"
                    : "[COMPANY_VIDEO_SLOT]"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Keyboard-Closable Video Showcase Modal */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="factory-video-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "var(--color-overlay)" }}
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy-deep)] p-6 sm:p-8 text-[var(--color-on-navy)] flex flex-col gap-5"
            style={{ boxShadow: "var(--shadow-dropdown)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--color-navy-border)] pb-3">
              <h3
                id="factory-video-modal-title"
                className="text-lg sm:text-xl font-bold text-[var(--color-gold-bright)]"
              >
                {dict.partnership.videoModalTitle}
              </h3>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeModal}
                aria-label={dict.partnership.videoCloseBtn}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gold)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] font-bold"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="2" y1="2" x2="12" y2="12" />
                  <line x1="12" y1="2" x2="2" y2="12" />
                </svg>
              </button>
            </div>

            {videoSource ? (
              <div className="aspect-video w-full rounded-[var(--radius-sm)] border border-[var(--color-gold)] overflow-hidden bg-[var(--color-navy-deep)]">
                {videoSource.kind === "youtube" ? (
                  <iframe
                    src={videoSource.src}
                    title={dict.partnership.videoModalTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoSource.src}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-video w-full rounded-[var(--radius-sm)] border border-[var(--color-gold)]/60 bg-[var(--color-navy)] p-6 flex flex-col items-center justify-center text-center gap-3">
                <img
                  src={media.factory_facade || "/assets/opt/factory-facade.webp"}
                  width={296}
                  height={162}
                  alt={dict.common.brandNameEn}
                  className="w-56 h-auto object-cover rounded-[var(--radius-xs)] border border-[var(--color-gold)]"
                />
                <span
                  dir="ltr"
                  className="text-sm font-bold text-[var(--color-gold-bright)]"
                >
                  [COMPANY_VIDEO_SLOT]
                </span>
                <p className="text-sm text-[var(--color-on-navy-muted)] max-w-md">
                  {dict.partnership.videoModalDesc}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="btn-action bg-[var(--color-gold)] text-[var(--color-navy-deep)] font-bold"
              >
                {dict.partnership.videoCloseBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
