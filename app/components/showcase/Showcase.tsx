"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import {
  Activity,
  Bell,
  Cpu,
  Layers,
  Rocket,
  FileBarChart,
  Fuel,
  MapPinned,
  type LucideIcon,
} from "lucide-react";
import Hero from "./Hero";
import { useDemoModal } from "../demo/DemoModal";
import Telematics from "./Telematics";
import IndustriesScroll from "./IndustriesScroll";
import { industries } from "../industryData";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Stats: numbers count up when they scroll into view ---------- */

function Counter({
  to,
  delay,
  start,
  onProgress,
}: {
  to: number;
  delay: number;
  start: boolean;
  onProgress: (v: number) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!start || !el) return;
    if (reduce) {
      el.textContent = String(to);
      onProgress(1);
      return;
    }
    const controls = animate(0, to, {
      delay,
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
        onProgress(v / to);
      },
    });
    return () => controls.stop();
  }, [start, reduce, to, delay, onProgress]);

  return (
    // the final value reserves the width, so digits don't jump while counting
    <span className="inline-grid tabular-nums" aria-hidden>
      <span className="invisible col-start-1 row-start-1">{to}</span>
      <span ref={ref} className="col-start-1 row-start-1 text-right">
        0
      </span>
    </span>
  );
}

type Stat = {
  key: "brands" | "industries" | "monitoring" | "steps";
  Icon: LucideIcon;
  value: number;
  suffix?: string;
  /** shown as is with a live dot instead of counting (24/7 is not a quantity) */
  live?: string;
};

const stats: Stat[] = [
  { key: "brands", Icon: Cpu, value: 40, suffix: "+" },
  { key: "industries", Icon: Layers, value: industries.length },
  { key: "monitoring", Icon: Activity, value: 24, live: "24/7" },
  { key: "steps", Icon: Rocket, value: 3 },
];

function StatItem({ stat, index, start }: { stat: Stat; index: number; start: boolean }) {
  const t = useTranslations("Showcase.stats");
  const fill = useMotionValue(0);
  const onProgress = useCallback((v: number) => fill.set(v), [fill]);
  const { Icon, value, suffix, live } = stat;

  useEffect(() => {
    if (live && start) animate(fill, 1, { delay: index * 0.12, duration: 1.8, ease: [0.16, 1, 0.3, 1] });
  }, [live, start, fill, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={start ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: index * 0.12, duration: 0.7, ease }}
      className={`group relative flex flex-col items-center border-white/10 px-4 py-8 text-center transition-colors hover:bg-white/[0.04] sm:px-6 lg:py-10 ${
        index % 2 ? "border-l" : ""
      } ${index < 2 ? "border-b lg:border-b-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}
    >
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand/20 text-[#6fdca0] ring-1 ring-[#6fdca0]/20 transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
      </span>
      <p
        className="mt-5 font-play text-4xl font-bold leading-none lg:text-5xl"
        aria-label={`${live ?? `${value}${suffix ?? ""}`} ${t(stat.key)}`}
      >
        <span className="bg-linear-to-b from-white to-[#8be8b6] bg-clip-text text-transparent">
          {live ? (
            <span aria-hidden className="relative">
              {/* dot hangs left of the text so "24/7" stays centred like the other numbers */}
              <span className="absolute top-1/2 -left-5 flex size-2.5 -translate-y-1/2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
              {live}
            </span>
          ) : (
            <>
              <Counter to={value} delay={index * 0.12} start={start} onProgress={onProgress} />
              {suffix && <span aria-hidden>{suffix}</span>}
            </>
          )}
        </span>
      </p>
      <p className="mt-3 max-w-[14rem] text-sm leading-snug text-white/60 sm:text-[15px]" aria-hidden>
        {t(stat.key)}
      </p>
      {/* progress line that fills while the number counts up */}
      <span className="mt-5 h-0.5 w-16 overflow-hidden rounded-full bg-white/10" aria-hidden>
        <motion.span
          className="block h-full origin-left rounded-full bg-[linear-gradient(90deg,#0F833F,#38e0a0)]"
          style={{ scaleX: fill }}
        />
      </span>
    </motion.div>
  );
}

function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const start = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section data-header-theme="dark" className="relative z-10 bg-[#02150c]">
      <div className="container mx-auto px-5 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
          className="relative -mt-14 overflow-hidden rounded-3xl border border-white/10 bg-[#04331D]/60 shadow-[0_30px_80px_-30px_rgba(56,224,160,0.35)] backdrop-blur-xl"
        >
          {/* soft light sweeping across the panel */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-[#38e0a0]/15 blur-3xl"
            aria-hidden
          />
          <div className="relative grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <StatItem key={stat.key} stat={stat} index={i} start={start} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Features: cards tilt in 3D towards the cursor ---------- */

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 200, damping: 18 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), spring);

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full rounded-3xl border border-white bg-white p-8 shadow-lg shadow-brand/5"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(15,131,63,0.12), transparent 45%)",
        }}
        aria-hidden
      />
      {children}
    </motion.div>
  );
}

const features: { key: string; Icon: LucideIcon }[] = [
  { key: "tracking", Icon: MapPinned },
  { key: "fuel", Icon: Fuel },
  { key: "alerts", Icon: Bell },
  { key: "reports", Icon: FileBarChart },
];

function Features() {
  const t = useTranslations("Showcase.features");
  return (
    <section
      id="benefits"
      className="scroll-mt-16 bg-light-green py-24 lg:py-32"
    >
      <div className="container mx-auto px-5 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center font-play text-3xl font-bold text-[#04331D] sm:text-4xl lg:text-5xl"
        >
          {t("title")}
        </motion.h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease }}
            >
              <TiltCard>
                <div style={{ transform: "translateZ(40px)" }}>
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
                    <Icon className="size-7" strokeWidth={1.6} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-[#04331D]">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {t(`items.${key}.text`)}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA with drifting light blobs ---------- */

function Cta() {
  const t = useTranslations("Showcase.cta");
  const tHeader = useTranslations("Header");
  const demo = useDemoModal();
  return (
    <section
      data-header-theme="dark"
      className="relative isolate overflow-hidden bg-[#02150c] py-28 text-white lg:py-40"
    >
      <motion.div
        className="absolute -left-32 top-0 -z-10 size-[32rem] rounded-full bg-brand/50 blur-[120px]"
        animate={{ x: [0, 120, -40, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute -right-32 bottom-0 -z-10 size-[28rem] rounded-full bg-emerald-500/30 blur-[120px]"
        animate={{ x: [0, -100, 40, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <div className="container mx-auto px-5 text-center lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-3xl bg-linear-to-r from-white via-[#b5ecce] to-white bg-clip-text font-play text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.15, duration: 0.8, ease }}
          className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg"
        >
          {t("text")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="mt-10"
        >
          <button
            type="button"
            onClick={() => demo.open()}
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-brand shadow-[0_0_60px_-10px] shadow-brand transition-transform hover:scale-105"
          >
            {tHeader("getDemo")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/** The landing page; `children` are the classic sections placed before the final CTA. */
export default function Showcase({ children }: { children?: ReactNode }) {
  // reducedMotion="user": transform animations are skipped for people who
  // asked their OS for less motion; the 3D scenes check the same setting.
  return (
    <MotionConfig reducedMotion="user">
      <main className="flex flex-1 flex-col">
        <Hero />
        <Stats />
        <Telematics />
        <Features />
        <IndustriesScroll />
        {children}
        <Cta />
      </main>
    </MotionConfig>
  );
}
