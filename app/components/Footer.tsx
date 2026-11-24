import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { useMessages, useTranslations } from "next-intl";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import { Link } from "@/app/i18n/navigation";
import footerBg from "../../public/bg-footer1.svg";
import { BackToTop, FooterCta } from "./FooterActions";

const year = new Date().getFullYear();
const PHONE = "+993 71 397739";
const EMAIL = "info@hebent.tech";

const social = [
  { name: "WeChat", href: "wechat://davud3108", Icon: IoLogoWechat },
  { name: "Telegram", href: "https://t.me/davud3108", Icon: FaTelegramPlane },
  { name: "WhatsApp", href: "https://wa.me/99365634115", Icon: FaWhatsapp },
] as const;

const ICON_BOX =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#6fdca0] ring-1 ring-white/10 transition-colors";

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold tracking-[0.2em] text-[#6fdca0] uppercase">
      {children}
    </h3>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");
  const tPartner = useTranslations("BePartner");
  const messages = useMessages() as {
    Header?: { nav?: Record<string, string> };
  };
  const navKeys = Object.keys(messages.Header?.nav ?? {});
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    t("address"),
  )}`;

  return (
    <footer
      id="contacts"
      data-header-theme="dark"
      className="relative isolate mt-auto scroll-mt-16 overflow-hidden bg-[#02150c] text-white"
    >
      {/* texture + soft brand glow + a thin light line on top */}
      <div
        className="footer-bg-pattern"
        style={{ "--footer-bg-url": `url(${footerBg.src})` } as CSSProperties}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-brand/30 blur-[120px]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#38e0a0]/50 to-transparent"
        aria-hidden
      />

      <div className="relative container mx-auto px-5 pt-16 pb-8 lg:px-10 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.2fr_1.3fr] lg:gap-10">
          {/* brand */}
          <div>
            <Image
              src="/logo.svg"
              alt={tHeader("brand")}
              width={155}
              height={50}
              className="h-12 w-auto brightness-0 invert"
              style={{ width: "auto" }}
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {t("tagline")}
            </p>
            <ul className="mt-6 flex gap-3" aria-label={t("socialLabel")}>
              {social.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-[transform,background-color,color,border-color] hover:-translate-y-0.5 hover:border-transparent hover:bg-[#38e0a0] hover:text-[#02150c]"
                  >
                    <Icon className="size-[18px]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* sections */}
          <nav aria-label={t("navTitle")}>
            <ColumnTitle>{t("navTitle")}</ColumnTitle>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={`/#${key}`}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {tHeader(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* contacts */}
          <div>
            <ColumnTitle>{t("contactsTitle")}</ColumnTitle>
            <ul className="mt-5 flex flex-col gap-4 text-sm">
              <li>
                <a
                  href="tel:+99371397739"
                  className="group inline-flex items-center gap-3 text-white/85 transition-colors hover:text-white"
                >
                  <span className={`${ICON_BOX} group-hover:bg-brand/40`}>
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <span className="tabular-nums">{PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center gap-3 text-white/85 transition-colors hover:text-white"
                >
                  <span className={`${ICON_BOX} group-hover:bg-brand/40`}>
                    <Mail className="size-4" aria-hidden />
                  </span>
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/85">
                <span className={ICON_BOX}>
                  <MapPin className="size-4" aria-hidden />
                </span>
                <span className="leading-relaxed">
                  {t("address")}
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex w-fit items-center gap-1 text-xs font-semibold text-[#6fdca0] hover:underline"
                  >
                    {t("mapLink")}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                </span>
              </li>
            </ul>
          </div>

          {/* call to action */}
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(15,131,63,0.35),rgba(4,51,29,0.2))] p-6 sm:col-span-2 lg:col-span-1">
            <p className="font-play text-2xl font-bold">{t("ctaTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              {t("ctaText")}
            </p>
            <FooterCta
              demoLabel={tHeader("getDemo")}
              partnerLabel={tPartner("cta")}
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Hebent Fleet. {t("rights")}
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label={t("legal")}>
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              {t("privacy")}
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-white">
              {t("cookies")}
            </Link>
          </nav>
          <BackToTop label={t("backToTop")} />
        </div>
      </div>
    </footer>
  );
}
