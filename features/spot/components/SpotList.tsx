"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import type { SpotCategory } from "@/features/spot/types/spots";
import { fetchSpotsByRegion } from "@/features/spot/api/spot.api";

import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";
import SpotCard from "./SpotCard";
import { OverlayLoader } from "@/shared/ui/OverlayLoader";
import { keepPreviousData } from "@tanstack/react-query";

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
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["spots", { region, category, page, take }],
    queryFn: () =>
      fetchSpotsByRegion(region, {
        category,
        page,
        take,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
       if (!isPlaceholderData && typeof results?.totalPages === "number") {
    onTotalPagesChange?.(Math.max(1, results.totalPages));
  }
  }, [onTotalPagesChange, results?.totalPages, isPlaceholderData]);

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

  if (!results || results.data.length === 0) {
    return (
      <EmptyState
        title="스팟이 없어요."
        description="다른 카테고리를 선택해보세요."
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <OverlayLoader show={isFetching && isPlaceholderData} /> 
      <ul className="divide-y divide-neutral-100">
        {results.data.map((spot) => (
          <li key={spot.id} className="p-4">
            <SpotCard spot={spot} variant="list" />
          </li>
        ))}
      </ul>
    </div>
  );
}
