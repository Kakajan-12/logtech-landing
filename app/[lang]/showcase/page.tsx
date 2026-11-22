import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Showcase from "@/app/components/showcase/Showcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Showcase.meta" });
  return {
    title: t("title"),
    description: t("description"),
    // Test page: keep it out of search results
    robots: { index: false, follow: false },
  };
}

export default async function ShowcasePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  return <Showcase />;
}
