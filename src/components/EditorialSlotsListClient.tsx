"use client";

import React from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";

interface EditorialSlotsGridClientProps {
  locale: Locale;
  dict: Dictionary;
  filterType?: "news" | "case" | "all";
  limit?: number;
}

/** Client-synced grid for News & Project Cases reading Admin CMS overrides via SupabaseCatalogProvider. */
export function EditorialSlotsGridClient({
  locale,
  dict,
  filterType = "all",
  limit,
}: EditorialSlotsGridClientProps) {
  const { editorialPosts } = useSupabaseCatalog();

  const items = editorialPosts
    .filter((item) => filterType === "all" || item.type === filterType)
    .slice(0, limit ?? editorialPosts.length);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        filterType === "all" ? "lg:grid-cols-3 gap-6" : "gap-8"
      }`}
    >
      {items.map((item) => {
        const targetHref =
          item.type === "news"
            ? `/${locale}/news/${item.slug}`
            : `/${locale}/cases/${item.slug}`;

        return (
          <article
            key={item.slug}
            className="interactive-card rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden flex flex-col justify-between"
            style={{ boxShadow: "var(--shadow-subtle)" }}
          >
            <div>
              <div className="zoom-frame relative border-b border-[var(--color-sand-border)] bg-[var(--color-navy-deep)]">
                <img
                  src={item.image}
                  width={640}
                  height={380}
                  loading="lazy"
                  alt={item.imageAlt[locale]}
                  className={`w-full object-cover block ${
                    filterType === "all" ? "h-52" : "h-60"
                  }`}
                />
                <span
                  dir="ltr"
                  className="absolute top-3 inset-inline-start-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] font-mono text-xs font-bold"
                >
                  {item.slotCode}
                </span>
              </div>

              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[var(--color-crimson)]">
                    {item.categoryLabel[locale]}
                  </span>
                  <span className="font-mono text-[var(--color-charcoal)]">
                    {item.statusBadge[locale]}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[var(--color-navy)]">
                  <Link href={targetHref} className="hover:underline">
                    {item.title[locale]}
                  </Link>
                </h2>

                <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                  {item.summary[locale]}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={targetHref}
                className="btn-action w-full bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-sm"
              >
                {dict.common.viewDetailsBtn}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
