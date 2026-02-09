"use client";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import HotSpotSection from "@/components/spot/hot/HotSpotSection";
import { useQuery } from "@tanstack/react-query";
import { fetchHotSpots } from "@/lib/api/spot/api";
import type { HotSpotsResponse } from "@/lib/api/spot/api";

export default function SpotsHomePage() {
  const { data, isLoading, isError } = useQuery<HotSpotsResponse>({
    queryKey: ["hot-spots"],
    queryFn: fetchHotSpots,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="py-10">
      <Container className="space-y-8">
        <SectionHeader
          title="핫한 혼행 스팟"
          description="지역 상관없이, 카테고리별 TOP 스팟을 모아봤어요."
        />

        {isLoading ? (
          <div className="space-y-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <section key={i} className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-3 overflow-hidden">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <Skeleton key={j} className="h-56 w-60 rounded-2xl" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="핫 스팟을 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        ) : !data ? (
          <EmptyState title="데이터가 없어요." description="곧 채워둘게요." />
        ) : (
          <div className="space-y-10">
            <HotSpotSection
              title="힐링 (자연) TOP 10"
              description="조용히 쉬고 싶은 날"
              items={data.healing}
            />
            <HotSpotSection
              title="혼밥 TOP 10"
              description="혼자여도 맛있게"
              items={data.foodie}
            />
            <HotSpotSection
              title="액티비티 TOP 10"
              description="몸 움직이며 리셋"
              items={data.activity}
            />
            <HotSpotSection
              title="혼술 TOP 10"
              description="가볍게 한 잔"
              items={data.honsool}
            />
            <HotSpotSection
              title="카페 TOP 10"
              description="혼자 머물기 좋은 공간"
              items={data.cafe}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
