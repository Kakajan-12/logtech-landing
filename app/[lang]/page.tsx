import BePartner from "../components/BePartner";
import Industry from "../components/Industry";
import Main from "../components/Main";
import Partners from "../components/Partners";
import Solution from "../components/Solution";
import Advantages from "../components/Advantages";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);

  return (
    <>
      <Main />
      <Advantages />
      <Industry />
      <Solution />
      <BePartner />
      <Partners />
    </>
  );
}
