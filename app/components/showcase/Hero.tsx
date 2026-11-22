"use client";

import dynamic from "next/dynamic";
import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/app/i18n/navigation";
import { scrollToSection } from "@/lib/scrollToSection";

// three.js only loads in the browser and only on this page
const GlobeScene = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => null,
});

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const t = useTranslations("Showcase.hero");
  const tHeader = useTranslations("Header");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion() ?? false;
  const words = t("title").split(" ");

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[calc(100svh-7rem)] items-center overflow-hidden bg-[#020b24] text-white"
    >
      {/* glow behind the globe */}
      <div
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 size-[44rem] -translate-y-1/2 rounded-full bg-brand/30 blur-[140px]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-40 lg:left-[35%] lg:opacity-100"
        role="img"
        aria-label={t("globeLabel")}
      >
        <GlobeScene active={inView} animate={!reduce} />
      </div>

      <div className="container relative mx-auto px-5 py-20 lg:px-10">
        <div className="max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {t("eyebrow")}
          </motion.span>

          <h1 className="mt-6 font-play text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
            {words.map((word, i) => (
              <Fragment key={i}>
                <span className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.8, ease }}
                  >
                    {word}
                  </motion.span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease }}
            className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/#contacts"
              onClick={(e) => {
                if (scrollToSection("contacts")) e.preventDefault();
              }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_40px_-8px] shadow-brand transition-transform hover:scale-[1.03]"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{tHeader("getDemo")}</span>
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("sc-telematics")}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-12 hidden text-xs uppercase tracking-[0.25em] text-white/40 lg:block"
          >
            {t("hint")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
