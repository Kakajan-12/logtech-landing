"use client";

import * as React from "react";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type IndustrySlide = {
  id: number;
  title: string;
  imageSrc: string;
};

type CarouselSpacingProps = {
  items: IndustrySlide[];
};

export function CarouselSpacing({ items }: CarouselSpacingProps) {
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
    <div className="relative partners-marquee">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={plugins}
        className="w-full overflow-x-auto lg:overflow-x-hidden"
      >
        <CarouselContent className="-ml-5 py-3 sm:-ml-6">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-[70%] pl-5 sm:basis-1/2 sm:pl-6 md:basis-1/3 lg:pl-6 xl:basis-1/4 hover:z-10"
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-xs shadow-lg cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out hover:scale-110 hover:shadow-2xl">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 82vw, (max-width: 768px) 50vw, (max-width: 1280px) 30vw, 25vw"
                />
                {/* <div
                  className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent"
                  aria-hidden
                /> */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <p className="font-nexa text-4xl lg:text-5xl font-bold leading-none tabular-nums sm:text-5xl">
                    {item.id}
                  </p>
                  <p className="mt-2 min-h-[2lh] font-nexa text-base font-bold leading-snug line-clamp-2 sm:text-lg lg:text-2xl">
                    {item.title}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious
          variant="ghost"
          size="icon-sm"
          className="hidden lg:inline-flex items-center justify-center top-1/2 left-0 z-10 size-9 -translate-y-1/2 border-0 bg-white/25 text-white shadow-none backdrop-blur-sm hover:bg-white/40 hover:text-white disabled:opacity-30"
        />
        <CarouselNext
          variant="ghost"
          size="icon-sm"
          className="hidden lg:inline-flex items-center justify-center top-1/2 right-0 z-10 size-9 -translate-y-1/2 border-0 bg-white/25 text-white shadow-none backdrop-blur-sm hover:bg-white/40 hover:text-white disabled:opacity-30"
        /> */}
      </Carousel>
    </div>
  );
}
