"use client";
import { useTranslations } from "next-intl";
import { Cpu, Link, MonitorSmartphone } from "lucide-react";
import { motion } from "framer-motion";

const steps = ["install", "connect", "monitor"] as const;

const viewport = { once: true, amount: 0.2 };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Solution() {
  const t = useTranslations("Solution");
  const icons = [Cpu, Link, MonitorSmartphone] as const;

  return (
    <section
      id="solutions"
      className="scroll-mt-32 bg-white py-15 lg:py-28 md:scroll-mt-36"
      // aria-labelledby="solution-heading"
    >
      <div className="container mx-auto px-5 lg:px-10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          id="solution-heading"
          className="text-center font-vox text-2xl font-bold tracking-tight text-[#002148] sm:text-3xl lg:text-4xl"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.08 }}
          className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-[#5D646D] sm:text-base"
        >
          {t("subtitle")}
        </motion.p>

        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16 lg:mt-20">
          <div
            className="pointer-events-none absolute top-12.5 right-[12%] left-[12%] z-0 hidden h-0 border-t-2 border-dashed border-[#B8CEFF] md:block"
            aria-hidden
          />
          <div
            className="absolute top-0 left-1/2 z-0 h-full w-0 -translate-x-1/2 border-l-2 border-dashed border-[#B8CEFF] md:hidden"
            aria-hidden
          />
          <ol className="relative z-10 grid gap-32.5 md:grid-cols-3 md:gap-8 lg:gap-10">
            {steps.map((key, i) => {
              const Icon = icons[i];
              const n = String(i + 1).padStart(2, "0");
              return (
                <motion.li
                  key={key}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  className="flex flex-col items-center text-center z-10 relative bg-white md:bg-transparent"
                >
                  <div className="relative flex size-25 shrink-0 items-center justify-center rounded-md bg-light-blue z-10">
                    <span className="absolute -right-1.5 -top-1.5 flex size-8.5 items-center justify-center rounded-full bg-brand text-base font-semibold leading-none text-white shadow-sm">
                      {n}
                    </span>
                    <Icon
                      className="size-9 text-brand"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-4 max-w-xs font-nexa text-base font-bold text-neutral-900 sm:text-lg">
                    {t(`steps.${key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-snug text-neutral-500">
                    {t(`steps.${key}.description`)}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
