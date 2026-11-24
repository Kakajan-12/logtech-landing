"use client";

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  Cloud,
  Cpu,
  Link,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useDemoModal } from "./demo/DemoModal";

const steps = ["install", "connect", "monitor"] as const;
const icons: LucideIcon[] = [Cpu, Link, MonitorSmartphone];
const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- small looping illustrations, one per step ---------- */

function TrackerArt() {
  return (
    <div className="relative flex size-full items-center justify-center">
      {[0, 0.6, 1.2].map((d) => (
        <span
          key={d}
          className="step-anim absolute size-24 rounded-full border-2 border-[#38e0a0]/60"
          style={{ animation: `step-wave 1.8s ${d}s ease-out infinite` }}
          aria-hidden
        />
      ))}
      <div className="relative flex h-14 w-20 items-center justify-center rounded-xl bg-[#04331D] shadow-lg shadow-brand/30">
        <span className="absolute top-2 right-2 size-1.5 animate-pulse rounded-full bg-[#38e0a0]" />
        <Cpu className="size-6 text-[#6fdca0]" strokeWidth={1.6} aria-hidden />
      </div>
    </div>
  );
}

function ConnectArt({ label }: { label: string }) {
  return (
    <div className="relative flex size-full items-center justify-center gap-24">
      <div className="flex size-12 items-center justify-center rounded-xl bg-[#04331D] shadow-md">
        <Cpu className="size-5 text-[#6fdca0]" strokeWidth={1.6} aria-hidden />
      </div>
      {/* data packets travelling to the platform */}
      <div className="absolute top-1/2 left-1/2 h-px w-24 -translate-x-1/2 bg-[#A9DDC0]" aria-hidden>
        {[0, 0.5, 1].map((d) => (
          <span
            key={d}
            className="step-anim absolute -top-[3px] left-0 size-[7px] rounded-full bg-brand"
            style={{ animation: `step-flow 1.5s ${d}s linear infinite` }}
          />
        ))}
      </div>
      <div className="flex size-12 items-center justify-center rounded-xl bg-brand shadow-md shadow-brand/30">
        <Cloud className="size-5 text-white" strokeWidth={1.8} aria-hidden />
      </div>
      <span className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand shadow-sm">
        <Check className="size-3" strokeWidth={3} aria-hidden />
        {label}
      </span>
    </div>
  );
}

function MonitorArt() {
  const route = "M14 62 C 40 20, 70 70, 96 34 S 140 30, 150 18";
  return (
    <div className="relative flex size-full items-center justify-center">
      {/* dashboard window with a live route */}
      <div className="relative h-[104px] w-[176px] overflow-hidden rounded-lg border border-[#A9DDC0] bg-white shadow-md">
        <div className="flex h-4 items-center gap-1 border-b border-neutral-100 px-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-neutral-200" />
          ))}
        </div>
        <svg viewBox="0 0 164 86" className="h-[88px] w-full" aria-hidden>
          <defs>
            <pattern id="mgrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M16 0H0V16" fill="none" stroke="#eef6f1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="164" height="86" fill="url(#mgrid)" />
          <path d={route} fill="none" stroke="#0F833F" strokeWidth="2.5" strokeLinecap="round" />
          <circle r="4.5" fill="#38e0a0" stroke="#04331D" strokeWidth="1.5">
            <animateMotion dur="4s" repeatCount="indefinite" path={route} />
          </circle>
        </svg>
      </div>
      {/* phone in front */}
      <div className="absolute right-[calc(50%-104px)] bottom-3 h-[78px] w-[42px] rounded-lg border-2 border-[#04331D] bg-white p-1 shadow-lg">
        <div className="flex h-full flex-col justify-end gap-0.5 rounded-sm bg-light-green p-1">
          {[60, 85, 45].map((w, i) => (
            <span key={i} className="h-1 rounded-full bg-brand/70" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- step card ---------- */

function Step({
  index,
  title,
  text,
  art,
  progress,
}: {
  index: number;
  title: string;
  text: string;
  art: ReactNode;
  progress: MotionValue<number>;
}) {
  const Icon = icons[index];
  // the badge lights up once the timeline line reaches this step
  const at = index / (steps.length - 1);
  const lit = useTransform(progress, [Math.max(0, at - 0.08), at], [0, 1]);
  const badgeBg = useTransform(lit, [0, 1], ["#ffffff", "#0F833F"]);
  const badgeFg = useTransform(lit, [0, 1], ["#0F833F", "#ffffff"]);

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease }}
      className="relative flex flex-col pl-14 md:pl-0"
    >
      <motion.span
        style={{ backgroundColor: badgeBg, color: badgeFg }}
        className="absolute top-0 left-0 z-10 flex size-10 items-center justify-center rounded-full border-2 border-brand font-play text-sm font-bold md:relative md:mx-auto"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      <div className="group mt-0 flex-1 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_20px_50px_-30px_rgba(4,51,29,0.35)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,131,63,0.45)] md:mt-6">
        <div className="h-44 bg-[radial-gradient(circle_at_50%_40%,#e3f5ea,#f2faf5_70%)]">
          {art}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Icon className="size-4" strokeWidth={1.8} aria-hidden />
            </span>
            <h3 className="font-jost text-lg font-semibold text-[#04331D]">{title}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">{text}</p>
        </div>
      </div>
    </motion.li>
  );
}

export default function Solution() {
  const t = useTranslations("Solution");
  const demo = useDemoModal();
  const list = useRef<HTMLOListElement>(null);

  // timeline fills while the steps scroll through the middle of the screen
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 0.75", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const arts = [<TrackerArt key="a" />, <ConnectArt key="b" label={t("connected")} />, <MonitorArt key="c" />];

  return (
    <section
      id="solutions"
      aria-labelledby="solution-heading"
      className="scroll-mt-16 overflow-hidden bg-white py-20 lg:py-32"
    >
      <div className="container mx-auto px-5 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
          id="solution-heading"
          className="text-center font-play text-3xl font-bold tracking-tight text-[#04331D] sm:text-4xl lg:text-5xl"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-[#5D646D] sm:text-base"
        >
          {t("subtitle")}
        </motion.p>

        <div className="relative mx-auto mt-14 max-w-6xl lg:mt-20">
          {/* timeline: vertical on phones (left), horizontal through the badges on desktop */}
          <div className="absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 rounded-full bg-neutral-200 md:top-5 md:right-[16.66%] md:bottom-auto md:left-[16.66%] md:h-0.5 md:w-auto md:translate-x-0" aria-hidden>
            <motion.div
              style={{ scaleY: progress }}
              className="h-full w-full origin-top rounded-full bg-[linear-gradient(180deg,#0F833F,#38e0a0)] md:hidden"
            />
            <motion.div
              style={{ scaleX: progress }}
              className="hidden h-full w-full origin-left rounded-full bg-[linear-gradient(90deg,#0F833F,#38e0a0)] md:block"
            />
          </div>

          <ol ref={list} className="relative grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
            {steps.map((key, i) => (
              <Step
                key={key}
                index={i}
                title={t(`steps.${key}.title`)}
                text={t(`steps.${key}.description`)}
                art={arts[i]}
                progress={progress}
              />
            ))}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease }}
          className="mt-14 flex justify-center"
        >
          <button
            type="button"
            onClick={() => demo.open()}
            className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(177deg,#0F833F_0.23%,#08945A_96.91%)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-transform hover:-translate-y-px"
          >
            {t("cta")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
