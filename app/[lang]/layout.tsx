import type { Metadata } from "next";
import { Jost, Play } from "next/font/google";
import "./globals.css";
import { routing } from "@/app/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import favicon from "@/app/favicon.ico";

const jost = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jost-google",
  display: "swap",
});

const play = Play({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-play-google",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hebent Fleet ",
  description:
    "Monitor vehicles, optimize routes and reduce costs with our GPS fleet management platform.",
  icons: {
    icon: favicon.src,
  },
};
export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }
  setRequestLocale(lang);
  const messages = await getMessages();
  return (
    <html lang={lang} className={`${jost.variable} ${play.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={lang} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
