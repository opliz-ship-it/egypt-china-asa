"use client";

import React, { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import {
  buildRestHeaders,
  buildWhatsAppHref,
  SUPABASE_URL,
  type InquiryStatusValue,
  type SupabaseInquiryRow,
} from "@/lib/supabase";

interface AdminInquiriesCrmProps {
  locale: Locale;
  accessToken: string | null;
  inquiries: SupabaseInquiryRow[];
  onRefresh: () => Promise<void>;
  onActionMessage: (msg: { type: "success" | "error"; text: string }) => void;
}

const NOTE_MARKER = "\n[FOLLOWUP]: ";

function splitInquiryNotes(rawNotes?: string | null): {
  customerText: string;
  adminNote: string;
} {
  const raw = rawNotes ?? "";
  const idx = raw.indexOf(NOTE_MARKER);
  if (idx === -1) {
    return { customerText: raw, adminNote: "" };
  }
  return {
    customerText: raw.slice(0, idx),
    adminNote: raw.slice(idx + NOTE_MARKER.length),
  };
}

function parsePhoneAndEmail(rawPhoneField: string): {
  phone: string;
  email: string | null;
} {
  const parts = rawPhoneField.split("/").map((p) => p.trim());
  const phone = parts[0] ?? "";
  const emailCandidate = parts.find((p) => p.includes("@")) ?? null;
  return { phone, email: emailCandidate };
}

function formatInquiryDate(iso?: string, locale: Locale = "ar"): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

/** Mini-CRM panel to filter, update status, save follow-up notes, reply on WhatsApp, export CSV, or delete sample inquiries. */
export function AdminInquiriesCrm({
  locale,
  accessToken,
  inquiries,
  onRefresh,
  onActionMessage,
}: AdminInquiriesCrmProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatusValue>("all");
  const [searchText, setSearchText] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const out = { all: inquiries.length, new: 0, reviewed: 0, sent: 0 };
    for (const inq of inquiries) {
      const st = (inq.status || "new") as InquiryStatusValue;
      if (st === "reviewed") out.reviewed += 1;
      else if (st === "sent") out.sent += 1;
      else out.new += 1;
    }
    return out;
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return inquiries.filter((inq) => {
      const normalizedStatus = (inq.status || "new") as InquiryStatusValue;
      if (statusFilter !== "all" && normalizedStatus !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        inq.company_name.toLowerCase().includes(q) ||
        inq.contact_name.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        (inq.requested_codes || "").toLowerCase().includes(q) ||
        (inq.notes || "").toLowerCase().includes(q)
      );
    });
  }, [inquiries, statusFilter, searchText]);

  const statusLabels: Record<InquiryStatusValue, { ar: string; en: string }> = {
    new: { ar: "طلب جديد", en: "New" },
    reviewed: { ar: "تمت المراجعة / التواصل", en: "Reviewed / Contacted" },
    sent: { ar: "أُرسلت العينة / مكتمل", en: "Sample Sent / Closed" },
  };

  const handleUpdateInquiry = async (
    inq: SupabaseInquiryRow,
    nextStatus: InquiryStatusValue,
    nextAdminNote?: string
  ) => {
    if (!accessToken || inq.id === undefined) return;
    const rowId = String(inq.id);
    setSavingId(rowId);

    const { customerText, adminNote } = splitInquiryNotes(inq.notes);
    const resolvedNote =
      nextAdminNote !== undefined ? nextAdminNote.trim() : adminNote.trim();
    const combinedNotes = resolvedNote
      ? `${customerText}${NOTE_MARKER}${resolvedNote}`
      : customerText;

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/sample_inquiries?id=eq.${encodeURIComponent(rowId)}`,
        {
          method: "PATCH",
          headers: {
            ...buildRestHeaders(accessToken),
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            status: nextStatus,
            notes: combinedNotes,
          }),
        }
      );

      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر تحديث حالة أو ملاحظة الطلب في Supabase."
              : "Failed to update sample inquiry status in Supabase.",
        });
        return;
      }

      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم تحديث طلب (${inq.company_name}) إلى حالة: ${statusLabels[nextStatus].ar}.`
            : `Updated inquiry for ${inq.company_name} to "${statusLabels[nextStatus].en}".`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "حدث خطأ أثناء حفظ تحديث الطلب."
            : "Network error updating inquiry.",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteInquiry = async (inq: SupabaseInquiryRow) => {
    if (!accessToken || inq.id === undefined) return;
    const rowId = String(inq.id);
    setSavingId(rowId);

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/sample_inquiries?id=eq.${encodeURIComponent(rowId)}`,
        {
          method: "DELETE",
          headers: buildRestHeaders(accessToken),
        }
      );
      if (!res.ok) {
        onActionMessage({
          type: "error",
          text:
            locale === "ar"
              ? "تعذر حذف سجل الطلب."
              : "Could not delete sample inquiry row.",
        });
        return;
      }
      setConfirmDeleteId(null);
      await onRefresh();
      onActionMessage({
        type: "success",
        text:
          locale === "ar"
            ? `تم حذف الطلب الخاص بـ ${inq.company_name}.`
            : `Deleted inquiry from ${inq.company_name}.`,
      });
    } catch {
      onActionMessage({
        type: "error",
        text:
          locale === "ar"
            ? "تعذر الاتصال لحذف الطلب."
            : "Network error deleting inquiry.",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleExportCsv = () => {
    const escapeCell = (val: string) =>
      `"${val.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    const headers = [
      "ID",
      "Created At",
      "Status",
      "Company",
      "Contact Name",
      "Phone & Email",
      "Requested Codes",
      "Notes",
    ];
    const lines = [
      headers.map(escapeCell).join(","),
      ...filteredInquiries.map((inq) =>
        [
          String(inq.id ?? ""),
          inq.created_at ?? "",
          inq.status ?? "new",
          inq.company_name,
          inq.contact_name,
          inq.phone,
          inq.requested_codes ?? "",
          inq.notes ?? "",
        ]
          .map(escapeCell)
          .join(",")
      ),
    ];

    const blob = new Blob(["\uFEFF" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asa-sample-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!accessToken) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-8 text-center flex flex-col items-center gap-3">
        <h3 className="text-lg font-bold text-[var(--color-navy)]">
          {locale === "ar"
            ? "سجل دخولك أعلاه لعرض وإدارة طلبات العينات"
            : "Sign In Above to Manage Sample Inquiries"}
        </h3>
        <p className="text-sm text-[var(--color-charcoal)] max-w-lg">
          {locale === "ar"
            ? "حماية بيانات العملاء ومعلومات الاتصال مفعلة عبر سياسات RLS في Supabase، ولا تظهر الطلبات إلا بعد مصادقة المشرف."
            : "Customer inquiry records are protected by Supabase Row Level Security and require admin authentication."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar: Status Filters, Search & CSV Export */}
      <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", labelAr: `الكل (${counts.all})`, labelEn: `All (${counts.all})` },
              { id: "new", labelAr: `جديد (${counts.new})`, labelEn: `New (${counts.new})` },
              { id: "reviewed", labelAr: `تم التواصل (${counts.reviewed})`, labelEn: `Reviewed (${counts.reviewed})` },
              { id: "sent", labelAr: `أُرسلت العينة (${counts.sent})`, labelEn: `Sample Sent (${counts.sent})` },
            ] as const
          ).map((f) => {
            const active = statusFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-[var(--radius-sm)] text-xs sm:text-sm font-bold border transition-colors ${
                  active
                    ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-[var(--color-gold)]"
                    : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
                }`}
              >
                {locale === "ar" ? f.labelAr : f.labelEn}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              locale === "ar"
                ? "بحث باسم الشركة أو الكود أو الهاتف..."
                : "Search company, SKU code, or phone..."
            }
            className="min-h-[44px] w-full sm:w-64 rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] px-3 py-2 text-sm text-[var(--color-ink)]"
          />

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredInquiries.length === 0}
            className="btn-action bg-[var(--color-gold)] text-[var(--color-navy-deep)] font-bold text-xs sm:text-sm disabled:opacity-45"
          >
            {locale === "ar" ? "تصدير CSV (Excel)" : "Export CSV (Excel)"}
          </button>
        </div>
      </div>

      {/* Inquiries Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-8 text-center text-sm text-[var(--color-charcoal)]">
          {locale === "ar"
            ? "لا توجد طلبات عينات مطابقة للتصفية الحالية."
            : "No sample inquiries match the current filter."}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredInquiries.map((inq, idx) => {
            const rowId = String(inq.id ?? idx);
            const currentStatus = (inq.status || "new") as InquiryStatusValue;
            const { customerText, adminNote } = splitInquiryNotes(inq.notes);
            const draftValue =
              noteDrafts[rowId] !== undefined ? noteDrafts[rowId] : adminNote;
            const { phone: extractedPhone, email: extractedEmail } =
              parsePhoneAndEmail(inq.phone);
            const waReplyMsg =
              locale === "ar"
                ? `مرحباً أ/ ${inq.contact_name} (${inq.company_name})،\nمعكم فريق المبيعات والدعم الفني لشركة المصرية الصينية لإنتاج (ASA).\nبخصوص طلبكم للأكواد: ${inq.requested_codes || "مواد ASA"}، يسعدنا تنسيق إرسال العينات وتفاصيل المواصفات.`
                : `Hello ${inq.contact_name} (${inq.company_name}),\nThis is EGYPT CHINA FOR ASA sales & technical desk.\nRegarding your sample inquiry (${inq.requested_codes || "ASA Grades"}), we are ready to coordinate sample dispatch and technical details.`;
            const isSaving = savingId === rowId;

            return (
              <article
                key={rowId}
                className="rounded-[var(--radius-md)] border border-[var(--color-sand-border)] bg-[var(--color-ivory-elevated)] p-5 flex flex-col gap-4"
                style={{ boxShadow: "var(--shadow-subtle)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-sand-border)] pb-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-[var(--radius-xs)] text-xs font-bold border ${
                          currentStatus === "sent"
                            ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]"
                            : currentStatus === "reviewed"
                              ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-[var(--color-gold)]"
                              : "bg-[var(--color-crimson)] text-[var(--color-on-navy)] border-[var(--color-crimson)]"
                        }`}
                      >
                        {locale === "ar"
                          ? statusLabels[currentStatus].ar
                          : statusLabels[currentStatus].en}
                      </span>
                      <strong className="text-base font-bold text-[var(--color-navy)]">
                        {inq.contact_name}
                      </strong>
                      <span className="text-sm font-semibold text-[var(--color-charcoal)]">
                        ({inq.company_name})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-charcoal)]">
                      <span dir="ltr" className="font-mono font-semibold text-[var(--color-navy)]">
                        {inq.phone}
                      </span>
                      {inq.created_at && (
                        <span>{formatInquiryDate(inq.created_at, locale)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      dir="ltr"
                      className="px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--color-sand)] border border-[var(--color-sand-border)] font-mono text-xs font-bold text-[var(--color-crimson)]"
                    >
                      {inq.requested_codes || "GENERAL"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-ink)] bg-[var(--color-ivory)] rounded-[var(--radius-xs)] border border-[var(--color-sand-border)] p-3 leading-relaxed">
                  {customerText}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                  <div className="lg:col-span-3 flex flex-col gap-1">
                    <label
                      htmlFor={`inq-status-${rowId}`}
                      className="text-xs font-semibold text-[var(--color-charcoal)]"
                    >
                      {locale === "ar" ? "حالة المتابعة" : "Follow-up Status"}
                    </label>
                    <select
                      id={`inq-status-${rowId}`}
                      disabled={isSaving}
                      value={currentStatus}
                      onChange={(e) =>
                        void handleUpdateInquiry(
                          inq,
                          e.target.value as InquiryStatusValue,
                          draftValue
                        )
                      }
                      className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--color-navy)]"
                    >
                      <option value="new">
                        {locale === "ar" ? statusLabels.new.ar : statusLabels.new.en}
                      </option>
                      <option value="reviewed">
                        {locale === "ar"
                          ? statusLabels.reviewed.ar
                          : statusLabels.reviewed.en}
                      </option>
                      <option value="sent">
                        {locale === "ar" ? statusLabels.sent.ar : statusLabels.sent.en}
                      </option>
                    </select>
                  </div>

                  <div className="lg:col-span-5 flex flex-col gap-1">
                    <label
                      htmlFor={`inq-note-${rowId}`}
                      className="text-xs font-semibold text-[var(--color-charcoal)]"
                    >
                      {locale === "ar"
                        ? "ملاحظات المبيعات الداخلية"
                        : "Internal Sales Note"}
                    </label>
                    <input
                      id={`inq-note-${rowId}`}
                      type="text"
                      value={draftValue}
                      onChange={(e) =>
                        setNoteDrafts((prev) => ({ ...prev, [rowId]: e.target.value }))
                      }
                      placeholder={
                        locale === "ar"
                          ? "مثل: تم شحن رول عينة مع شركة الشحن..."
                          : "e.g. Dispatched sample kit via courier..."
                      }
                      className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-ivory)] px-3 py-2 text-sm text-[var(--color-ink)]"
                    />
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() =>
                        void handleUpdateInquiry(inq, currentStatus, draftValue)
                      }
                      className="min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-navy)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-xs font-bold hover:bg-[var(--color-navy-deep)] disabled:opacity-50"
                    >
                      {locale === "ar" ? "حفظ الملاحظة" : "Save Note"}
                    </button>

                    {extractedPhone && (
                      <a
                        href={buildWhatsAppHref(extractedPhone, waReplyMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-whatsapp)] text-[var(--color-on-navy)] text-xs font-bold hover:bg-[var(--color-whatsapp-hover)]"
                      >
                        {locale === "ar" ? "رد واتساب" : "WhatsApp"}
                      </a>
                    )}

                    {extractedEmail && (
                      <a
                        href={`mailto:${extractedEmail}?subject=${encodeURIComponent(
                          `EGYPT CHINA FOR ASA - ${inq.requested_codes || "Sample Inquiry"}`
                        )}`}
                        className="min-h-[44px] inline-flex items-center px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-navy)] bg-[var(--color-sand)] text-[var(--color-navy)] text-xs font-bold hover:bg-[var(--color-navy)] hover:text-[var(--color-on-navy)]"
                      >
                        {locale === "ar" ? "بريد" : "Email"}
                      </a>
                    )}

                    {confirmDeleteId === rowId ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => void handleDeleteInquiry(inq)}
                          className="min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-crimson)] text-[var(--color-on-navy)] text-xs font-bold"
                        >
                          {locale === "ar" ? "تأكيد" : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[44px] px-2.5 py-2 rounded-[var(--radius-sm)] border border-[var(--color-sand-border)] bg-[var(--color-sand)] text-xs font-semibold"
                        >
                          {locale === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(rowId)}
                        className="min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)] text-xs font-bold"
                      >
                        {locale === "ar" ? "حذف" : "Delete"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
