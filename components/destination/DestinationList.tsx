"use client";
import type { DestinationCardVM } from "@/types/destinations";
import DestinationCard from "./DestinationCard";
import { useQuery } from "@tanstack/react-query";
import { fetchDestinations } from "@/lib/api/destination/api";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { useEffect } from "react";
import { DestinationListResponse } from "@/lib/api/destination/api";
import { FetchDestinationsParams } from "@/lib/api/destination/api";

const PAGE_SIZE = 12;

export default function DestinationList({
  province,
  sort,
  query,
  page,
  onTotalPagesChange,
}: {
  province: FetchDestinationsParams["province"];
  sort: FetchDestinationsParams["sort"];
  query: string | null;
  page: number;
  onTotalPagesChange?: (total: number) => void;
}) {
  const {
    data: results,
    isLoading,
    isError,
  } = useQuery<DestinationListResponse<DestinationCardVM>>({
    queryKey: ["destinations", { province, sort, query, page }],
    queryFn: () => fetchDestinations({ province, sort, q: query, take: PAGE_SIZE, page }),
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
        title="여행지를 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  if (!(results?.data.length ?? 0)) {
    return (
      <EmptyState
        title="조건에 맞는 여행지가 없어요."
        description="필터를 변경하거나 검색어를 지워보세요."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(results?.data ?? []).map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination as DestinationCardVM}
          />
        ))}
      </div>
      <p className="text-sm text-neutral-500">
        {(results?.data ?? []).length}개의 여행지 중 {(results?.data ?? []).length}개 표시
      </p>
    </div>
  );
}
