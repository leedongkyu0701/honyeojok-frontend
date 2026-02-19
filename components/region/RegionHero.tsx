import Image from "next/image";
import type { DestinationDetailResponse } from "@/types/destinations";

const FALLBACK_IMAGE = "/images/fallback.png";

export default function RegionHero({ data }: { data: DestinationDetailResponse }) {
  const src = data.imageUrl ?? FALLBACK_IMAGE;

  return (
    <section className="relative h-[60vh] overflow-hidden">
      {/* Background image */}
      <Image
        src={src}
        alt={data.name}
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-75"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* content */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-5xl px-6 pb-8 pt-10 text-white">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold truncate">
                {data.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg opacity-90 line-clamp-2">
                {data.summary}
              </p>
            </div>

            {/* 옵션: 점수 뱃지 */}
            <div className="shrink-0 rounded-full bg-white/15 px-3 py-2 text-sm backdrop-blur">
              ⭐ {data.score.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
