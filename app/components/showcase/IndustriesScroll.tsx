"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Bus,
  CarTaxiFront,
  Container,
  HardHat,
  KeyRound,
  Package,
  Tractor,
  Trash2,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { industries } from "../industryData";
import { useDemoModal } from "../demo/DemoModal";

type IndustryKey = (typeof industries)[number]["key"];

const ICONS: Record<IndustryKey, LucideIcon> = {
  transport: Truck,
  construction: HardHat,
  agriculture: Tractor,
  courier: Package,
  leasing: KeyRound,
  trailers: Container,
  taxi: CarTaxiFront,
  passenger: Bus,
  municipal: Trash2,
};

const CARD =
  "relative aspect-[3/4] h-[52vh] max-h-[540px] min-h-[320px] shrink-0 overflow-hidden rounded-3xl";

export default function IndustriesScroll() {
  const t = useTranslations("Showcase.industries");
  const tCards = useTranslations("Industry.cards");
  const demo = useDemoModal();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  // How far the track has to travel = its overflow past the viewport.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () =>
      setDistance(
        Math.max(0, el.scrollWidth - document.documentElement.clientWidth),
      );
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // The card in focus = the one closest to a focus point that slides from the
  // first card (start) to the last one (end), so every card gets its turn.
  useMotionValueEvent(x, "change", (shift) => {
    const cards = track.current?.children;
    if (!cards?.length) return;
    const first = cards[0] as HTMLElement;
    const last = cards[cards.length - 1] as HTMLElement;
    const from = first.offsetLeft + first.offsetWidth / 2;
    const to =
      last.offsetLeft + last.offsetWidth / 2 - distance; // last card's centre at the end
    const p = distance ? -shift / distance : 0;
    const mid = from + (to - from) * p;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const el = cards[i] as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 + shift - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    if (best !== active) setActive(best);
  });
  const shown = Math.min(active + 1, industries.length);

  return (
    <section
      ref={section}
      id="industry"
      className="relative scroll-mt-16 bg-white"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-24 pb-8">
        <div className="container mx-auto mb-8 flex items-end justify-between gap-8 px-5 lg:mb-10 lg:px-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 max-w-2xl font-play text-3xl leading-tight font-bold text-[#04331D] sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
          </div>
          {/* where you are in the row */}
          <div className="hidden w-56 shrink-0 md:block" aria-hidden>
            <p className="font-play text-sm font-bold text-[#04331D] tabular-nums">
              <span className="text-3xl text-brand">
                {String(shown).padStart(2, "0")}
              </span>
              <span className="mx-2 text-neutral-400">{t("counter")}</span>
              {String(industries.length).padStart(2, "0")}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-200">
              <motion.div
                style={{ width: bar }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#0F833F,#38e0a0)]"
              />
            </div>
          </div>
        </div>

        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max items-center gap-5 px-5 lg:gap-6 lg:px-10"
        >
          {industries.map(({ key, image }, i) => {
            const Icon = ICONS[key];
            const on = i === active;
            return (
              <article
                key={key}
                className={`group ${CARD} bg-neutral-200 shadow-lg ring-2 transition-[box-shadow,--tw-ring-color] duration-500 ${
                  on
                    ? "shadow-brand/30 ring-brand"
                    : "shadow-black/5 ring-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 70vw, 30vw"
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                    on ? "scale-105" : ""
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-linear-to-t from-[#02150c]/95 via-[#02150c]/35 to-transparent transition-opacity duration-500 ${
                    on ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                  }`}
                  aria-hidden
                />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span
                    className={`font-play text-sm font-bold tabular-nums transition-colors duration-500 ${
                      on ? "text-[#6fdca0]" : "text-white/60"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-xl leading-snug font-bold sm:text-2xl">
                    {tCards(key)}
                  </h3>
                  {/* details: open on the card in focus and on hover; always open on phones */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      on
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 max-md:grid-rows-[1fr] max-md:opacity-100"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        {t(`items.${key}.text`)}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {(t.raw(`items.${key}.tags`) as string[]).map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* closing card: no matching industry → talk to us */}
          <article
            className={`${CARD} flex flex-col justify-between bg-[linear-gradient(160deg,#04331D,#0F833F_70%,#08945A)] p-7 text-white ring-2 transition-[--tw-ring-color] duration-500 ${
              active === industries.length
                ? "ring-[#38e0a0]"
                : "ring-transparent"
            }`}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-[#38e0a0]/20 blur-3xl"
              aria-hidden
            />
            <span
              className="relative font-play text-6xl leading-none font-bold text-white/15"
              aria-hidden
            >
              ?
            </span>
            <div className="relative">
              <h3 className="font-play text-2xl leading-tight font-bold sm:text-3xl">
                {t("moreTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {t("moreText")}
              </p>
              <button
                type="button"
                onClick={() => demo.open()}
                className="group/btn mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand shadow-lg transition-transform hover:-translate-y-px"
              >
                {t("moreCta")}
                <ArrowRight
                  className="size-4 transition-transform group-hover/btn:translate-x-1"
                  aria-hidden
                />
              </button>
            </div>
          </article>
        </motion.div>
      </div>
    </section>
  );
}
