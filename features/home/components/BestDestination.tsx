"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";
import { fetchWeeklyPick } from "@/features/destination/api/destination.api";

export default function WeeklyPickCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["destinations", "weekly-pick"],
    queryFn: fetchWeeklyPick,
  });

  if (isLoading) {
    return <Skeleton className="h-72 rounded-3xl lg:h-96" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="추천 여행지를 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  const FALLBACK_IMAGE = "/images/fallback.png";
  const src = data.imageUrl ?? FALLBACK_IMAGE;

  return (
    <Link href={`/destinations/${data.slug}`} className="group block">
      <div className="relative h-72 overflow-hidden rounded-3xl bg-neutral-100 shadow-lg lg:h-96">
        <Image
          src={src}
          alt={data.name}
          fill
          preload
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 80vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/10 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
          <p className="text-sm uppercase tracking-widest text-white/80">
            weekly Editor&apos;s pick
          </p>

          <p className="text-2xl font-semibold leading-tight">{data.name}</p>

          <div className="pt-2 text-sm text-white/90">
            자세히 보기{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
