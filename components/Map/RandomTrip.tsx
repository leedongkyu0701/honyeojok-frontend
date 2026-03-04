"use client";

import { useMemo, useState, useRef } from "react";
import type { DestinationMapResponse } from "@/types/destinations";
import { fetchDestinationMapData } from "@/lib/api/destination/api";
import { useQuery } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import dynamic from "next/dynamic";
import { tags } from "@/types/tag";
import { cn } from "@/lib/utils";

const RandomMap = dynamic(() => import("@/components/Map/RandomMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full" />,
});

export default function RandomTrip() {
  const [randomPoint, setRandomPoint] =
    useState<DestinationMapResponse | null>(null);
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  


  const { data: destinationMapPoints, isLoading, isError } =
    useQuery<DestinationMapResponse[]>({
      queryKey: ["destinations", "map"],
      queryFn: fetchDestinationMapData,
      refetchOnReconnect: false,
    });

  const tagList = tags.slice(0, 20);

  const filteredPoints = useMemo(() => {
    if (!destinationMapPoints) return [];
    if (selectedTagSlugs.length === 0) return destinationMapPoints;

    return destinationMapPoints.filter((d) =>
      d.tagSlugs?.some((t) => selectedTagSlugs.includes(t)),
    );

    
  }, [destinationMapPoints, selectedTagSlugs]);

  function toggleTag(slug: string) {
    setSelectedTagSlugs((prev) => {
      const exists = prev.includes(slug);
      if (exists) return prev.filter((t) => t !== slug);

      if (prev.length >= 3) return prev;

      return [...prev, slug];
    });
  }

  function onRandomButtonClick() {
  if (!filteredPoints.length) {
    setRandomPoint(null);
    return;
  }

  if (filteredPoints.length === 1) {
    setRandomPoint(filteredPoints[0]);
    return;
  }

  const prevId = randomPoint?.id;
  const candidates = prevId
    ? filteredPoints.filter((p) => p.id !== prevId)
    : filteredPoints;

  setRandomPoint(candidates[Math.floor(Math.random() * candidates.length)]);
  mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
}

  const isFilteredEmpty =
    !isLoading &&
    !isError &&
    destinationMapPoints &&
    destinationMapPoints.length > 0 &&
    filteredPoints.length === 0 &&
    selectedTagSlugs.length > 0;

  return (
    <div className="space-y-10 py-10">
      <Container className="space-y-6">
        <SectionHeader
          title="랜덤여행 바로가기"
          description={
            <>
              태그를 최대 3개까지 골라서,<br /> 그 분위기에 맞는 여행지를 랜덤으로 추천해요.
            </>
          }
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            onClick={onRandomButtonClick}
            disabled={isLoading || isError}
          >
            {randomPoint ? "다른 여행지 추천" : "랜덤 여행지 추천"}
          </Button>

          <div className="text-sm text-gray-600">
            태그 {selectedTagSlugs.length}/3 선택
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
            {tagList.map((t) => {
              const selected = selectedTagSlugs.includes(t.slug);

              return (
                <Button
                  key={t.slug}
                  type="button"
                  onClick={() => toggleTag(t.slug)}
                  className={cn(
                    "ring-1 ring-black/10 text-sm",
                    selected
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-50 text-gray-800",
                  )}
                  aria-pressed={selected}
                >
                  #{t.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-gray-600">
            최대 3개까지 선택 가능해요.
            <br />
            (선택한 태그 중 하나라도 포함되면 추천 대상이에요)
          </div>
        </div>
      </Container>

      <section className="bg-white py-8" ref={mapRef}>
        <Container>
          <div className="h-[60vh] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
            {isLoading ? <Skeleton className="h-full" /> : <RandomMap destination={randomPoint} />}
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

        {!isLoading && destinationMapPoints && destinationMapPoints.length === 0 ? (
          <EmptyState
            title="추천할 여행지가 없습니다."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}

        {isFilteredEmpty ? (
          <EmptyState
            title="선택한 태그에 맞는 여행지가 없어요."
            description="태그를 줄이거나 다른 조합으로 다시 골라주세요."
          />
        ) : null}
      </Container>
    </div>
  );
}