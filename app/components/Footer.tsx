import type { CSSProperties } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import logo from "../../public/logoIcon.svg";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import footerBg from "../../public/bg-footer1.svg";
import { FiMapPin } from "react-icons/fi";
import Link from "next/link";

const year = new Date().getFullYear();

export default function Footer() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");
  const lang = useLocale();
  const social = [
    {
      name: "Wechat",
      href: "wechat://davud3108",
      Icon: IoLogoWechat,
    },
    { name: "Telegram", href: "https://t.me/davud3108", Icon: FaTelegramPlane },
    { name: "WhatsApp", href: "https://wa.me/99365634115", Icon: FaWhatsapp },
  ] as const;
  return (
    <footer
      id="contacts"
      className="relative isolate mt-auto overflow-hidden text-white scroll-mt-32 md:scroll-mt-36"
    >
      <div
        className="absolute inset-0 bg-linear-to-r from-[#0044E1] via-[#0075D6] to-[#0096CB]"
        aria-hidden
      />
      <div
        className="footer-bg-pattern"
        style={
          {
            "--footer-bg-url": `url(${footerBg.src})`,
          } as CSSProperties
        }
        aria-hidden
      />
      <div className="relative z-10 container mx-auto px-5 lg:px-10 py-6 md:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="logo flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt={tHeader("brand")}
                width={155}
                height={50}
                className="h-10 lg:h-18 w-auto filter-[brightness(0)_invert(1)]"
                style={{ width: "auto" }}
              />
            </div>
            <p className="max-w-2xs text-xs leading-relaxed text-white sm:text-sm">
              {t("tagline")}
            </p>

            <ul
              className="hidden sm:flex flex-wrap gap-3"
              aria-label={t("socialLabel")}
            >
              {social.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-6 md:size-10 items-center justify-center rounded-full bg-white text-[#0044E1] transition-transform hover:scale-105 hover:bg-white/95"
                    aria-label={name}
                  >
                    <Icon className="size-4 md:size-7" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="contacts mr-8 font-bold flex flex-col gap-3">
            <h3 className="text-sm md:text-base tracking-wide ">
              {t("contactsTitle")}
            </h3>
            <ul className="flex flex-col gap-3 text-sm md:text-base font-medium">
              <li>
                <a
                  href={`tel:+993 71 397739`}
                  className="inline-flex items-start gap-3 text-white/95 transition-opacity hover:opacity-90"
                >
                  <HiOutlinePhone className="size-4 shrink-0" aria-hidden />
                  <span className="tabular-nums leading-none mt-1">
                    +993 71 397739
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:info@hebent.tech`}
                  className="inline-flex items-start gap-3 leading-none text-white transition-opacity hover:opacity-90"
                >
                  <HiOutlineMail className="size-4 shrink-0" aria-hidden />
                  <span className="leading-none mt-1">info@hebent.tech</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-white/95">
                <FiMapPin className="size-4 shrink-0" aria-hidden />
                <span className="leading-none">{t("address")}</span>
              </li>
            </ul>
            <ul
              className="flex sm:hidden flex-wrap gap-3 items-center"
              aria-label={t("socialLabel")}
            >
              {social.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-6 md:size-12 items-center justify-center rounded-full bg-white text-[#0044E1] transition-transform hover:scale-105 hover:bg-white/95"
                    aria-label={name}
                  >
                    <Icon className="size-4 md:size-12" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full bg-linear-to-r from-[#0044E1] via-[#0075D6] to-[#0096CB] px-5 py-2 text-center text-xs text-white/60 lg:px-10">
        <div className="w-full flex flex-wrap items-center justify-center gap-1">
          <span className="whitespace-nowrap">{t("rights")} | </span>
          <Link
            href={`/${lang}/privasypolicy`}
            className="underline-offset-2 hover:underline whitespace-nowrap"
          >
            {t("privacy")} |
          </Link>
          <Link
            href={`/${lang}/cookies`}
            className="underline-offset-2 hover:underline whitespace-nowrap"
          >
            Cookies |
          </Link>
          <span className="whitespace-nowrap"> Powered by </span>
          <div className="flex items-center">
            <Image
              src="/logoIcon.svg"
              alt="HEBENT TECHNOLOGY"
              width={24}
              height={24}
              className="inline-block mx-1 shrink-0 brightness-0 invert logo-spin motion-reduce:animate-none"
            />
            <span className="text-white whitespace-nowrap">
              HEBENT TECHNOLOGY
            </span>
          </div>
        </div>
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 border-t border-[#2768FF] font-nexa font-bold text-xs lg:text-base text-[#ACABAB] bg-linear-to-r from-[#0044E1] via-[#0075D6] to-[#0096CB]">
        <div className="container mx-auto py-3 px-5 lg:px-10 flex items-center gap-2">
          <span className="leading-none pt-1">{year}</span>
          <p className="flex items-center gap-1">
            <Image
              src={logo}
              alt="logo"
              width={25}
              height={25}
              className="w-6 h-6 brightness-0 invert"
            />
            <span className="pt-1">Hebent Technology</span>
          </p>
          <span className="leading-none pt-1">{t("copyright")}</span>
        </div>
      </div> */}
    </footer>
  );
}
