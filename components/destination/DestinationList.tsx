"use client";

import type { DestinationCardResponse } from "@/types/destinations";
import DestinationCard from "./DestinationCard";
import { useQuery } from "@tanstack/react-query";
import { fetchDestinations, type DestinationListResponse, type FetchDestinationsParams } from "@/lib/api/destination/api";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { useEffect } from "react";

const PAGE_SIZE = 12;

export default function DestinationList({
  province,
  sort,
  page,
  onTotalPagesChange,
}: {
  province: FetchDestinationsParams["province"];
  sort: FetchDestinationsParams["sort"];
  page: number;
  onTotalPagesChange?: (total: number) => void;
}) {
  const { data, isLoading, isError } = useQuery<
    DestinationListResponse<DestinationCardResponse>
  >({
    queryKey: ["destinations", { province, sort, page }],
    queryFn: () => fetchDestinations({ province, sort, take: PAGE_SIZE, page }),
  });

  useEffect(() => {
    onTotalPagesChange?.(data?.totalPages ?? 1);
  }, [onTotalPagesChange, data?.totalPages]);

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

  if (!(data?.data.length ?? 0)) {
    return (
      <EmptyState
        title="조건에 맞는 여행지가 없어요."
        description="필터를 변경해보세요."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data!.data.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>

      <p className="text-sm text-neutral-500">
        {data!.data.length}개 표시
      </p>
    </div>
  );
}
