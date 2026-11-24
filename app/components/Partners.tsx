import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import shantui from "../../public/partners/1.jpg";
import sitrak from "../../public/partners/2.jpg";
import xcmg from "../../public/partners/3.jpg";
import lovol from "../../public/partners/4.jpg";
import nedirGala from "../../public/partners/5.jpg";
import waterCommittee from "../../public/partners/6.jpg";
import oguzabat from "../../public/partners/7.jpg";
import dost from "../../public/partners/8.jpg";
import kuwwatlyTagt from "../../public/partners/9.jpg";

type Logo = { name: string; src: StaticImageData };

// two rows that drift in opposite directions
const rows: Logo[][] = [
  [
    { name: "XCMG", src: xcmg },
    { name: "Sitrak", src: sitrak },
    { name: "Lovol", src: lovol },
    { name: "Shantui", src: shantui },
    { name: "Nedir Gala", src: nedirGala },
  ],
  [
    { name: "Türkmenistanyň Suw hojalygy baradaky döwlet komiteti", src: waterCommittee },
    { name: "Oguzabat Economic Society", src: oguzabat },
    { name: "Dost gurluşyk söwda, önümçilik H.J.", src: dost },
    { name: "Kuwwatly Tagt HK", src: kuwwatlyTagt },
  ],
];

function LogoCard({ logo, hidden }: { logo: Logo; hidden?: boolean }) {
  return (
    <li
      aria-hidden={hidden}
      className="group/logo flex h-20 w-48 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white px-6 shadow-[0_8px_24px_-16px_rgba(4,51,29,0.25)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_16px_32px_-16px_rgba(15,131,63,0.35)] sm:h-24 sm:w-56"
    >
      <Image
        src={logo.src}
        alt={hidden ? "" : logo.name}
        title={logo.name}
        sizes="200px"
        className="max-h-12 w-auto object-contain opacity-75 mix-blend-multiply transition-opacity duration-300 group-hover/logo:opacity-100 sm:max-h-14"
        style={{ width: "auto" }}
      />
    </li>
  );
}

export default function Partners() {
  const t = useTranslations("Partners");

  return (
    <section
      aria-labelledby="partners-heading"
      className="overflow-hidden bg-white py-20 lg:py-28"
    >
      <div className="container mx-auto px-5 text-center lg:px-10">
        <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
          {t("eyebrow")}
        </p>
        <h2
          id="partners-heading"
          className="mt-3 font-play text-3xl font-bold tracking-tight text-[#04331D] sm:text-4xl"
        >
          {t("title")}
        </h2>
      </div>

      {/* fade the rows out at both edges */}
      <div className="mt-12 flex flex-col gap-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        {rows.map((logos, r) => (
          <div key={r} className="logo-row flex overflow-hidden py-2">
            <ul
              className="logo-marquee flex w-max gap-5 pr-5"
              data-reverse={r % 2 ? "" : undefined}
              style={{ "--marquee-duration": `${logos.length * 14}s` } as React.CSSProperties}
            >
              {/* the list four times (two per half, wide enough for big screens):
                  sliding by half loops seamlessly */}
              {[0, 1, 2, 3].map((copy) =>
                logos.map((logo) => (
                  <LogoCard key={`${copy}-${logo.name}`} logo={logo} hidden={copy > 0} />
                )),
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
