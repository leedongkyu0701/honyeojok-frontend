import Link from "next/link";
import Image from "next/image";
import type { SpotCardVM } from "@/types/spots";
import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";


export default function SpotCard({ spot }: { spot: SpotCardVM }) {

  return (
    <Link href={`/spots/${spot.destination.slug}/${spot.id}`} className="group block">
      <Card className="overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
        <div className="relative h-44 bg-neutral-100">
          {spot.imageUrl ? (
            <Image
              src={`${spot.imageUrl}`}
              alt={spot.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
              NO IMG
            </div>
          )}
        </div>

        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-semibold">{spot.name}</h3>

            {/* note가 있으면 뱃지로 */}
            {spot.note ? <Badge className="shrink-0">{spot.note}</Badge> : null}
          </div>

          {/* 카드에서는 description 너무 길면 부담 → note 없으면 description 1줄만 */}
          <p className="line-clamp-2 text-sm text-neutral-500">
            {spot.note ? spot.note : null}
          </p>

          {/* 태그들 */}
          {spot.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {spot.tags.slice(0, 3).map((t) => (
                <span
                  key={t.slug}
                  className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-600"
                >
                  #{t.label}
                </span>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
