import { setRequestLocale } from "next-intl/server";
import BePartner from "../components/BePartner";
import Partners from "../components/Partners";
import Solution from "../components/Solution";
import Showcase from "../components/showcase/Showcase";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);

  return (
    <Showcase>
      <Solution />
      <BePartner />
      <Partners />
    </Showcase>
  );
}
