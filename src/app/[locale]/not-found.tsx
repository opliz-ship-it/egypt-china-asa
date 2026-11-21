import React from "react";
import Link from "next/link";

export default function LocaleNotFoundPage() {
  return (
    <section className="py-20 bg-ivory-watermark">
      <div className="catalog-container max-w-2xl text-center flex flex-col items-center gap-5">
        <span className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] text-sm font-bold border border-[var(--color-gold)]">
          404
        </span>
        <h1
          className="text-[var(--color-navy)] font-bold"
          style={{ fontSize: "var(--text-2xl)" }}
        >
          الصفحة غير موجودة | Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-charcoal)]">
          الرابط المطلوب غير متاح في الكتالوج. يمكنك العودة إلى الصفحة الرئيسية أو استعراض أصناف ASA المعتمدة.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/ar"
            className="btn-action bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)]"
          >
            العودة للرئيسية (AR)
          </Link>
          <Link
            href="/en"
            className="btn-action bg-[var(--color-sand)] text-[var(--color-navy)] border border-[var(--color-sand-border)]"
          >
            Return Home (EN)
          </Link>
        </div>
      </div>
    </section>
  );
}
