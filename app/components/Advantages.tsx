"use client";
import {
  BarChart3,
  Check,
  ClipboardList,
  FileSpreadsheet,
  Fuel,
  Gauge,
  MapPinned,
  Truck,
  CircleAlert,
  UserRound,
} from "lucide-react";
import { RxDoubleArrowRight } from "react-icons/rx";
import { RxDoubleArrowDown } from "react-icons/rx";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const rows = [
  { id: "fuel" as const, PainIcon: Fuel, SolutionIcon: Gauge },
  { id: "transport" as const, PainIcon: Truck, SolutionIcon: MapPinned },
  { id: "drivers" as const, PainIcon: UserRound, SolutionIcon: ClipboardList },
  {
    id: "analytics" as const,
    PainIcon: BarChart3,
    SolutionIcon: FileSpreadsheet,
  },
] as const;

const viewport = { once: true, amount: 0.4, margin: "0px 0px -48px 0px" };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Advantages() {
  const t = useTranslations("Advantages");

  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-light-blue py-10 lg:py-28 scroll-mt-32 md:scroll-mt-36"
    >
      <div className="relative container mx-auto px-5 lg:px-10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          id="advantages-heading"
          className="text-center font-vox text-2xl font-bold tracking-tight text-[#0B1F3F] sm:text-3xl lg:text-4xl"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 text-center text-sm leading-relaxed text-[#5D646D] sm:text-base"
        >
          {t("subtitle")}
        </motion.p>

        <div className="mx-auto mt-10 max-w-5xl space-y-6 sm:mt-12 lg:mt-14">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="hidden flex-row gap-6 md:flex"
          >
            <div className="min-w-0 flex-1 rounded border border-[#F0ECEC] bg-white px-4 py-4">
              <div className="flex items-center gap-2.5">
                <CircleAlert
                  className="size-7 text-[#F34D29]"
                  strokeWidth={1.5}
                />
                <span className="font-nexa text-sm font-bold text-[#F34D29] sm:text-base">
                  {t("painColumn")}
                </span>
              </div>
            </div>
            <div className="w-10 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1 rounded px-4 py-4 border border-[#F0ECEC] bg-white">
              <div className="flex items-center gap-2.5">
                <Check
                  className="size-7 shrink-0 text-brand"
                  strokeWidth={2.75}
                  aria-hidden
                />
                <span className="font-nexa text-sm font-bold text-brand sm:text-base">
                  {t("solutionColumn")}
                </span>
              </div>
            </div>
          </motion.div>

          {rows.map(({ id, PainIcon, SolutionIcon }) => (
            <motion.div
              key={id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex flex-col gap-0 md:gap-6 md:flex-row md:items-stretch"
            >
              <article
                className="min-w-0 flex-1 rounded-t  md:rounded border-t border-l border-r border-b-0 md:border border-[#E8ECF0] bg-white p-4 hover:shadow-sm transition-shadow duration-300"
                aria-labelledby={`we-solve-${id}-pain-title`}
              >
                <div className="mb-3 text-gray-400" aria-hidden>
                  <PainIcon className="size-5" strokeWidth={1.5} />
                </div>
                <h3
                  id={`we-solve-${id}-pain-title`}
                  className="font-nexa text-base font-bold leading-snug text-[#F34D29] sm:text-lg"
                >
                  {t(`rows.${id}.painTitle`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5D646D] sm:text-[15px]">
                  {t(`rows.${id}.painDescription`)}
                </p>
              </article>

              <div
                className="hidden md:flex shrink-0 items-center justify-center md:w-10"
                aria-hidden
              >
                <RxDoubleArrowRight className="size-7" />
              </div>
              <div
                className="flex md:hidden shrink-0 items-center justify-center md:w-10 bg-white md:bg-transparent border-l border-r md:border-l-0 md:border-r-0"
                aria-hidden
              >
                <RxDoubleArrowDown className="size-7" />
              </div>

              <article
                className="min-w-0 flex-1 rounded-b md:rounded border-b border-l border-r border-t-0 md:border border-[#E8ECF0] bg-white p-4 hover:shadow-sm transition-shadow duration-300"
                aria-labelledby={`we-solve-${id}-solution-title`}
              >
                <div className="mb-3 text-gray-400" aria-hidden>
                  <SolutionIcon className="size-5" strokeWidth={1.5} />
                </div>
                <h3
                  id={`we-solve-${id}-solution-title`}
                  className="font-nexa text-base font-bold leading-snug text-brand sm:text-lg"
                >
                  {t(`rows.${id}.solutionTitle`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5D646D] sm:text-[15px]">
                  {t(`rows.${id}.solutionDescription`)}
                </p>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
