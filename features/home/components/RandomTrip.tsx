"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";

import type { DestinationMapResponse } from "@/features/destination/types/destinations";
import { fetchDestinationMapData } from "@/features/destination/api/destination.api";
import Container from "@/shared/ui/Container";
import SectionHeader from "@/shared/ui/SectionHeader";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import Skeleton from "@/shared/ui/Skeleton";
import { TAGS } from "@/shared/constants/tags";
import { cn } from "@/shared/lib/utils";

const RandomMap = dynamic(() => import("@/features/home/components/RandomMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full" />,
});

const MAX_SELECTED_TAGS = 3;
const TAG_LIST_LIMIT = 20;

export default function RandomTrip() {
  const [randomPoint, setRandomPoint] =
    useState<DestinationMapResponse | null>(null);
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const {
    data: destinationMapPoints,
    isLoading,
    isError,
  } = useQuery<DestinationMapResponse[]>({
    queryKey: ["destinations", "map"],
    queryFn: fetchDestinationMapData,
    refetchOnReconnect: false,
  });

  const tagList = TAGS.slice(0, TAG_LIST_LIMIT);

  const filteredPoints = useMemo(() => {
    if (!destinationMapPoints) return [];
    if (selectedTagSlugs.length === 0) return destinationMapPoints;

    return destinationMapPoints.filter((destination) =>
      destination.tagSlugs?.some((tagSlug) =>
        selectedTagSlugs.includes(tagSlug),
      ),
    );
  }, [destinationMapPoints, selectedTagSlugs]);

  const isFilteredEmpty =
    !isLoading &&
    !isError &&
    !!destinationMapPoints &&
    destinationMapPoints.length > 0 &&
    filteredPoints.length === 0 &&
    selectedTagSlugs.length > 0;

  const isRandomButtonDisabled = isLoading || isError || filteredPoints.length === 0;
  const randomButtonLabel = randomPoint ? "다른 여행지 추천" : "랜덤 여행지 추천";

  const mapContent = isLoading ? (
    <Skeleton className="h-full" />
  ) : (
    <RandomMap destination={randomPoint} />
  );

  let feedbackContent: ReactNode = null;

  if (isError) {
    feedbackContent = (
      <EmptyState
        title="랜덤 여행지를 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  } else if (!isLoading && destinationMapPoints?.length === 0) {
    feedbackContent = (
      <EmptyState
        title="추천할 여행지가 없습니다."
        description="잠시 후 다시 시도해주세요."
      />
    );
  } else if (isFilteredEmpty) {
    feedbackContent = (
      <EmptyState
        title="선택한 태그에 맞는 여행지가 없어요."
        description="태그를 줄이거나 다른 조합으로 다시 골라주세요."
      />
    );
  }

  function toggleTag(slug: string) {
    setSelectedTagSlugs((prev) => {
      const exists = prev.includes(slug);
      if (exists) return prev.filter((tagSlug) => tagSlug !== slug);

      if (prev.length >= MAX_SELECTED_TAGS) return prev;

      return [...prev, slug];
    });
  }

  function onRandomButtonClick() {
    if (!filteredPoints.length) {
      setRandomPoint(null);
      return;
    }

    const nextPoint =
      filteredPoints.length === 1
        ? filteredPoints[0]
        : (() => {
            const prevId = randomPoint?.id;
            const candidates = prevId
              ? filteredPoints.filter((point) => point.id !== prevId)
              : filteredPoints;

            return candidates[Math.floor(Math.random() * candidates.length)];
          })();

    setRandomPoint(nextPoint);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="space-y-10 py-10">
      <Container className="space-y-6">
        <SectionHeader
          title="랜덤여행 바로가기"
          description={
            <>
              태그를 최대 {MAX_SELECTED_TAGS}개까지 골라서,
              <br /> 그 분위기에 맞는 여행지를 랜덤으로 추천해요.
            </>
          }
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            onClick={onRandomButtonClick}
            disabled={isRandomButtonDisabled}
          >
            {randomButtonLabel}
          </Button>

          <div className="text-sm text-gray-600">
            태그 {selectedTagSlugs.length}/{MAX_SELECTED_TAGS} 선택
            {selectedTagSlugs.length > 0 ? (
              <button
                type="button"
                className="ml-2 underline underline-offset-2"
                onClick={() => setSelectedTagSlugs([])}
              >
                초기화
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl bg-white px-4 py-4 shadow ring-1 ring-black/5">
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag) => {
              const selected = selectedTagSlugs.includes(tag.slug);
              const disabled =
                !selected && selectedTagSlugs.length >= MAX_SELECTED_TAGS;

              return (
                <Button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  disabled={disabled}
                  className={cn(
                    "ring-1 ring-black/10 text-sm",
                    selected
                      ? "bg-black text-white"
                      : "bg-white text-gray-800 hover:bg-gray-50",
                  )}
                  aria-pressed={selected}
                >
                  #{tag.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-gray-600">
            최대 {MAX_SELECTED_TAGS}개까지 선택 가능해요.
            <br />
            (선택한 태그 중 하나라도 포함되면 추천 대상이에요)
          </div>
        </div>
      </Container>

      <section className="bg-white py-8" ref={mapRef}>
        <Container>
          <div className="h-[60vh] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
            {mapContent}
          </div>
        </Container>
      </section>

      <Container className="space-y-4">{feedbackContent}</Container>
    </div>
  );
}