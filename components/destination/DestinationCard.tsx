import Image from "next/image";
import Link from "next/link";
import type { DestinationCardResponse } from "@/types/destinations";
import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";

const FALLBACK_IMAGE = "/images/fallback.png";

export default function DestinationCard({
  destination,
}: {
  destination: DestinationCardResponse;
}) {
  const { slug, name, score, imageUrl, summary } = destination;

  const src = imageUrl ?? FALLBACK_IMAGE;

  return (
    <Link href={`/destinations/${slug}`} className="group block">
      <Card className="overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={src}
            alt={name}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 24vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            priority={false}
          />
        </div>

        <CardContent className="pt-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-neutral-900 truncate">
              {name}
            </h3>
            <Badge>⭐ {score.toFixed(1)}</Badge>
          </div>
          <p className="text-xs text-neutral-500 line-clamp-1 mt-2">{summary}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
