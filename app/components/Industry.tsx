import { getTranslations } from "next-intl/server";
import { CarouselSpacing, type IndustrySlide } from "./CarouselSpacing";
import transport from "../../public/slider/1.jpg";
import construction from "../../public/slider/2.jpg";
import agriculture from "../../public/slider/3.jpg";
import courier from "../../public/slider/4.jpg";
import leasing from "../../public/slider/5.jpg";
import trailers from "../../public/slider/6.jpg";
import taxi from "../../public/slider/7.jpg";
import passenger from "../../public/slider/8.jpg";
import municipal from "../../public/slider/9.jpg";

const slideKeys = [
  "transport",
  "construction",
  "agriculture",
  "courier",
  "leasing",
  "trailers",
  "taxi",
  "passenger",
  "municipal",
] as const;

const slideImages: Record<(typeof slideKeys)[number], string> = {
  transport: transport.src,
  construction: construction.src,
  agriculture: agriculture.src,
  courier: courier.src,
  leasing: leasing.src,
  trailers: trailers.src,
  taxi: taxi.src,
  passenger: passenger.src,
  municipal: municipal.src,
};

export default async function Industry() {
  const t = await getTranslations("Industry");
  const items: IndustrySlide[] = slideKeys.map((key, index) => ({
    id: index + 1,
    title: t(`cards.${key}`),
    imageSrc: slideImages[key],
  }));

  return (
    <section id="industry" className="scroll-mt-32 bg-brand md:scroll-mt-36 ">
      <div className="py-15 lg:py-28">
        <h2 className="mb-10 lg:mb-12 text-center font-vox text-2xl lg:text-4xl font-bold text-white">
          {t("title")}
        </h2>
        <CarouselSpacing items={items} />
      </div>
    </section>
  );
}
