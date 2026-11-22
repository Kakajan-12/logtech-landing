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
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10 pt-6 md:pt-10 lg:pt-16 pb-6 lg:pb-5">
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
                  href="tel:+99371397739"
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
                <span className="leading-5">{t("address")}</span>
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

        <div className="mt-4 lg:mt-16 border-t border-white/30 pt-4 flex flex-col gap-2 lg:gap-4 md:flex-row md:items-center md:justify-between text-base lg:text-sm text-white">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:gap-x-4">
            <Link
              href={`/${lang}/privasypolicy`}
              className="whitespace-nowrap underline-offset-2 text-xs md:text-sm hover:underline"
            >
              {t("privacy")}
            </Link>
            <Link
              href={`/${lang}/cookies`}
              className="whitespace-nowrap underline-offset-2 text-xs md:text-sm hover:underline"
            >
              {t("cookies")}
            </Link>
          </nav>
          <div className="flex flex-col md:flex-row items-start gap-2 md:items-center lg:gap-5">
            <span className="whitespace-nowrap text-sm">
              © {year}, {t("rights")}
            </span>
            <Image
              src="/logo.svg"
              alt={tHeader("brand")}
              width={155}
              height={50}
              className="h-8 w-auto filter-[brightness(0)_invert(1)]"
              style={{ width: "auto" }}
            />
          </div>
        </div>
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 border-t border-[#2768FF] font-jost font-bold text-xs lg:text-base text-[#ACABAB] bg-linear-to-r from-[#0044E1] via-[#0075D6] to-[#0096CB]">
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
