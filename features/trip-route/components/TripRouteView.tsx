"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTripRoutesByRegion } from "@/features/trip-route/api/trip-route.api";
import type { TripRouteCardResponse } from "@/features/trip-route/types/trip-routes";

import Container from "@/shared/ui/Container";
import SectionHeader from "@/shared/ui/SectionHeader";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";

import RouteCard from "./RouteCard";

export default function TripRouteView({ region }: { region: string }) {
  const {
    data: tripRoutes,
    isLoading,
    isError,
  } = useQuery<TripRouteCardResponse[]>({
    queryKey: ["trip-routes", region],
    queryFn: () => fetchTripRoutesByRegion(region),
  });

  return (
    <section className="py-10">
      <Container className="space-y-6">
        <SectionHeader
          title="추천 여행 루트"
          description={`${region} 에서 많이 저장되는 루트를 확인하세요.`}
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <EmptyState
            title="여행 루트를 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}

        {!isLoading && !isError && (tripRoutes?.length ?? 0) === 0 ? (
          <EmptyState
            title="아직 등록된 여행 루트가 없어요."
            description="금방 더 많은 여행 루트를 보여드릴게요."
          />
        ) : null}

        {!isLoading && !isError && (tripRoutes?.length ?? 0) > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tripRoutes?.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
