"use client";

import Link from "next/link";
import Image from "next/image";
import type { SpotCardResponse } from "@/types/spots";
import { Card, CardContent } from "@/components/common/Card";

const FALLBACK_IMAGE = "/images/fallback.png";

type Variant = "grid" | "row" | "featured";

export default function SpotCard({
  spot,
  variant = "grid",
}: {
  spot: SpotCardResponse;
  variant?: Variant;
}) {
  const href = `/spots/${spot.destination.slug}/${spot.id}`;
  const imageSrc = spot.imageUrl ?? FALLBACK_IMAGE;
if (variant === "row") {
  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden rounded-2xl transition duration-300 group-hover:shadow-md">
        <div className="flex gap-3 p-3">
          {/* 썸네일 */}
          <div className="relative h-18 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={imageSrc}
              alt={spot.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="96px"
            />
          </div>

          {/* 텍스트 */}
          <CardContent className="min-w-0 flex-1 space-y-1.5 p-0">
            <h3 className="line-clamp-1 text-sm font-semibold">
              {spot.name}
            </h3>

            <p className="line-clamp-2 text-sm text-neutral-500">
              {spot.summary}
            </p>

            {spot.tags.length ? (
              <div className="flex flex-wrap gap-1">
                {spot.tags.slice(0, 3).map((t) => (
                  <span
                    key={t.slug}
                    className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600"
                  >
                    #{t.label}
                  </span>
                ))}
              </div>
            ) : null}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

  if (variant === "featured") {
    return (
      <Link href={href} className="group block">
        <Card className="overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
          {/* 이미지 더 크게 */}
          <div className="relative aspect-[16/10] bg-neutral-100">
            <Image
              src={imageSrc}
              alt={spot.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 90vw, 33vw"
              priority={false}
            />
          </div>

          <CardContent className="space-y-2 p-5">
            <h3 className="line-clamp-1 text-[17px] font-semibold text-neutral-900">
              {spot.name}
            </h3>

            <p className="line-clamp-2 text-sm text-neutral-600">{spot.summary}</p>

            {spot.tags.length ? (
              <div className="flex flex-wrap gap-1 pt-1">
                {spot.tags.slice(0, 4).map((t) => (
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

  // ✅ 기존 grid 버전 (원본 최대 유지)
  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
        <div className="relative h-44 bg-neutral-100">
          <Image
            src={imageSrc}
            alt={spot.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 24vw"
          />
        </div>

        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-semibold">{spot.name}</h3>
          </div>

          <p className="line-clamp-2 text-sm text-neutral-500">{spot.summary}</p>

          {spot.tags.length ? (
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