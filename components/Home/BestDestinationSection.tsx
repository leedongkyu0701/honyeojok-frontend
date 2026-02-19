"use client";

import { useQuery } from "@tanstack/react-query";
import type { DestinationCardResponse } from "@/types/destinations";
import { fetchRecommendedDestinations } from "@/lib/api/destination/api";

import Link from "next/link";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Button from "@/components/common/Button";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

import HomeCarouselRail from "@/components/common/HomeCarouselRail";
import MainDestinationCard from "@/components/destination/DestinationMainCard";

export default function BestDestinationSection() {
  const { data, isLoading, isError } = useQuery<DestinationCardResponse[]>({
    queryKey: ["destinations", "recommended"],
    queryFn: fetchRecommendedDestinations,
  });

  return (
    <section className="py-12">
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
          <HomeCarouselRail itemClassName="w-[85%] sm:w-[48%] md:w-[40%] lg:w-[24%]">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full rounded-2xl" />
            ))}
          </HomeCarouselRail>
        ) : null}

        {isError || data?.length === 0 ? (
          <EmptyState
            title="추천 여행지를 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}

        {!isLoading && !isError && data && data.length > 0 ? (
          <HomeCarouselRail itemClassName="w-[85%] sm:w-[48%] md:w-[40%] lg:w-[24%]">
            {data.map((destination) => (
              <MainDestinationCard key={destination.id} destination={destination} />
            ))}
          </HomeCarouselRail>
        ) : null}
      </Container>
    </section>
  );
}
