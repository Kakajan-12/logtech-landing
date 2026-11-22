import type { StaticImageData } from "next/image";
import transport from "../../public/slider/1.jpg";
import construction from "../../public/slider/2.jpg";
import agriculture from "../../public/slider/3.jpg";
import courier from "../../public/slider/4.jpg";
import leasing from "../../public/slider/5.jpg";
import trailers from "../../public/slider/6.jpg";
import taxi from "../../public/slider/7.jpg";
import passenger from "../../public/slider/8.jpg";
import municipal from "../../public/slider/9.jpg";

/** Industries shown on the site; titles live in messages under `Industry.cards.<key>`. */
export const industries = [
  { key: "transport", image: transport },
  { key: "construction", image: construction },
  { key: "agriculture", image: agriculture },
  { key: "courier", image: courier },
  { key: "leasing", image: leasing },
  { key: "trailers", image: trailers },
  { key: "taxi", image: taxi },
  { key: "passenger", image: passenger },
  { key: "municipal", image: municipal },
] as const satisfies readonly { key: string; image: StaticImageData }[];
