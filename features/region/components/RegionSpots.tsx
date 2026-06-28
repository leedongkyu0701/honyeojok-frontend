"use client";

import Link from "next/link";
import EmptyState from "@/shared/ui/EmptyState";
import SpotCard from "@/features/spot/components/SpotCard";
import type { SpotCardResponse } from "@/features/spot/types/spots";
import HorizontalRail from "@/shared/ui/HorizontalRail";
import Button from "@/shared/ui/Button";

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
      <HorizontalRail itemClassName="w-[85%] sm:w-[48.5%] lg:w-[32%]">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </HorizontalRail>

      {destinationSlug ? (
        <div className="flex justify-end">
          <Link href={`/spots/${destinationSlug}`}>
            <Button variant="ghost" size="sm">
             더 많은 장소 보기 →
            </Button>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
