"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { GoCheck } from "react-icons/go";
import { motion } from "framer-motion";
import bePartnerImg from "../../public/partner.jpg";

const bulletKeys = ["routes", "control", "costs"] as const;

const viewport = { once: true, amount: 0.2 };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function BePartner() {
  const t = useTranslations("BePartner");

  return (
    <section
      id="partners"
      className="bg-light-blue py-15 lg:py-28 scroll-mt-32 md:scroll-mt-36"
      aria-labelledby="be-partner-heading"
    >
      <div className="container mx-auto px-5 lg:px-10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          id="be-partner-heading"
          className="mb-8 text-center block lg:hidden font-vox text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
        >
          {t("title")}
        </motion.h2>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative aspect-video image-partner mx-auto w-full overflow-hidden"
          >
            <Image
              src={bePartnerImg}
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 576px"
              className="object-cover object-center image-partner"
            />
          </motion.div>

          <div className="font-nexa flex flex-col justify-center gap-y-6">
            <motion.h3
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="hidden lg:block font-vox text-4xl font-bold tracking-tight text-[#002148]"
            >
              {t("title")}
            </motion.h3>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="text-sm leading-relaxed text-[#7A7A7A] sm:text-lg"
            >
              {t("intro")}
            </motion.p>
            <ul className="flex flex-col gap-4 sm:gap-5">
              {bulletKeys.map((key) => (
                <motion.li
                  key={key}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  className="flex gap-2 text-left sm:gap-3.5"
                >
                  <GoCheck
                    className="size-4 shrink-0 text-emerald-500 sm:size-6"
                    aria-hidden
                  />
                  <span className="text-base font-bold leading-5 text-black">
                    {t(`bullets.${key}`)}
                  </span>
                </motion.li>
              ))}
            </ul>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="text-sm leading-relaxed text-neutral-500 sm:text-base"
            >
              {t("outro")}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
