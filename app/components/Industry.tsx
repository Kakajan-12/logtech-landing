import { getTranslations } from "next-intl/server";
import { CarouselSpacing, type IndustrySlide } from "./CarouselSpacing";
import { industries } from "./industryData";

export default async function Industry() {
  const t = await getTranslations("Industry");
  const items: IndustrySlide[] = industries.map(({ key, image }, index) => ({
    id: index + 1,
    title: t(`cards.${key}`),
    imageSrc: image.src,
  }));

  return (
    <section id="industry" className="scroll-mt-32 bg-brand md:scroll-mt-36 ">
      <div className="py-15 lg:py-28">
        <h2 className="mb-10 lg:mb-12 text-center font-play text-2xl lg:text-4xl font-bold text-white">
          {t("title")}
        </h2>
        <CarouselSpacing items={items} />
      </div>
    </section>
  );
}
