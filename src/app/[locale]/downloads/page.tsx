import { redirect } from "next/navigation";
import { isValidLocale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DownloadsRedirectPage({ params }: PageProps) {
  const { locale } = await params;
  const targetLocale = isValidLocale(locale) ? locale : "ar";
  redirect(`/${targetLocale}/about#downloads`);
}
