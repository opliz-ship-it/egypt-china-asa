"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { useSupabaseCatalog } from "@/components/SupabaseCatalogProvider";
import {
  ADMIN_SESSION_STORAGE_KEY,
  fetchAdminCatalogBundle,
  refreshSupabaseSession,
  signInSupabaseAdmin,
  verifySupabaseAdminMembership,
  type AdminCatalogBundle,
  type AdminSessionData,
} from "@/lib/supabase";
import {
  AdminOverviewBar,
  type AdminDashboardTab,
} from "@/components/admin/AdminOverviewBar";
import { AdminInquiriesCrm } from "@/components/admin/AdminInquiriesCrm";
import { AdminSkusManager } from "@/components/admin/AdminSkusManager";
import { AdminMediaManager } from "@/components/admin/AdminMediaManager";
import { AdminCategoriesAndNewsManager } from "@/components/admin/AdminCategoriesAndNewsManager";
import { AdminSettingsAndDocsForm } from "@/components/admin/AdminSettingsAndDocsForm";

interface AdminDashboardClientProps {
  locale: Locale;
  dict: Dictionary;
}

/** Main client portal orchestrating persisted Supabase admin authentication and 5 management tabs. */
export function AdminDashboardClient({
  locale,
  dict,
}: AdminDashboardClientProps) {
  const {
    skus: publicSkus,
    categories: publicCategories,
    media: publicMedia,
    settings: publicSettings,
    editorialPosts: publicEditorialPosts,
    refreshCatalog,
  } = useSupabaseCatalog();

  const [activeTab, setActiveTab] = useState<AdminDashboardTab>("inquiries");
  const [session, setSession] = useState<AdminSessionData | null>(null);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminBundle, setAdminBundle] = useState<AdminCatalogBundle | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadAllAdminData = useCallback(
    async (token: string) => {
      const bundle = await fetchAdminCatalogBundle(token);
      if (bundle) {
        setAdminBundle(bundle);
      }
      await refreshCatalog();
    },
    [refreshCatalog]
  );

  // Restore persisted admin session cleanly on mount or locale switch
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const raw = window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<AdminSessionData>;
        if (!parsed.accessToken || !parsed.email) return;

        let validSession: AdminSessionData | null = null;
        if (parsed.expiresAt && parsed.expiresAt > Date.now() + 60_000) {
          const isAdmin = await verifySupabaseAdminMembership(parsed.accessToken);
          if (isAdmin) {
            validSession = {
              accessToken: parsed.accessToken,
              refreshToken: parsed.refreshToken ?? "",
              email: parsed.email,
              expiresAt: parsed.expiresAt,
            };
          }
        }
        if (!validSession && parsed.refreshToken) {
          validSession = await refreshSupabaseSession(parsed.refreshToken);
        }

        if (cancelled) return;
        if (validSession) {
          window.sessionStorage.setItem(
            ADMIN_SESSION_STORAGE_KEY,
            JSON.stringify(validSession)
          );
          setSession(validSession);
          void loadAllAdminData(validSession.accessToken);
        } else {
          window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
        }
      } catch {
        // ignore storage errors
      }
    };

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, [loadAllAdminData]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setActionMessage(null);
    setIsAuthenticating(true);

    const { session: nextSession, errorCode } = await signInSupabaseAdmin(
      loginIdentifier,
      loginPassword
    );
    setIsAuthenticating(false);

    if (!nextSession) {
      const friendlyError =
        errorCode === "not_in_admin_users"
          ? locale === "ar"
            ? "هذا الحساب غير مضاف في جدول الصلاحيات admin_users."
            : "Account authenticated, but not authorized in public.admin_users."
          : locale === "ar"
            ? "بيانات الدخول غير صحيحة أو تعذر التحقق من حساب المشرف."
            : "Invalid credentials or admin verification failed.";
      setAuthError(friendlyError);
      return;
    }

    try {
      window.sessionStorage.setItem(
        ADMIN_SESSION_STORAGE_KEY,
        JSON.stringify(nextSession)
      );
    } catch {
      // ignore storage errors
    }

    setSession(nextSession);
    setLoginPassword("");
    await loadAllAdminData(nextSession.accessToken);
    setActionMessage({
      type: "success",
      text:
        locale === "ar"
          ? "تم تسجيل دخول المشرف وتفعيل كافة صلاحيات الإدارة والمتابعة."
          : "Admin signed in. All catalog, media, and inquiry controls are active.",
    });
  };

  const handleSignOut = () => {
    setSession(null);
    setAdminBundle(null);
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setActionMessage({
      type: "success",
      text:
        locale === "ar"
          ? "تم تسجيل الخروج بنجاح."
          : "Signed out cleanly.",
    });
  };

  const handleRefreshAll = async () => {
    if (session?.accessToken) {
      await loadAllAdminData(session.accessToken);
    } else {
      await refreshCatalog();
    }
  };

  const resolvedSkus = adminBundle?.skus ?? publicSkus;
  const resolvedCategories = adminBundle?.categories ?? publicCategories;
  const resolvedMedia = adminBundle?.media ?? publicMedia;
  const resolvedSettings = adminBundle?.settings ?? publicSettings;
  const resolvedInquiries = adminBundle?.inquiries ?? [];
  const resolvedPosts = adminBundle?.editorialPosts ?? publicEditorialPosts;
  const newInquiryCount = resolvedInquiries.filter(
    (inq) => !inq.status || inq.status === "new"
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Top Authentication & Session Status Bar */}
      <div className="rounded-[var(--radius-md)] border-2 border-[var(--color-gold)] bg-[var(--color-navy)] p-5 sm:p-6 text-[var(--color-on-navy)] flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-navy-border)] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-gold-bright)]">
              {locale === "ar"
                ? "بوابة مصادقة المشرف (Supabase Auth & RLS)"
                : "Admin Authentication Gate (Supabase Auth & RLS)"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-on-navy-muted)] mt-0.5">
              {session
                ? locale === "ar"
                  ? `متصل الآن بحساب المشرف: ${session.email}`
                  : `Authenticated as admin: ${session.email}`
                : locale === "ar"
                  ? "سجل دخولك بحساب المشرف لإدارة طلبات العينات، تعديل الألوان، ورفع الصور والملفات."
                  : "Sign in with your admin credentials to manage inquiries, SKUs, media slots, and settings."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-[var(--radius-xs)] text-xs font-bold border ${
                session
                  ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]"
                  : "bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border-[var(--color-gold)]"
              }`}
            >
              {session
                ? locale === "ar"
                  ? "✓ جلسة إدارة مفعّلة"
                  : "✓ Admin Session Active"
                : locale === "ar"
                  ? "وضع العرض فقط (قراءة)"
                  : "Preview Mode (Read Only)"}
            </span>

            {session && (
              <button
                type="button"
                onClick={() => void handleRefreshAll()}
                className="min-h-[38px] px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--color-navy-deep)] text-[var(--color-on-navy)] border border-[var(--color-navy-border)] hover:border-[var(--color-gold)] text-xs font-semibold"
              >
                {locale === "ar" ? "تحديث البيانات" : "Refresh"}
              </button>
            )}

            <Link
              href={`/${locale}`}
              className="btn-action bg-[var(--color-navy-deep)] text-[var(--color-gold-bright)] border border-[var(--color-gold)] text-xs"
            >
              {dict.common.backToArchive}
            </Link>
          </div>
        </div>

        {!session ? (
          <form
            onSubmit={handleSignIn}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-5 flex flex-col gap-1">
              <label
                htmlFor="admin-login-email"
                className="text-xs font-semibold text-[var(--color-on-navy-muted)]"
              >
                {locale === "ar"
                  ? "اسم المستخدم أو البريد الإلكتروني"
                  : "Username or Email"}
              </label>
              <input
                id="admin-login-email"
                type="text"
                autoComplete="username"
                dir="ltr"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder={locale === "ar" ? "Kananaroof" : "username"}
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-ivory)] px-3.5 py-2 text-sm text-[var(--color-ink)]"
              />
            </div>

            <div className="sm:col-span-4 flex flex-col gap-1">
              <label
                htmlFor="admin-login-password"
                className="text-xs font-semibold text-[var(--color-on-navy-muted)]"
              >
                {locale === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                id="admin-login-password"
                type="password"
                autoComplete="current-password"
                dir="ltr"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--color-navy-border)] bg-[var(--color-ivory)] px-3.5 py-2 text-sm text-[var(--color-ink)]"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isAuthenticating}
                className="btn-action w-full bg-[var(--color-crimson)] text-[var(--color-on-navy)] border border-[var(--color-gold)] hover:bg-[var(--color-crimson-hover)] text-sm disabled:opacity-50"
              >
                {isAuthenticating
                  ? locale === "ar"
                    ? "جاري التحقق..."
                    : "Signing in..."
                  : locale === "ar"
                    ? "تسجيل دخول المشرف"
                    : "Admin Sign In"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-action bg-[var(--color-navy-deep)] text-[var(--color-on-navy)] border border-[var(--color-gold)] text-xs"
            >
              {locale === "ar" ? "تسجيل الخروج" : "Sign Out"}
            </button>
          </div>
        )}

        {authError && (
          <div
            role="alert"
            className="rounded-[var(--radius-xs)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] p-3 text-xs font-semibold text-[var(--color-error)]"
          >
            {authError}
          </div>
        )}
      </div>

      {/* KPI Overview & Site Readiness Strip */}
      <AdminOverviewBar
        locale={locale}
        skus={resolvedSkus}
        inquiries={resolvedInquiries}
        media={resolvedMedia}
        settings={resolvedSettings}
        isAuthenticated={Boolean(session)}
        onSelectTab={setActiveTab}
      />

      {actionMessage && (
        <div
          role="status"
          className={`rounded-[var(--radius-sm)] border p-4 text-sm font-semibold flex items-center justify-between gap-2 ${
            actionMessage.type === "success"
              ? "border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success)]"
              : "border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)]"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            type="button"
            aria-label={locale === "ar" ? "إغلاق التنبيه" : "Dismiss"}
            onClick={() => setActionMessage(null)}
            className="min-w-[32px] min-h-[32px] font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* 5-Tab Portal Navigation */}
      <div
        role="tablist"
        aria-label={
          locale === "ar" ? "أقسام لوحة التحكم" : "Admin dashboard sections"
        }
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        {(
          [
            {
              id: "inquiries",
              ar: `01. طلبات العينات (${session ? newInquiryCount : resolvedInquiries.length})`,
              en: `01. Inquiries CRM (${session ? newInquiryCount : resolvedInquiries.length})`,
            },
            {
              id: "skus",
              ar: `02. الأكواد والألوان (${resolvedSkus.length})`,
              en: `02. Color SKUs (${resolvedSkus.length})`,
            },
            {
              id: "media",
              ar: "03. الصور والشهادات",
              en: "03. Media & Certs",
            },
            {
              id: "content",
              ar: `04. التصنيفات والأخبار (${resolvedPosts.length})`,
              en: `04. Categories & News (${resolvedPosts.length})`,
            },
            {
              id: "settings",
              ar: "05. التواصل والملفات",
              en: "05. Contacts & PDFs",
            },
          ] as const
        ).map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[56px] p-3.5 rounded-[var(--radius-sm)] border text-start text-sm font-bold transition-colors duration-150 ${
                isSelected
                  ? "bg-[var(--color-navy)] text-[var(--color-gold-bright)] border-2 border-[var(--color-gold)]"
                  : "bg-[var(--color-ivory-elevated)] text-[var(--color-ink)] border-[var(--color-sand-border)] hover:border-[var(--color-navy)]"
              }`}
            >
              {locale === "ar" ? tab.ar : tab.en}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      {activeTab === "inquiries" && (
        <AdminInquiriesCrm
          locale={locale}
          accessToken={session?.accessToken ?? null}
          inquiries={resolvedInquiries}
          onRefresh={handleRefreshAll}
          onActionMessage={setActionMessage}
        />
      )}

      {activeTab === "skus" && (
        <AdminSkusManager
          locale={locale}
          accessToken={session?.accessToken ?? null}
          skus={resolvedSkus}
          categories={resolvedCategories}
          onRefresh={handleRefreshAll}
          onActionMessage={setActionMessage}
        />
      )}

      {activeTab === "media" && (
        <AdminMediaManager
          locale={locale}
          accessToken={session?.accessToken ?? null}
          media={resolvedMedia}
          onRefresh={handleRefreshAll}
          onActionMessage={setActionMessage}
        />
      )}

      {activeTab === "content" && (
        <AdminCategoriesAndNewsManager
          locale={locale}
          accessToken={session?.accessToken ?? null}
          categories={resolvedCategories}
          editorialPosts={resolvedPosts}
          customPostsJson={resolvedSettings?.editorial_posts_json ?? ""}
          onRefresh={handleRefreshAll}
          onActionMessage={setActionMessage}
        />
      )}

      {activeTab === "settings" && (
        <AdminSettingsAndDocsForm
          locale={locale}
          accessToken={session?.accessToken ?? null}
          settings={resolvedSettings}
          onRefresh={handleRefreshAll}
          onActionMessage={setActionMessage}
        />
      )}
    </div>
  );
}
