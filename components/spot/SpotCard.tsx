"use client";

import Link from "next/link";
import Image from "next/image";
import type { SpotCardResponse } from "@/types/spots";
import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";

const FALLBACK_IMAGE = "/images/fallback.png";

type Variant = "grid" | "row";

export default function SpotCard({
  spot,
  variant = "grid",
}: {
  spot: SpotCardResponse;
  variant?: Variant;
}) {
  const href = `/spots/${spot.destination.slug}/${spot.id}`;
  const imageSrc = spot.imageUrl ?? FALLBACK_IMAGE;

  // 카테고리 표기(원하면 라벨 매핑으로 바꿔도 됨)
  const categoryText = spot.category.toUpperCase();

  if (variant === "row") {
    return (
      <Link href={href} className="group block">
        <Card className="overflow-hidden rounded-2xl transition duration-300 group-hover:shadow-md">
          <div className="flex gap-4 p-4">
            {/* 썸네일 */}
            <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <Image
                src={imageSrc}
                alt={spot.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="112px"
              />

            </div>

            {/* 텍스트 */}
            <CardContent className="min-w-0 flex-1 space-y-2 p-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-1 text-base font-semibold">
                  {spot.name}
                </h3>
              </div>

              <p className="line-clamp-2 text-sm text-neutral-500">
                {spot.summary}
              </p>

              {spot.tags.length ? (
                <div className="flex flex-wrap gap-1">
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
          </div>
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
