"use client";

import type { DestinationCardResponse } from "@/features/destination/types/destinations";
import DestinationCard from "./DestinationCard";
import { useQuery } from "@tanstack/react-query";
import { fetchDestinations, type DestinationListResponse, type FetchDestinationsParams } from "@/features/destination/api/destination.api";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";
import { useEffect } from "react";
import { OverlayLoader } from "@/shared/ui/OverlayLoader";
import { keepPreviousData } from "@tanstack/react-query";

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
  const { data, isLoading, isError, isFetching, isPlaceholderData } = useQuery<
    DestinationListResponse<DestinationCardResponse>
  >({
    queryKey: ["destinations", { province, sort, page }],
    queryFn: () => fetchDestinations({ province, sort, take: PAGE_SIZE, page }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
   if (!isPlaceholderData && typeof data?.totalPages === "number") {
    onTotalPagesChange?.(Math.max(1, data.totalPages));
  }
  }, [onTotalPagesChange, data?.totalPages, isPlaceholderData]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
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

  if (!data?.data?.length) {
    return (
      <EmptyState
        title="조건에 맞는 여행지가 없어요."
        description="필터를 변경해보세요."
      />
    );
  }

  return (
    <div className="space-y-6 relative">
        <OverlayLoader show={isFetching && isPlaceholderData} /> 
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.data.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}
