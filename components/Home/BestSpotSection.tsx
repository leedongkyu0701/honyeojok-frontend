"use client";

import { useQuery } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import type { SpotCardVM } from "@/types/spots";
import { fetchRecommendedSpots } from "@/lib/api/spot/api";
import SpotCard from "@/components/spot/SpotCard";
import Link from "next/link";
import Button from "@/components/common/Button";
import HorizontalRail from "@/components/common/HorizontalRail";

export default function BestSpotSection() {
  const { data: spots, isLoading, isError } = useQuery<SpotCardVM[]>({
    queryKey: ["spots", "recommended"],
    queryFn: fetchRecommendedSpots,
  });

  return (
    <section className="py-12">
      <Container className="space-y-6">
        <SectionHeader
          title="추천 스팟"
          description="혼자 가기 좋은 스팟을 모아봤어요."
          action={
            <Link href="/spots">
              <Button variant="ghost" size="sm">
                스팟 전체보기 →
              </Button>
            </Link>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <EmptyState
            title="스팟을 불러오지 못했어요."
            description={"잠시 후 다시 시도해주세요."}
          />
        ) : null}

        {!isLoading && !isError && spots && spots.length > 0 ? (
          <HorizontalRail itemClassName="w-[85%] sm:w-[48%] md:w-[40%] lg:w-[24%]">
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </HorizontalRail>
        ) : null}
      </Container>
    </section>
  );
}
