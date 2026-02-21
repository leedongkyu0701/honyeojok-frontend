"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SpotCategorySection from "@/components/spot/SpotCategory";
import HotSpotList from "@/components/spot/HotSpotList";

import type { FindHotSpotsResponse, SpotCardResponse } from "@/types/spots";
import { SpotCategory } from "@/types/spots";

import { fetchHotSpots } from "@/lib/api/spot/api";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

type HotKey = "nature" |"activity" | "food" | "cafe" | "drink" | "etc";

const CATEGORY_TO_HOT_KEY: Record<SpotCategory, HotKey> = {
  nature: "nature",
  activity: "activity",
  food: "food",
  cafe: "cafe",
  drink: "drink",
  etc: "etc",
};

const HOT_SECTIONS = [
  ["nature", "자연"],
  ["activity", "액티비티"],
  ["food", "맛집"],
  ["cafe", "카페"],
  ["drink", "술/바"],
  ["etc", "기타"],
] as const;

export default function HotSpotView() {
  const { data, isLoading, isError } = useQuery<FindHotSpotsResponse>({
    queryKey: ["hotSpots"],
    queryFn: fetchHotSpots,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const [category, setCategory] = useState<SpotCategory | null>(
    SpotCategory.NATURE,
  );

  const items = useMemo<SpotCardResponse[]>(() => {
    if (!data) return [];
    if (category === null) return [];
    const key = CATEGORY_TO_HOT_KEY[category];
    return (data[key] ?? []) as SpotCardResponse[];
  }, [data, category]);

  if (isLoading) {
    return (
      <div className="py-10">
        <Container className="space-y-6">
          <SectionHeader
            title="핫한 스팟"
            description="전체 지역 인기 스팟 모음"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-10">
        <Container>
          <EmptyState
            title="핫스팟을 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Container className="space-y-6">
        <SectionHeader
          title="핫한 스팟"
          description="전체 지역에서 카테고리별 상위 스팟을 모았어요."
        />

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs text-neutral-500">카테고리</div>
          <div className="mt-3">
            <SpotCategorySection value={category} onChange={setCategory} />
          </div>
        </div>

        {category === null ? (
          <div className="space-y-10">
            {HOT_SECTIONS.map(([key, label]) => {
              const list = (data[key] ?? []) as SpotCardResponse[];
              if (!list.length) return null;

              return (
                <section key={key} className="space-y-4">
                  <div className="flex items-end justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {label}
                    </h2>
                    <span className="text-xs text-neutral-500">
                      {Math.min(list.length, 10)}개
                    </span>
                  </div>

                  <HotSpotList spots={list} limit={10} topN={3} showRank />
                </section>
              );
            })}
          </div>
        ) : items.length ? (
          <HotSpotList spots={items} limit={10} topN={3} showRank />
        ) : (
          <EmptyState
            title="해당 카테고리의 스팟이 없어요."
            description="다른 카테고리를 선택해보세요."
          />
        )}
      </Container>
    </div>
  );
}
