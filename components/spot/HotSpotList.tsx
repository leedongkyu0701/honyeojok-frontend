"use client";

import type { SpotCardResponse } from "@/types/spots";
import SpotCard from "@/components/spot/SpotCard";

type Props = {
  spots: SpotCardResponse[];
  limit?: number;     // default 10
  topN?: number;      // default 3
  showRank?: boolean; // default true
};

function MedalBadge({ rank }: { rank: number }) {
  // 1~3: 메달 느낌, 4~: 심플 숫자
  if (rank === 1) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
        <span aria-hidden>🏆</span>
        <span>1위</span>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800 ring-1 ring-neutral-200">
        <span aria-hidden>🥈</span>
        <span>2위</span>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-900 ring-1 ring-orange-200">
        <span aria-hidden>🥉</span>
        <span>3위</span>
      </div>
    );
  }

  return (
    <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-neutral-900 px-2 text-xs font-semibold text-white">
      {rank}
    </div>
  );
}

export default function HotSpotList({ spots, limit = 10, topN = 3, showRank = true }: Props) {
  const sliced = (spots ?? []).slice(0, limit);
  if (!sliced.length) return null;

  const top = sliced.slice(0, topN);
  const rest = sliced.slice(topN);

  return (
    <div className="space-y-6">
      {/* TOP 1~3 Big cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {top.map((spot, idx) => {
          const rank = idx + 1;
          return (
            <div key={spot.id} className="relative">
              {showRank ? (
                <div className="absolute left-3 top-3 z-10">
                  <MedalBadge rank={rank} />
                </div>
              ) : null}
              <SpotCard spot={spot} variant="featured" />
            </div>
          );
        })}
      </div>

      {/* 4~10 Row list */}
      {rest.length ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <ul className="divide-y divide-neutral-100">
            {rest.map((spot, idx) => {
              const rank = topN + idx + 1;
              return (
                <li key={spot.id} className="flex items-start gap-3 p-4">
                  {showRank ? (
                    <div className="pt-0.5">
                      <MedalBadge rank={rank} />
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <SpotCard spot={spot} variant="row" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}