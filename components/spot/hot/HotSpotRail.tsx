"use client";

import type { SpotCardVM } from "@/types/spots";
import HotSpotCard from "./HotSpotCard";

export default function HotSpotRail({ items }: { items: SpotCardVM[] }) {
  return (
    <div className="relative -mx-4 pl-4 pr-0">
      <div
        className="flex gap-5 overflow-x-auto pb-2 pt-1
                   snap-x snap-mandatory
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((spot) => (
          <div key={spot.id} className="snap-start shrink-0">
            <HotSpotCard spot={spot} />
          </div>
        ))}
      </div>

      {/* 오른쪽 페이드: '옆으로 더 있음' 힌트 */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
