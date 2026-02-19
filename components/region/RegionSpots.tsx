"use client";

import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import SpotCard from "@/components/spot/SpotCard";
import type { SpotCardResponse } from "@/types/spots";
import HorizontalRail from "@/components/common/HorizontalRail";

export default function RegionSpots({ spots }: { spots: SpotCardResponse[] }) {
  if (!spots?.length) {
    return (
      <EmptyState
        title="아직 등록된 장소가 없어요."
        description="금방 더 많은 명소를 보여드릴게요."
      />
    );
  }

  const destinationSlug = spots[0]?.destination.slug;

  return (
    <section className="space-y-4">
      <HorizontalRail
        // ✅ 상세 탭은 카드가 6개 정도라, 데스크탑에서 3개쯤 보이는 폭이 예쁨
        itemClassName="w-[78%] sm:w-[48%] lg:w-[32%]"
        showControls
        showFade={false}
      >
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </HorizontalRail>

      {destinationSlug ? (
        <div className="flex justify-end">
          <Link
            href={`/spots/${destinationSlug}`}
            className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            더 많은 여행 장소 보기
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
