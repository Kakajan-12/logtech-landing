"use client";

import { ArrowRight, ArrowUp, Handshake } from "lucide-react";
import { useDemoModal } from "./demo/DemoModal";

/** "Request a demo" / "Become a partner" buttons for the footer. */
export function FooterCta({ demoLabel, partnerLabel }: { demoLabel: string; partnerLabel: string }) {
  const demo = useDemoModal();
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => demo.open()}
        className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-lg transition-transform hover:-translate-y-px"
      >
        {demoLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => demo.open("partner")}
        className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        <Handshake className="size-4" aria-hidden />
        {partnerLabel}
      </button>
    </div>
  );
}

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
    >
      {label}
      <span className="inline-flex size-8 items-center justify-center rounded-full border border-white/20 transition-[transform,background-color] group-hover:-translate-y-0.5 group-hover:bg-white/10">
        <ArrowUp className="size-4" aria-hidden />
      </span>
    </button>
  );
}
