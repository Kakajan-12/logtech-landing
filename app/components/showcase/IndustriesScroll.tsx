"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { industries } from "../industryData";

export default function IndustriesScroll() {
  const t = useTranslations("Showcase.industries");
  const tCards = useTranslations("Industry.cards");
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

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

  return (
    <section
      ref={section}
      id="industry"
      className="relative scroll-mt-16 bg-white"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-28 pb-10">
        <div className="container mx-auto mb-10 px-5 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 max-w-2xl font-play text-3xl font-bold leading-tight text-[#04331D] sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max gap-5 px-5 lg:gap-6 lg:px-10"
        >
          {industries.map(({ key, image }, i) => (
            <article
              key={key}
              className="group relative aspect-[3/4] h-[48vh] max-h-[520px] min-h-[300px] shrink-0 overflow-hidden rounded-3xl bg-neutral-200"
            >
              <Image
                src={image}
                alt={tCards(key)}
                fill
                sizes="(max-width: 768px) 60vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-[#02150c]/85 via-[#02150c]/10 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="font-play text-5xl font-bold text-white/30 transition-colors duration-500 group-hover:text-emerald-400">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-snug">
                  {tCards(key)}
                </h3>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
