"use client";

import { useQuery } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

import RouteCard from "../trip-route/RouteCard";
import type { TripRouteCardResponse } from "@/types/trip-routes";
import { fetchHotRoutes } from "@/lib/api/trip-route/api";

export default function BestRouteSection() {
  const { data, isLoading, isError } = useQuery<TripRouteCardResponse[]>({
    queryKey: ["trip-routes", "hot"],
    queryFn: fetchHotRoutes,
  });

  if (isLoading) {
  return (
    <section className="py-12">
      <Container className="space-y-6">
        <SectionHeader
          title="인기 여행 루트"
          description="지금 가장 많이 저장되는 루트를 확인하세요."
        />

        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:auto-rows-fr">
          <div className="lg:col-span-6 lg:row-span-2">
            <Skeleton className="h-80" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:contents">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="lg:col-span-3">
                <Skeleton className="h-36" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

  if (isError || !data || data.length === 0) {
    return (
      <section className="py-12">
        <Container className="space-y-6">
          <SectionHeader
            title="인기 여행 루트"
            description="지금 가장 많이 저장되는 루트를 확인하세요."
          />
          <EmptyState
            title="여행 루트를 불러오지 못했어요."
            description={"잠시 후 다시 시도해주세요."}
          />
        </Container>
      </section>
    );
  }

  const [featured, ...rest] = data;
  const list = rest.slice(0, 4);

  return (
    <section className="py-12 bg-neutral-50">
      <Container className="space-y-6">
        <SectionHeader
          title="인기 여행 루트"
          description="지금 가장 많이 저장되는 루트를 확인하세요."
        />

        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:auto-rows-fr ">
          <div className="lg:col-span-6 lg:row-span-2">
            <RouteCard route={featured} variant="featured" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:contents">
            {list.map((route) => (
              <div key={route.id} className="lg:col-span-3 ">
                <RouteCard route={route} variant="default" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
