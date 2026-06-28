import Image from "next/image";
import type { DestinationDetailResponse } from "@/features/destination/types/destinations";
import Badge from "@/shared/ui/Badge";

const FALLBACK_IMAGE = "/images/fallback.png";

function SummaryWithCommaBreak({ text }: { text: string | null }) {
  if (!text) return null;

  const parts = text.split(",").map((s) => s.trim()).filter(Boolean);

  if (parts.length <= 1) {
    return <>{text}</>;
  }

  const firstLine = parts.slice(0, -1).join(", ");
  const secondLine = parts[parts.length - 1];

  return (
    <>
      { `${firstLine},` }
      <br />
      {secondLine}
    </>
  );
}

export default function RegionHero({ data }: { data: DestinationDetailResponse }) {
  const src = data.imageUrl ?? FALLBACK_IMAGE;

  return (
    <section className="relative h-[60vh] overflow-hidden">

      <Image
        src={src}
        alt={data.name}
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-75"
      />


      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-5xl px-6 pb-8 pt-10 text-white">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold truncate">
                {data.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg opacity-90 line-clamp-2">
                <SummaryWithCommaBreak text={data.summary} />
              </p>
            </div>

            <Badge variant="glass" className="shrink-0">
              ⭐ {data.score.toFixed(1)}
            </Badge>

          </div>
        </div>
      </div>
    </section>
  );
}
