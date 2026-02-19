import Image from "next/image";
import Link from "next/link";
import type { DestinationCardResponse } from "@/types/destinations";

const FALLBACK_IMAGE = "/images/fallback.png";

export default function MainDestinationCard({
  destination,
}: {
  destination: DestinationCardResponse;
}) {
  const { slug, name, score, summary, imageUrl } = destination;
  const src = imageUrl ?? FALLBACK_IMAGE;

  return (
    <Link
      href={`/destinations/${slug}`}
      className="group relative block h-56 w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 24vw"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        priority={false}
      />

      {/* 오버레이(가독성) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight drop-shadow-sm">
            {name}
          </h3>
          <div className="rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
            ⭐ {score.toFixed(1)}
          </div>
        </div>
        <p className="mt-2 text-sm text-white/85 line-clamp-2">{summary}</p>
      </div>
    </Link>
  );
}
