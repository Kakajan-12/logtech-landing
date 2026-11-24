"use client";

import Image from "next/image";
import { useTranslations, useLocale, useMessages } from "next-intl";
import { Link, usePathname } from "@/app/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Check, ChevronDown, Globe, Mail, Menu, Phone, X } from "lucide-react";
import { routing } from "@/app/i18n/routing";
import { scrollToSection } from "@/lib/scrollToSection";
import { useDemoModal } from "@/app/components/demo/DemoModal";

const PHONE = "+993 71 397739";
const PHONE_HREF = "tel:+99371397739";
const EMAIL = "info@hebent.tech";
const DEMO_BUTTON =
  "inline-flex items-center justify-center rounded-full bg-[linear-gradient(177deg,#0F833F_0.23%,#08945A_96.91%)] font-semibold text-white shadow-md shadow-brand/25 transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30";

export default function Header() {
  const t = useTranslations("Header");
  const messages = useMessages() as {
    Header?: { nav?: Record<string, string> };
  };
  const navKeys = Object.keys(messages.Header?.nav ?? {});
  const locale = useLocale();
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  // colour scheme of the section right under the header ("dark" sections are marked)
  const [overDark, setOverDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const demo = useDemoModal();
  const openDemo = () => {
    setMenuOpen(false);
    setLangOpen(false);
    demo.open();
  };

  // thin brand-coloured reading progress line under the header
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

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
  }, [locale, pathname]);

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

  // Compact header once the page is scrolled, and match the section underneath:
  // sections with data-header-theme="dark" switch the header to its dark look.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
      const probe = (headerRef.current?.getBoundingClientRect().bottom ?? 0) + 1;
      const dark = [...document.querySelectorAll<HTMLElement>("[data-header-theme=dark]")].some(
        (el) => {
          const r = el.getBoundingClientRect();
          return r.top <= probe && r.bottom > probe;
        },
      );
      setOverDark(dark);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
  // the open mobile menu is a white panel, so keep the bar light with it
  const dark = overDark && !menuOpen;

  // Scroll-spy: highlight the menu item of the section in the middle of the screen
  useEffect(() => {
    const sections = navKeys
      .map((key) => document.getElementById(key))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting
            ? visible.add(e.target.id)
            : visible.delete(e.target.id),
        );
        setActive(navKeys.find((k) => visible.has(k)) ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // navKeys comes from static messages; re-run only when the page changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!langOpen && !menuOpen) return;
    const close = (e: PointerEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setLangOpen(false);
      setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen, menuOpen]);

  const localeSwitchHref = pathname || "/";

  // On a page that has the section: smooth-scroll in place.
  // Otherwise (e.g. /cookies): let the Link navigate to `/#id` on the home page.
  const goToSection = (id: string) => (e: React.MouseEvent) => {
    setMenuOpen(false);
    setLangOpen(false);
    if (scrollToSection(id)) e.preventDefault();
  };

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
    <header
      ref={headerRef}
      data-theme={dark ? "dark" : "light"}
      className={`sticky top-0 z-50 transition-transform duration-300 ${
        scrolled ? "-translate-y-9" : ""
      }`}
    >
      {/* Contact strip: slides away with the header offset once you scroll */}
      <div className="h-9 bg-[#04331D] font-jost text-xs text-white/75">
        <div className="container mx-auto flex h-full items-center justify-between gap-4 px-5 lg:px-10">
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="size-3.5 shrink-0" aria-hidden />
              <span className="tabular-nums">{PHONE}</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="size-3.5 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">{EMAIL}</span>
            </a>
          </div>
          <span className="hidden items-center gap-2 md:inline-flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            {t("status")}
          </span>
        </div>
      </div>

      <div
        className={`relative border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-500 ${
          dark
            ? scrolled
              ? "border-white/10 bg-[#02150c]/75 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
              : "border-transparent bg-[#02150c]"
            : scrolled || menuOpen
              ? "border-black/5 bg-white/95 shadow-[0_8px_30px_-12px_rgba(4,51,29,0.25)]"
              : "border-transparent bg-white"
        }`}
      >
        <div
          className={`container mx-auto flex items-center justify-between gap-4 px-5 transition-[height] duration-300 lg:px-10 ${
            scrolled ? "h-16" : "h-18"
          }`}
        >
          <Link
            href="/"
            scroll={false}
            className="flex shrink-0 items-center"
            onClick={scrollToHomeTop}
            aria-label={t("brand")}
          >
            <Image
              src="/logo.svg"
              alt=""
              width={155}
              height={50}
              className={`h-9 w-auto transition-[filter] duration-500 sm:h-10 ${
                dark ? "brightness-0 invert" : ""
              }`}
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navKeys.map((key) => {
              const on = active === key;
              return (
                <Link
                  key={key}
                  href={`/#${key}`}
                  aria-current={on ? "location" : undefined}
                  className={`group relative rounded-full px-4 py-2 font-jost text-[15px] font-medium transition-colors duration-300 ${
                    dark
                      ? on
                        ? "text-[#6fdca0]"
                        : "text-white/75 hover:text-white"
                      : on
                        ? "text-brand"
                        : "text-neutral-800 hover:text-brand"
                  }`}
                  onClick={goToSection(key)}
                >
                  {t(`nav.${key}`)}
                  {/* faint underline on hover; the active one slides between items */}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100 ${
                      dark ? "bg-white/30" : "bg-brand/30"
                    }`}
                    aria-hidden
                  />
                  {on && (
                    <motion.span
                      layoutId="nav-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full ${
                        dark ? "bg-[#6fdca0]" : "bg-brand"
                      }`}
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={langRef} className="relative">
              <button
                type="button"
                className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 font-jost text-sm font-bold transition-colors duration-300 ${
                  dark
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-neutral-800 hover:bg-brand/10 hover:text-brand"
                }`}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                aria-label={t("language")}
                onClick={() => {
                  setMenuOpen(false);
                  setLangOpen((o) => !o);
                }}
              >
                <Globe className="size-4.5 shrink-0" aria-hidden />
                {t(`langNames.${locale}`)}
                <ChevronDown
                  className={`size-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-100 mt-2 w-44 origin-top-right overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-xl"
                    role="listbox"
                    aria-label={t("language")}
                  >
                    {routing.locales.map((l) => (
                      <li key={l} role="option" aria-selected={locale === l}>
                        <Link
                          href={localeSwitchHref}
                          locale={l}
                          scroll={false}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                            locale === l
                              ? "bg-brand/10 text-brand"
                              : "text-neutral-800 hover:bg-neutral-100"
                          }`}
                          onClick={() => setLangOpen(false)}
                        >
                          <span>
                            {t(`langFull.${l}`)}
                            <span className="ml-2 text-xs font-bold text-neutral-400">
                              {t(`langNames.${l}`)}
                            </span>
                          </span>
                          {locale === l && (
                            <Check className="size-4" aria-hidden />
                          )}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              className={`${DEMO_BUTTON} hidden h-10 px-6 text-sm sm:inline-flex lg:text-base`}
              onClick={openDemo}
            >
              {t("getDemo")}
            </button>

            <button
              type="button"
              className={`inline-flex size-10 items-center justify-center rounded-full transition-colors duration-300 lg:hidden ${
                dark ? "text-white hover:bg-white/10" : "text-neutral-900 hover:bg-brand/10"
              }`}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              onClick={() => {
                setLangOpen(false);
                setMenuOpen((o) => !o);
              }}
            >
              {menuOpen ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[linear-gradient(90deg,#0F833F,#38e0a0)]"
          style={{ scaleX: progress }}
          aria-hidden
        />
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label={t("closeMenu")}
              tabIndex={-1}
              // absolute, not fixed: the header's translate would make "fixed" header-relative
              className="absolute inset-x-0 top-full -z-10 h-svh bg-[#02150c]/40 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full border-b border-black/5 bg-white shadow-xl lg:hidden"
            >
              <nav
                className="container mx-auto flex flex-col px-5 pt-3 pb-2"
                aria-label="Main mobile"
              >
                {navKeys.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.2 }}
                  >
                    <Link
                      href={`/#${key}`}
                      aria-current={active === key ? "location" : undefined}
                      className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-bold transition-colors ${
                        active === key
                          ? "bg-brand/10 text-brand"
                          : "text-neutral-900 hover:bg-neutral-100"
                      }`}
                      onClick={goToSection(key)}
                    >
                      {t(`nav.${key}`)}
                      <span className="text-xs font-semibold text-neutral-300 tabular-nums">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="container mx-auto flex flex-col gap-3 border-t border-neutral-100 px-5 pt-4 pb-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2 px-3 text-sm text-neutral-600">
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center gap-2 hover:text-brand"
                  >
                    <Phone className="size-4" aria-hidden />
                    <span className="tabular-nums">{PHONE}</span>
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center gap-2 hover:text-brand"
                  >
                    <Mail className="size-4" aria-hidden />
                    {EMAIL}
                  </a>
                </div>
                <button
                  type="button"
                  className={`${DEMO_BUTTON} h-12 w-full text-base`}
                  onClick={openDemo}
                >
                  {t("getDemo")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
