"use client";
import type { SpotCardVM } from "@/types/spots";
import SpotCard from "./SpotCard";
import { useQuery } from "@tanstack/react-query";
import { fetchSpotsByRegion } from "@/lib/api/spot/api";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { useEffect } from "react";

export default function SpotList({
  tag,
  page,
  onTotalPagesChange,
  region
}: {
  tag: string | null;
  page: number;
  onTotalPagesChange?: (total: number) => void;
    region: string;
}) {

    const {
      data: results,
      isLoading,
      isError,
    } = useQuery<{
      data: SpotCardVM[];
      totalPages: number;   
    }>({
      queryKey: ["spots", { tag, page, region }],
      queryFn: () => fetchSpotsByRegion(tag, page, region),
    });

    useEffect(() => {
        onTotalPagesChange?.(results?.totalPages ?? 1);
    }, [onTotalPagesChange, results?.totalPages]);

    if (isLoading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-48" />
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
          description="다른 태그를 선택해보세요."
        />
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results?.data.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    );

}