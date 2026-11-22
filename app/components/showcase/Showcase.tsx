"use client";

import { useEffect, useRef, type ReactNode } from "react";
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
import { Bell, FileBarChart, Fuel, MapPinned, type LucideIcon } from "lucide-react";
import { Link } from "@/app/i18n/navigation";
import { scrollToSection } from "@/lib/scrollToSection";
import Hero from "./Hero";
import Telematics from "./Telematics";
import IndustriesScroll from "./IndustriesScroll";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Stats: numbers count up when they scroll into view ---------- */

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (reduce) {
      el.textContent = String(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease,
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>0</span>;
}

const stats = [
  { key: "brands", value: 40, suffix: "+" },
  { key: "industries", value: 9, suffix: "" },
  { key: "monitoring", value: 24, suffix: "/7" },
  { key: "steps", value: 3, suffix: "" },
] as const;

function Stats() {
  const t = useTranslations("Showcase.stats");
  return (
    <section className="relative z-10 bg-white">
      <div className="container mx-auto px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
          className="-mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 shadow-2xl shadow-brand/10 lg:grid-cols-4"
        >
          {stats.map(({ key, value, suffix }) => (
            <div key={key} className="bg-white px-6 py-8 text-center">
              <p className="font-play text-4xl font-bold text-brand lg:text-5xl">
                <Counter to={value} />
                {suffix}
              </p>
              <p className="mt-2 text-sm text-neutral-500">{t(key)}</p>
            </div>
          ))}
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
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      className="group relative h-full rounded-3xl border border-white bg-white p-8 shadow-lg shadow-brand/5"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(0,68,225,0.12), transparent 45%)",
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
    <section className="bg-light-blue py-24 lg:py-32">
      <div className="container mx-auto px-5 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center font-play text-3xl font-bold text-[#002148] sm:text-4xl lg:text-5xl"
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
                  <h3 className="mt-6 text-lg font-bold text-[#002148]">
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
  return (
    <section className="relative isolate overflow-hidden bg-[#020b24] py-28 text-white lg:py-40">
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
          className="mx-auto max-w-3xl bg-linear-to-r from-white via-[#b9d0ff] to-white bg-clip-text font-play text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl"
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
          <Link
            href="/#contacts"
            onClick={(e) => {
              if (scrollToSection("contacts")) e.preventDefault();
            }}
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-brand shadow-[0_0_60px_-10px] shadow-brand transition-transform hover:scale-105"
          >
            {tHeader("getDemo")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function Showcase() {
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
        <Cta />
      </main>
    </MotionConfig>
  );
}
