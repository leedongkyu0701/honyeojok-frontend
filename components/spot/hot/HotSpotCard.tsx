"use client";

import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/common/Badge";
import { Card, CardContent } from "@/components/common/Card";
import type { SpotCardVM } from "@/types/spots";

export default function HotSpotCard({ spot }: { spot: SpotCardVM }) {
  const badgeText = spot.note?.trim() || "추천";

  return (
    <Link
      href={`/spots/${spot.destination.slug}/${spot.id}`}
      className="group block"
    >
      <Card className="w-60 overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
        <div className="relative h-36 bg-neutral-100">
          {spot.imageUrl ? (
            <Image
              src={`${spot.imageUrl}`}
              alt={spot.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="240px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">
              NO IMG
            </div>
          )}
        </div>

        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold">{spot.name}</h3>
            <Badge className="shrink-0">{badgeText}</Badge>
          </div>

          <p className="text-xs text-neutral-500">{spot.destination.name}</p>

          {spot.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {spot.tags.slice(0, 2).map((t) => (
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
