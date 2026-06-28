"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedDestinations } from "@/features/destination/api/destination.api";

import Link from "next/link";
import Container from "@/shared/ui/Container";
import SectionHeader from "@/shared/ui/SectionHeader";
import Button from "@/shared/ui/Button";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";

import HorizontalRail from "@/shared/ui/HorizontalRail";
import MainDestinationCard from "@/features/destination/components/DestinationMainCard";

export default function BestDestinationSection() {
  const { data, isLoading, isError } = useQuery({
    // useQuery의 반환 값은 자동으로 타입 추론이 되므로, data 타입을 명시적으로 지정 안하는게 실무적이라고 한다.
    queryKey: ["destinations", "recommended"],
    queryFn: fetchRecommendedDestinations,
  });

  return (
    <section className="py-12 bg-neutral-50">
      <Container className="space-y-6">
        <SectionHeader
          title="이달의 추천지역"
          description="혼자 떠나기 좋은 지역을 편집팀이 직접 선정했어요."
          action={
            <Link href="/destinations">
              <Button variant="ghost" size="sm">
                여행지 전체보기 →
              </Button>
            </Link>
          }
        />

        {isLoading ? (
          <HorizontalRail itemClassName="w-[85%] sm:w-[48.5%] lg:w-[32%]">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full rounded-2xl" />
            ))}
          </HorizontalRail>
        ) : null}

        {isError ? (
          <EmptyState
            title="추천 여행지를 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}

        {!isLoading && !isError && data?.length === 0 ? (
          <EmptyState
            title="아직 추천 여행지가 없어요."
            description="곧 새로운 여행지를 추천해드릴게요."
          />
        ) : null}

        {!isLoading && !isError && data && data.length > 0 ? (
          <HorizontalRail itemClassName="w-[85%] sm:w-[48.5%] lg:w-[32%]">
            {data.map((destination) => (
              <MainDestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </HorizontalRail>
        ) : null}
      </Container>
    </section>
  );
}
