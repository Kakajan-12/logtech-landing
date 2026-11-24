"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Handshake,
  Route,
  ShieldCheck,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import bePartnerImg from "../../public/partner.jpg";
import { useDemoModal } from "./demo/DemoModal";

const bullets: { key: "routes" | "control" | "costs"; Icon: LucideIcon }[] = [
  { key: "routes", Icon: Route },
  { key: "control", Icon: ShieldCheck },
  { key: "costs", Icon: TrendingDown },
];

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

export default function BePartner() {
  const t = useTranslations("BePartner");
  const demo = useDemoModal();
  const photo = useRef<HTMLDivElement>(null);

  // slow parallax: the photo drifts inside its frame while the section scrolls by
  const { scrollYProgress } = useScroll({
    target: photo,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="partners"
      aria-labelledby="be-partner-heading"
      className="relative scroll-mt-16 overflow-hidden bg-light-green py-20 lg:py-32"
    >
      <div
        className="pointer-events-none absolute -top-40 -left-40 size-[28rem] rounded-full bg-[#38e0a0]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative container mx-auto grid items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {/* photo with the closing line on a glass card */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.8, ease }}
          className="relative order-2 lg:order-1"
        >
          <div
            ref={photo}
            className="image-partner relative aspect-[4/3] w-full overflow-hidden shadow-[0_40px_80px_-40px_rgba(4,51,29,0.55)]"
          >
            <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
              <Image
                src={bePartnerImg}
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </motion.div>
            <div
              className="absolute inset-0 bg-linear-to-t from-[#02150c]/70 via-transparent to-transparent"
              aria-hidden
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="absolute right-4 bottom-4 left-4 flex items-start gap-3 rounded-2xl border border-white/20 bg-[#04331D]/60 p-4 text-white backdrop-blur-md sm:right-auto sm:max-w-sm"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#38e0a0] text-[#04331D]">
              <Handshake className="size-5" strokeWidth={2} aria-hidden />
            </span>
            <p className="text-sm leading-snug font-medium">{t("outro")}</p>
          </motion.div>
        </motion.div>

        <div className="order-1 font-jost lg:order-2">
          <motion.p
            {...reveal}
            transition={{ duration: 0.6, ease }}
            className="text-xs font-semibold tracking-[0.25em] text-brand uppercase"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h2
            {...reveal}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            id="be-partner-heading"
            className="mt-3 font-play text-3xl font-bold tracking-tight text-[#04331D] sm:text-4xl lg:text-5xl"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            {...reveal}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mt-5 text-base leading-relaxed text-[#5D646D] sm:text-lg"
          >
            {t("intro")}
          </motion.p>

          <ul className="mt-8 grid gap-3">
            {bullets.map(({ key, Icon }, i) => (
              <motion.li
                key={key}
                {...reveal}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
                className="group flex items-center gap-4 rounded-2xl border border-white bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-[transform,box-shadow] duration-300 hover:translate-x-1 hover:shadow-md"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(177deg,#0F833F_0.23%,#08945A_96.91%)] text-white shadow-md shadow-brand/25 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <span className="text-base leading-snug font-medium text-[#04331D]">
                  {t(`bullets.${key}`)}
                </span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            {...reveal}
            transition={{ duration: 0.6, delay: 0.45, ease }}
            className="mt-9"
          >
            <button
              type="button"
              onClick={() => demo.open("partner")}
              className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(177deg,#0F833F_0.23%,#08945A_96.91%)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-transform hover:-translate-y-px"
            >
              {t("cta")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
