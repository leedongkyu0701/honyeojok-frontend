"use client";

import type { SpotCardResponse } from "@/features/spot/types/spots";
import SpotCard from "@/features/spot/components/SpotCard";
import { Trophy, Medal } from "lucide-react";
import Badge from "@/shared/ui/Badge";
import { cn } from "@/shared/lib/utils";

type Props = {
  spots: SpotCardResponse[];
  limit?: number;
  topN?: number; 
  showRank?: boolean;
};

function RankBadge({ rank }: { rank: number }) {
  const isTop = rank <= 3;

  if (!isTop) {
    return (
      <Badge className="h-6 min-w-6 justify-center bg-neutral-900 px-2 text-white">
        {rank}
      </Badge>
    );
  }

  const config =
    rank === 1
      ? { Icon: Trophy, cls: "bg-amber-100 text-amber-900 ring-1 ring-amber-200" }
      : rank === 2
      ? { Icon: Medal, cls: "bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200" }
      : { Icon: Medal, cls: "bg-orange-100 text-orange-900 ring-1 ring-orange-200" };

  const { Icon, cls } = config;

  return (
    <Badge className={cn("gap-1 font-semibold", cls)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{rank}위</span>
    </Badge>
  );
}

export default function HotSpotList({ spots, limit = 10, topN = 3, showRank = true }: Props) {
  const sliced = (spots ?? []).slice(0, limit);
  if (!sliced.length) return null;

  const top = sliced.slice(0, topN);
  const rest = sliced.slice(topN);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {top.map((spot, idx) => {
          const rank = idx + 1;
          return (
            <div key={spot.id} className="relative">
              {showRank ? (
                <div className="absolute left-3 top-3 z-10">
                  <RankBadge rank={rank} />
                </div>
              ) : null}
              <SpotCard spot={spot} variant="featured" />
            </div>
          );
        })}
      </div>

      {rest.length ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <ul className="divide-y divide-neutral-100">
            {rest.map((spot, idx) => {
              const rank = topN + idx + 1;
              return (
                <li key={spot.id} className="flex items-start gap-3 p-4">
                  {showRank ? (
                    <div className="pt-0.5">
                      <RankBadge rank={rank} />
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <SpotCard spot={spot} variant="list" />
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