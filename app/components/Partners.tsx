import { useTranslations } from "next-intl";
import icon1 from "../../public/partners/1.jpg";
import icon2 from "../../public/partners/2.jpg";
import icon3 from "../../public/partners/3.jpg";
import icon4 from "../../public/partners/4.jpg";
import icon5 from "../../public/partners/5.jpg";
import icon6 from "../../public/partners/6.jpg";
import icon7 from "../../public/partners/7.jpg";
import icon8 from "../../public/partners/8.jpg";
import icon9 from "../../public/partners/9.jpg";
import { PartnersMarquee, type PartnerIcon } from "./PartnersMarquee";

const partnersItems: PartnerIcon[] = [
  { id: 1, src: icon3, alt: "Partner 1" },
  { id: 2, src: icon2, alt: "Partner 2" },
  { id: 3, src: icon4, alt: "Partner 3" },
  { id: 4, src: icon6, alt: "Partner 4" },
  { id: 5, src: icon5, alt: "Partner 5" },
  { id: 6, src: icon9, alt: "Partner 6" },
  { id: 7, src: icon7, alt: "Partner 7" },
  { id: 8, src: icon1, alt: "Partner 8" },
  { id: 9, src: icon8, alt: "Partner 9" },
];

export default function Partners() {
  const t = useTranslations("Partners");

  return (
    <section className="mx-auto overflow-hidden bg-white scroll-mt-32 md:scroll-mt-36 py-15">
      <h2
        id="partners-heading"
        className="mb-8 text-center font-vox text-2xl font-bold tracking-tight text-[#002148] sm:mb-10 sm:text-3xl"
      >
        {t("title")}
      </h2>
      <PartnersMarquee icons={partnersItems} />
    </section>
  );
}
