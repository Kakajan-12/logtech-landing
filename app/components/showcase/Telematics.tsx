"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useTranslations } from "next-intl";
import { Activity, Fuel, Gauge, Satellite, type LucideIcon } from "lucide-react";

const TruckScene = dynamic(() => import("./TruckScene"), {
  ssr: false,
  loading: () => null,
});

const metrics: { key: string; Icon: LucideIcon; at: number }[] = [
  { key: "speed", Icon: Gauge, at: 0.08 },
  { key: "fuel", Icon: Fuel, at: 0.28 },
  { key: "gps", Icon: Satellite, at: 0.48 },
  { key: "engine", Icon: Activity, at: 0.68 },
];

function MetricCard({
  progress,
  at,
  Icon,
  label,
  value,
}: {
  progress: MotionValue<number>;
  at: number;
  Icon: LucideIcon;
  label: string;
  value: string;
}) {
  // Cover the whole 0–1 range: motion may run this as a native scroll-driven
  // animation, and a partial range would fade back out after `at + 0.1`.
  const range = [0, at, at + 0.1, 1];
  const opacity = useTransform(progress, range, [0, 0, 1, 1]);
  const y = useTransform(progress, range, [24, 24, 0, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:p-4"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
        <Icon className="size-4 text-emerald-400" aria-hidden />
        {label}
      </div>
      <p className="mt-1.5 font-play text-xl font-bold text-white sm:mt-2 sm:text-2xl">{value}</p>
    </motion.div>
  );
}

export default function Telematics() {
  const t = useTranslations("Showcase.truck");
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="sc-telematics"
      ref={section}
      className="relative h-[280vh] bg-[#020b24] text-white"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-32">
        <div className="container mx-auto grid flex-1 items-center gap-2 px-5 pb-4 sm:gap-6 sm:pb-10 lg:grid-cols-[1fr_1.4fr] lg:px-10">
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
            <div className="mt-5 grid max-w-md grid-cols-2 gap-2 sm:mt-8 sm:gap-3">
              {metrics.map(({ key, Icon, at }) => (
                <MetricCard
                  key={key}
                  progress={scrollYProgress}
                  at={at}
                  Icon={Icon}
                  label={t(`${key}`)}
                  value={t(`${key}Value`)}
                />
              ))}
            </div>
          </div>

          <div
            className="relative h-[34vh] min-h-52 lg:h-full"
            role="img"
            aria-label={t("truckLabel")}
          >
            <div
              className="pointer-events-none absolute inset-0 m-auto size-3/4 rounded-full bg-brand/25 blur-[100px]"
              aria-hidden
            />
            {/* soft edges so the road fades out instead of being cut by the canvas */}
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_75%)]">
              <TruckScene progress={scrollYProgress} active={inView} animate={!reduce} />
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
