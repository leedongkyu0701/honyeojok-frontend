"use client";
import { useState } from "react";
import type { DestinationMapResponse } from "@/types/destinations";
import { fetchDestinationMapData } from "@/lib/api/destination/api";
import { useQuery } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import dynamic from "next/dynamic";

// ✅ 핵심: 지도 컴포넌트는 ssr:false
const RandomMap = dynamic(() => import("@/components/Map/RandomMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full" />,
});

export default function RandomTrip() {
  const [randomPoint, setRandomPoint] = useState<DestinationMapResponse | null>(null);

  const {
    data: destinationMapPoints,
    isLoading,
    isError,
  } = useQuery<DestinationMapResponse[]>({
    queryKey: ["destinations", "map"],
    queryFn: fetchDestinationMapData,
    staleTime: 1000 * 60 * 5, // 5분 fresh
    gcTime: 1000 * 60 * 30, // 30분 캐시 유지
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  function onRandomButtonClick() {
    if (!destinationMapPoints || destinationMapPoints.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * destinationMapPoints.length);
    setRandomPoint(destinationMapPoints[randomIndex]);
  }

  return (
    <div className="space-y-10 py-10">
      <Container className="space-y-6">
        <SectionHeader
          title="랜덤여행 바로가기"
          description="당신이 떠날 여행지를 랜덤으로 추천합니다."
        />

        <Button size="lg" onClick={onRandomButtonClick}>
          {randomPoint ? "다른 여행지 추천" : "랜덤 여행지 추천"}
        </Button>
      </Container>

      <section className="bg-white py-8">
        <Container>
          <div className="h-[60vh] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
            {isLoading ? (
              <Skeleton className="h-full" />
            ) : (
              <RandomMap destination={randomPoint} />
            )}
          </div>
        </Container>
      </section>

      <Container className="space-y-4">
        {isError ? (
          <EmptyState
            title="랜덤 여행지를 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}

        {!isLoading &&
        destinationMapPoints &&
        destinationMapPoints.length === 0 ? (
          <EmptyState
            title="추천할 여행지가 없습니다."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}
      </Container>
    </div>
  );
}
