// src/components/spot/SpotList.tsx
"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import type { SpotCardResponse, SpotCategory } from "@/types/spots";
import { fetchSpotsByRegion } from "@/lib/api/spot/api";

import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import SpotCard from "./SpotCard";

export default function SpotList({
  region,
  category,
  page,
  take = 8,
  onTotalPagesChange,
}: {
  region: string;
  category: SpotCategory | null;
  page: number;
  take?: number;
  onTotalPagesChange?: (total: number) => void;
}) {
  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["spots", { region, category, page, take }],
    queryFn: () =>
      fetchSpotsByRegion(region, {
        category,
        page,
        take,
      }),
    staleTime: 1000 * 15,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    onTotalPagesChange?.(results?.totalPages ?? 1);
  }, [onTotalPagesChange, results?.totalPages]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-neutral-100 p-4 last:border-b-0">
            <Skeleton className="h-20" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="스팟을 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  if (!(results?.data.length ?? 0)) {
    return (
      <EmptyState
        title="스팟이 없어요."
        description="다른 카테고리를 선택해보세요."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <ul className="divide-y divide-neutral-100">
        {results!.data.map((spot: SpotCardResponse) => (
          <li key={spot.id} className="p-4">
            <SpotCard spot={spot} variant="row" />
          </li>
        ))}
      </ul>
    </div>
  );
}
