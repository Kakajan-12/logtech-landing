"use client";

import Image from "next/image";
import { useTranslations, useLocale, useMessages } from "next-intl";
import { Link, usePathname } from "@/app/i18n/navigation";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { routing } from "@/app/i18n/routing";
import { CiGlobe } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaXmark } from "react-icons/fa6";

export default function Header() {
  const t = useTranslations("Header");
  const messages = useMessages() as {
    Header?: { nav?: Record<string, string> };
  };
  const navKeys = Object.keys(messages.Header?.nav ?? {});
  const locale = useLocale();
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setHash(window.location.hash);
    });
    return () => cancelAnimationFrame(id);
  }, [locale]);

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: PointerEvent) => {
      if (!langRef.current?.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  const localeSwitchHref = pathname || "/";

  const isActive = (id: string) => hash === `#${id}`;

  const langShort = (l: string) =>
    l === "ru" ? "RU" : l === "tk" ? "TM" : l.toUpperCase();

  const scrollToHomeTop = () => {
    setMenuOpen(false);
    setHash("");
    const { pathname: path, search } = window.location;
    window.history.replaceState(null, "", path + search);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-light-blue/60 shadow-sm">
      <div className="contacts flex items-center justify-between bg-white text-sm text-[#4D4D4D] font-nexa">
        <div className="flex w-full items-center justify-between gap-2 py-3 container mx-auto px-5 lg:px-10">
          <div className="flex items-center gap-x-5 md:gap-x-9 text-xs ">
            <a
              href={`tel:+993 71 397739`}
              className="inline-flex items-center gap-1 text-[#4D4D4D] leading-none hover:text-[#0044E1]"
            >
              <HiOutlinePhone
                className="block size-4 shrink-0 text-current"
                aria-hidden
              />
              <span className="shrink-0 leading-none tabular-nums pt-1">
                +993 71 397739
              </span>
            </a>
            <a
              href={`mailto:info@hebent.tech`}
              className="inline-flex items-center gap-1 text-[#4D4D4D] leading-none hover:text-[#0044E1]"
            >
              <HiOutlineMail
                className="block size-4 shrink-0 text-current"
                aria-hidden
              />
              <span className="leading-none whitespace-nowrap pt-1">
                info@hebent.tech
              </span>
            </a>
          </div>
          <div ref={langRef} className="relative z-70 shrink-0 text-black">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md font-bold font-nexa py-2 px-2 transition-colors hover:bg-neutral-100"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label={t("language")}
              onClick={() => {
                setMenuOpen(false);
                setLangOpen((o) => !o);
              }}
            >
              <CiGlobe className="size-5 shrink-0" aria-hidden />
              <span className="font-vox text-xs font-semibold tracking-wide sm:hidden">
                {langShort(locale)}
              </span>
              <span className="hidden font-nexa text-sm sm:inline">
                {t(`langNames.${locale}`)}
              </span>
            </button>
            {langOpen ? (
              <ul
                className="absolute right-0 top-full z-100 mt-1.5 w-13 overflow-hidden rounded border border-neutral-800/20 bg-white/40 backdrop-blur-sm py-0 shadow-xl font-bold"
                role="listbox"
                aria-label={t("language")}
              >
                {routing.locales
                  .filter((l) => l !== locale)
                  .map((l, i) => (
                    <li
                      key={l}
                      role="option"
                      aria-selected={locale === l}
                      className={
                        i > 0 ? "border-t border-neutral-200" : undefined
                      }
                    >
                      <Link
                        href={localeSwitchHref}
                        locale={l}
                        scroll={false}
                        className={`block px-4 py-3 text-center text-sm sm:px-3 sm:py-2 ${
                          locale === l
                            ? "bg-blue-50 text-[#0044E1]"
                            : "text-neutral-800 hover:bg-neutral-50 hover:text-[#0044E1]"
                        }`}
                        onClick={() => setLangOpen(false)}
                      >
                        <span className="sm:hidden">{langShort(l)}</span>
                        <span className="hidden sm:inline">
                          {t(`langNames.${l}`)}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 bg-white/20 backdrop-blur-sm">
        <div className="container  mx-auto flex items-center justify-between gap-4 px-5 lg:px-10">
          <Link
            href="/"
            scroll={false}
            className="flex shrink-0 items-center gap-3"
            onClick={scrollToHomeTop}
          >
            <Image
              src="/logo.svg"
              alt=""
              width={155}
              height={50}
              className="h-9 w-auto sm:h-10"
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-11 lg:flex" aria-label="Main">
            {navKeys.map((key) => (
              <Link
                key={key}
                href={`#${key}`}
                scroll={false}
                className={`font-nexa text-base font-bold transition-colors ${
                  isActive(key) ? "text-brand" : "text-black hover:text-brand"
                }`}
                onClick={() => setHash(`#${key}`)}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-3">
            <Link
              href="#"
              scroll={false}
              className="rounded-sm bg-brand w-30 items-center justify-center text-center py-2.5 text-xs lg:text-base font-bold text-white transition-opacity hover:opacity-90 lg:inline-flex"
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              {t("getDemo")}
            </Link>

            <button
              type="button"
              className="inline-flex size-5 items-center justify-center rounded-lg text-[#1C1B1F] lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              onClick={() =>
                setMenuOpen((o) => {
                  const next = !o;
                  if (next) setLangOpen(false);
                  return next;
                })
              }
            >
              <span className="sr-only">
                {menuOpen ? t("closeMenu") : t("openMenu")}
              </span>
              {menuOpen ? (
                <span className="text-xl leading-none">
                  <FaXmark className="size-4" aria-hidden />
                </span>
              ) : (
                <RxHamburgerMenu className="size-4" aria-hidden />
              )}
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-12 z-100 overflow-hidden border-l border-b border-white/30 bg-white/50 backdrop-blur-sm backdrop-saturate-200 shadow-sm lg:hidden">
                <nav
                  className="flex flex-col gap-3 pt-3"
                  aria-label="Main mobile "
                >
                  {navKeys.map((key) => (
                    <Link
                      key={key}
                      href={`/#${key}`}
                      scroll={false}
                      className={`mt-1 px-3 py-1 text-sm font-semibold transition-colors last:border-0  ${
                        isActive(key)
                          ? "text-brand bg-brand/10"
                          : "text-neutral-900 hover:bg-white/40"
                      }`}
                      onClick={() => {
                        setMenuOpen(false);
                        setHash(`#${key}`);
                      }}
                    >
                      {t(`nav.${key}`)}
                    </Link>
                  ))}
                </nav>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
