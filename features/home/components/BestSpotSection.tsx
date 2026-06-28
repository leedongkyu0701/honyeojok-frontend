"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import Container from "@/shared/ui/Container";
import SectionHeader from "@/shared/ui/SectionHeader";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";
import type { SpotCardResponse } from "@/features/spot/types/spots";
import { fetchRecommendedSpots } from "@/features/spot/api/spot.api";
import SpotCard from "@/features/spot/components/SpotCard";
import Link from "next/link";
import Button from "@/shared/ui/Button";
import HorizontalRail from "@/shared/ui/HorizontalRail";

function shuffle<T>(arr: T[], n: number) {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, n);
}

export default function BestSpotSection() {
  const {
    data: spots,
    isLoading,
    isError,
  } = useQuery<SpotCardResponse[]>({
    queryKey: ["spots", "recommended"],
    queryFn: fetchRecommendedSpots,
  });

  const pickedSpots = useMemo(() => {
    if (!spots || spots.length === 0) return [];
    return shuffle(spots, 10);
  }, [spots]);

  return (
    <section className="py-12 ">
      <Container className="space-y-6">
        <SectionHeader
          title="추천 스팟"
          description="혼자 가기 좋은 인기있는 장소를 모아봤어요."
          action={
            <Link href="/spots">
              <Button variant="ghost" size="sm">
                스팟 전체보기 →
              </Button>
            </Link>
          }
        />

        {isLoading ? (
          <HorizontalRail
            itemClassName="w-[44%] sm:w-[48.5%] md:w-[32%] lg:w-[23.5%]"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full rounded-2xl" />
            ))}
          </HorizontalRail>
        ) : null}

        {isError ? (
          <EmptyState
            title="스팟을 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}

        {!isLoading && !isError && (!spots || spots.length === 0) ? (
          <EmptyState
            title="추천 스팟이 아직 없어요."
            description="조금만 기다려주세요!"
          />
        ) : null}

        {!isLoading && !isError && pickedSpots.length > 0 ? (
          <HorizontalRail
            itemClassName="w-[44%] sm:w-[48.5%] md:w-[32%] lg:w-[23.5%]"
          >
            {pickedSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </HorizontalRail>
        ) : null}
      </Container>
    </section>
  );
}
