"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedDestinations } from "@/features/destination/api/destination.api";

import Container from "@/shared/ui/Container";
import LinkButton from "@/shared/ui/LinkButton";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";

import HorizontalRail from "@/shared/ui/HorizontalRail";
import MainDestinationCard from "@/features/destination/components/DestinationMainCard";

export default function BestDestinationSection() {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["destinations", "recommended"],
    queryFn: fetchRecommendedDestinations,
  });

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-12 sm:py-16" aria-labelledby="home-destinations-title">
      <Container className="space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="home-destinations-title" className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              혼자 가기 좋은 여행지
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-neutral-600">
              마음에 드는 지역을 고르고, 가볼 장소와 추천 루트를 살펴보세요.
            </p>
          </div>
          <LinkButton href="/destinations" variant="outline" className="min-h-11 shrink-0 self-start sm:self-auto">
            여행지 전체보기 →
          </LinkButton>
        </div>

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
            actionLabel={isFetching ? "다시 불러오는 중…" : "다시 시도"}
            onAction={() => void refetch({ cancelRefetch: false })}
            actionDisabled={isFetching}
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
