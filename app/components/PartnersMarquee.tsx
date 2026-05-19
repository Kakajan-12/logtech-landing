"use client";

import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export type PartnerIcon = {
  id: number | string;
  src: StaticImageData;
  alt: string;
};

type PartnersMarqueeProps = {
  icons: PartnerIcon[];
};

export function PartnersMarquee({ icons }: PartnersMarqueeProps) {
  const plugins = React.useMemo(
    () => [
      AutoScroll({
        speed: 1,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
    [],
  );

  return (
    <div className="partners-marquee w-full" aria-labelledby="partners-heading">
      <Carousel
        opts={{ align: "start", loop: true, dragFree: true }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent className="">
          {icons.map((icon) => (
            <CarouselItem
              key={icon.id}
              className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 "
            >
              <div className="flex h-16 items-center justify-center sm:h-20 grow-0 shrink-0">
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  className="max-h-full w-auto object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
