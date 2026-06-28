"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import Container from "@/shared/ui/Container";
import SectionHeader from "@/shared/ui/SectionHeader";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";

import RouteCard from "@/features/trip-route/components/RouteCard";
import type { TripRouteCardResponse } from "@/features/trip-route/types/trip-routes";
import { fetchHotRoutes } from "@/features/trip-route/api/trip-route.api";

const ROUTE_GRID_CLASS = "grid gap-4 lg:grid-cols-12 lg:grid-rows-2";
const SKELETON_COUNT = 4;

export default function BestRouteSection() {
  const {
    data: routes = [],
    isLoading,
    isError,
  } = useQuery<TripRouteCardResponse[]>({
    queryKey: ["trip-routes", "hot"],
    queryFn: fetchHotRoutes,
  });

  let content: ReactNode;

  if (isLoading) {
    content = (
      <div className={ROUTE_GRID_CLASS}>
        <div className="lg:col-span-6 lg:row-span-2">
          <Skeleton className="h-80 rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:contents">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div key={index} className="lg:col-span-3">
              <Skeleton className="h-36 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (isError) {
    content = (
      <EmptyState
        title="여행 루트를 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  } else if (routes.length === 0) {
    content = (
      <EmptyState
        title="인기 여행 루트가 아직 없어요."
        description="새로운 루트가 저장되면 이곳에 표시돼요."
      />
    );
  } else {
    const [featured, ...rest] = routes;
    const list = rest.slice(0, 4);

    content = (
      <div className={ROUTE_GRID_CLASS}>
        <div className="lg:col-span-6 lg:row-span-2">
          <RouteCard route={featured} variant="featured" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:contents">
          {list.map((route) => (
            <div key={route.id} className="lg:col-span-3">
              <RouteCard route={route} variant="default" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-neutral-50 py-12">
      <Container className="space-y-6">
        <SectionHeader
          title="인기 여행 루트"
          description="지금 가장 많이 저장되는 루트를 확인하세요."
        />

        {content}
      </Container>
    </section>
  );
}