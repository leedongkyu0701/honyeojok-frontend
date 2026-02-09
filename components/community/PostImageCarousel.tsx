"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PostImageCarousel({
  imageUrls,
}: {
  imageUrls: string[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const canScrollPrev = !!emblaApi?.canScrollPrev();
  const canScrollNext = !!emblaApi?.canScrollNext();


  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (imageUrls.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main viewport */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {imageUrls.map((url, idx) => (
              <div key={url + idx} className="min-w-0 flex-[0_0_100%]">
                <div className="relative aspect-16/10 w-full">
                  <Image
                    src={url}
                    alt={`Image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        {imageUrls.length > 1 ? (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/75 disabled:opacity-40"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/75 disabled:opacity-40"
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {selectedIndex + 1} / {imageUrls.length}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
