"use client";

import React, { useState } from "react";
import type { Locale } from "@/i18n/config";
import { FAQ_ITEMS } from "@/data/catalog";

interface FaqAccordionClientProps {
  locale: Locale;
}

export function FaqAccordionClient({ locale }: FaqAccordionClientProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [FAQ_ITEMS[0]?.id ?? "what-is-asa"]: true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = Boolean(openIds[item.id]);
        return (
          <div
            key={item.id}
            id={item.id}
            className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] overflow-hidden"
            style={{ boxShadow: "var(--shadow-subtle)" }}
          >
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => toggleItem(item.id)}
                className={`w-full min-h-[56px] p-5 text-start flex items-center justify-between gap-4 font-bold transition-colors duration-150 ${
                  isOpen
                    ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-b border-[var(--color-gold)]"
                    : "bg-[var(--color-ivory-elevated)] text-[var(--color-navy)] hover:bg-[var(--color-sand)]"
                }`}
              >
                <span className="flex items-center gap-3 text-base sm:text-lg">
                  <span
                    dir="ltr"
                    className={`font-mono text-xs px-2 py-0.5 rounded-[var(--radius-xs)] border ${
                      isOpen
                        ? "border-[var(--color-gold)] text-[var(--color-gold-bright)] bg-[var(--color-navy-deep)]"
                        : "border-[var(--color-sand-border)] text-[var(--color-crimson)] bg-[var(--color-sand)]"
                    }`}
                  >
                    Q0{idx + 1}
                  </span>
                  <span>{item.question[locale]}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-lg font-mono shrink-0 w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] border border-current"
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>

            {isOpen && (
              <div
                id={`faq-panel-${item.id}`}
                role="region"
                className="p-5 sm:p-6 bg-[var(--color-ivory)] text-sm sm:text-base text-[var(--color-charcoal)] leading-relaxed flex flex-col gap-3"
              >
                <span className="inline-flex self-start px-2.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--color-sand)] text-xs font-semibold text-[var(--color-navy)] border border-[var(--color-sand-border)]">
                  {item.category[locale]}
                </span>
                <p>{item.answer[locale]}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
