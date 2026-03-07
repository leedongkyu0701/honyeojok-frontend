"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SpotCategorySection from "@/components/spot/SpotCategory";
import HotSpotList from "@/components/spot/HotSpotList";

import type {
  FindHotSpotsResponse,
  SpotCardResponse,
  SpotCategory,
} from "@/types/spots";
import { SpotCategory as SpotCategoryEnum } from "@/types/spots";

import { fetchHotSpots } from "@/lib/api/spot/api";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { SPOT_CATEGORY_ITEMS } from "@/lib/spotCategory";
import Badge from "../common/Badge";

export default function HotSpotView() {
  const { data, isLoading, isError } = useQuery<FindHotSpotsResponse>({
    queryKey: ["hotSpots"],
    queryFn: fetchHotSpots,
  });

  const [category, setCategory] = useState<SpotCategory | null>(
    SpotCategoryEnum.NATURE,
  );

  const items = useMemo<SpotCardResponse[]>(() => {
    if (!data || category === null) return [];
    return (data[category] ?? []) as SpotCardResponse[];
  }, [data, category]);

  const sections = useMemo(() => {
    if (!data) return [];
    return SPOT_CATEGORY_ITEMS.filter((x) => x.value !== null)
      .map(({ value, label }) => {
        const list = (data[value as SpotCategory] ?? []) as SpotCardResponse[];
        return { key: value as SpotCategory, label, list };
      })
      .filter((s) => s.list.length > 0);
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-neutral-100 p-4 last:border-b-0"
            >
              <Skeleton className="h-16" />
            </div>
          ))}
        </div>
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
      <Container className="space-y-6 ">
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

        {category === null ? ( // 전체 선택시 섹션별로 보여주기
          <div className="space-y-20 mt-20">
            {sections.map(({ key, label, list }) => (
              <section key={key} className="space-y-6">
                <div className="flex items-end gap-2">
                  <h2 className="pl-2 text-xl font-semibold text-neutral-900">
                    {label}
                  </h2>

                  <Badge className="shrink-0">
                    TOP {Math.min(list.length, 10)}
                  </Badge>
                </div>

                <HotSpotList spots={list} limit={10} topN={3} showRank />
              </section>
            ))}
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
