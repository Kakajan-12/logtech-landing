"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import main from "../../public/main.png";
import { GoCheck } from "react-icons/go";
import { useEffect, useState } from "react";

export default function Main() {
  const t = useTranslations("Main");
  const [hash, setHash] = useState("");
  const bullets = ["support", "brands", "api"] as const;

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative w-full overflow-hidden scroll-mt-32 md:scroll-mt-36 h-[90vh] flex items-center justify-start">
        <Image
          src={main}
          alt="Main"
          fill
          priority
          className="object-cover object-center min-h-[90vh]"
          sizes="100vw 100vh"
        />
        <div
          className="absolute inset-0 bg-linear-to-r from-black/10 to-black/0 min-h-[90vh]"
          aria-hidden
        />
        <div className="relative container mx-auto px-5 lg:px-10 flex flex-col justify-center gap-12 md:gap-8">
          <h1
            id="hero-heading"
            className="max-w-3xl font-vox text-3xl lg:text-6xl font-bold text-center lg:text-left leading-tight tracking-tight text-white"
          >
            {t("title")}
          </h1>
          <p className="max-w-3xl lg:max-w-2xl text-sm lg:text-lg text-center lg:text-left leading-tight text-white/90 sm:text-xl">
            {t("description")}
          </p>
          <div className="flex flex-col gap-5 sm:flex-row items-center justify-center lg:justify-start">
            <button
              type="button"
              className="inline-flex w-75 lg:w-45 items-center justify-center gap-2 rounded-sm border border-white/40 bg-[#D4E1FF8A] px-6 py-2.5 text-base font-semibold text-brand backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              {t("watchVideo")}
            </button>
            <Link
              href="#"
              scroll={false}
              className="inline-flex w-75 lg:w-45 items-center justify-center rounded-sm bg-brand px-6 py-2.5 text-base font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
              onClick={() => {
                setHash("#contacts");
              }}
            >
              {t("getDemo")}
            </Link>
          </div>
          <ul className="flex max-w-4xl flex-row flex-nowrap gap-4 sm:gap-x-9 ">
            {bullets.map((key) => (
              <li
                key={key}
                className="flex items-center gap-2 lg:gap-3 text-center lg:text-left text-xs lg:text-sm text-white sm:text-[15px] "
              >
                <GoCheck
                  className="size-5 shrink-0 text-emerald-400"
                  aria-hidden
                />
                <span className="whitespace-pre-wrap text-left">
                  {t(`bullets.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
