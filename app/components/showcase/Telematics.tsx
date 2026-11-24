"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import {
  Activity,
  DoorClosed,
  Fuel,
  Gauge,
  Satellite,
  Thermometer,
  type LucideIcon,
} from "lucide-react";
import { CALLOUTS, type CalloutEls, type CalloutKey } from "./truckCallouts";

const TruckScene = dynamic(() => import("./TruckScene"), {
  ssr: false,
  loading: () => null,
});

const ICONS: Record<CalloutKey, LucideIcon> = {
  gps: Satellite,
  speed: Gauge,
  fuel: Fuel,
  engine: Activity,
  temp: Thermometer,
  doors: DoorClosed,
};

export default function Telematics() {
  const t = useTranslations("Showcase.truck");
  const section = useRef<HTMLElement>(null);
  const calloutsRef = useRef<CalloutEls[]>(CALLOUTS.map(() => ({})));
  const inView = useInView(section);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // phones: one card for the latest callout that has appeared
  const [latest, setLatest] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = CALLOUTS.findLastIndex((c) => p >= c.at);
    if (i !== latest) setLatest(i);
  });
  const current = latest >= 0 ? CALLOUTS[latest] : null;
  const CurrentIcon = current ? ICONS[current.key] : null;

  return (
    <section
      id="sc-telematics"
      ref={section}
      className="relative h-[320vh] bg-[#02150c] text-white"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-28">
        <div className="container mx-auto grid flex-1 items-center gap-2 px-5 pb-4 sm:gap-6 sm:pb-10 lg:grid-cols-[1fr_1.6fr] lg:px-10">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-play text-2xl font-bold leading-tight sm:mt-4 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 hidden max-w-md text-sm leading-relaxed text-white/60 sm:block sm:text-base">
              {t("text")}
            </p>

            {/* sensor list: each item lights up when its callout appears on the truck */}
            <ul className="mt-8 hidden max-w-md grid-cols-2 gap-x-6 gap-y-3 lg:grid">
              {CALLOUTS.map((c, i) => {
                const Icon = ICONS[c.key];
                const on = i <= latest;
                return (
                  <li
                    key={c.key}
                    className={`flex items-center gap-2.5 text-sm transition-colors duration-500 ${
                      on ? "text-white" : "text-white/30"
                    }`}
                  >
                    <span
                      className={`inline-flex size-7 items-center justify-center rounded-lg transition-colors duration-500 ${
                        on ? "bg-brand/30 text-[#6fdca0]" : "bg-white/5 text-white/30"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    {t(c.key)}
                  </li>
                );
              })}
            </ul>

            {/* phones: the latest reading as a single card */}
            <div className="mt-5 h-[76px] max-w-md lg:hidden" aria-hidden>
              <AnimatePresence mode="wait">
                {current && CurrentIcon && (
                  <motion.div
                    key={current.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md"
                  >
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#38e0a0] text-xs font-bold text-[#02150c]">
                      {latest + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/50">
                        <CurrentIcon className="size-3.5 text-emerald-400" aria-hidden />
                        {t(current.key)}
                      </div>
                      <p className="mt-0.5 font-play text-xl font-bold">{t(`${current.key}Value`)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* the readings as text for screen readers */}
            <ul className="sr-only">
              {CALLOUTS.map((c) => (
                <li key={c.key}>
                  {t(c.key)}: {t(`${c.key}Value`)}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative h-[38vh] min-h-56 lg:h-full"
            role="img"
            aria-label={t("truckLabel")}
          >
            <div
              className="pointer-events-none absolute inset-0 m-auto size-3/4 rounded-full bg-brand/25 blur-[100px]"
              aria-hidden
            />
            {/* soft edges so the road fades out instead of being cut by the canvas */}
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_75%)]">
              <TruckScene
                progress={scrollYProgress}
                active={inView}
                animate={!reduce}
                calloutsRef={calloutsRef}
              />
            </div>

            {/* callouts: positioned on parts of the model by TruckScene every frame */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <svg className="absolute inset-0 hidden size-full overflow-visible lg:block">
                {CALLOUTS.map((c, i) => (
                  <polyline
                    key={c.key}
                    ref={(el) => {
                      calloutsRef.current[i].line = el;
                    }}
                    fill="none"
                    stroke="#6fdca0"
                    strokeOpacity={0.75}
                    strokeWidth={1.2}
                    style={{ opacity: 0 }}
                  />
                ))}
              </svg>
              {CALLOUTS.map((c, i) => {
                const Icon = ICONS[c.key];
                return (
                  <div key={c.key}>
                    <div
                      ref={(el) => {
                        calloutsRef.current[i].dot = el;
                      }}
                      className="absolute top-0 left-0 opacity-0"
                    >
                      <span className="absolute -translate-x-1/2 -translate-y-1/2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-[#38e0a0]/60" />
                        <span
                          className={`relative flex items-center justify-center rounded-full bg-[#38e0a0] font-bold text-[#02150c] ring-4 ring-[#38e0a0]/25 ${
                            i === latest ? "size-5 text-[10px] lg:size-3" : "size-3 text-[0px]"
                          }`}
                        >
                          <span className="lg:hidden">{i === latest ? i + 1 : ""}</span>
                        </span>
                      </span>
                    </div>
                    <div
                      ref={(el) => {
                        calloutsRef.current[i].label = el;
                      }}
                      className="absolute top-0 left-0 hidden whitespace-nowrap rounded-xl border border-[#6fdca0]/25 bg-[#04331D]/80 px-3 py-2 opacity-0 shadow-lg shadow-black/30 backdrop-blur-md lg:block"
                    >
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/55">
                        <Icon className="size-3.5 text-[#6fdca0]" aria-hidden />
                        {t(c.key)}
                      </div>
                      <p className="mt-0.5 font-play text-lg leading-tight font-bold text-white">
                        {t(`${c.key}Value`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-5 pb-5 sm:pb-8 lg:px-10">
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white/40">
            <span>{t("hint")}</span>
            <div className="h-px flex-1 bg-white/10">
              <motion.div style={{ width: bar }} className="h-px bg-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
