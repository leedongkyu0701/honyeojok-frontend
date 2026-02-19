'use client';
import SpotCategorySection from "@/components/spot/SpotCategory"; // 파일명에 맞게
import { SpotCategory, FindHotSpotsResponse, SpotCardResponse } from "@/types/spots";
import { useQuery } from "@tanstack/react-query";
import { fetchHotSpots } from "@/lib/api/spot/api";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import SpotCard from "@/components/spot/SpotCard";
import { useMemo, useState } from "react";

type HotKey = "food" | "cafe" | "drink" | "activity" | "nature" | "etc";

const CATEGORY_TO_HOT_KEY: Record<SpotCategory, HotKey> = {
  food: "food",
  cafe: "cafe",
  drink: "drink",
  activity: "activity",
  nature: "nature",
  etc: "etc",
};

export default function HotSpotView() {
  const { data, isLoading, isError } = useQuery<FindHotSpotsResponse>({
    queryKey: ["hotSpots"],
    queryFn: fetchHotSpots,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const [category, setCategory] = useState<SpotCategory | null>(SpotCategory.FOOD);

  const items = useMemo<SpotCardResponse[]>(() => {
    if (!data) return [];
    if (category === null) {
      // 전체 모드: 모든 카테고리 합쳐서 10개씩? or 그냥 전부 합쳐서? (여기선 "섹션으로 보여주는게" 더 좋음)
      // 그래서 여기선 빈 배열 반환하고 아래에서 섹션 렌더로 처리하는게 깔끔.
      return [];
    }
    const key = CATEGORY_TO_HOT_KEY[category];
    return (data[key] ?? []) as SpotCardResponse[];
  }, [data, category]);

  if (isLoading) {
    return (
      <div className="py-10">
        <Container className="space-y-6">
          <SectionHeader title="핫한 스팟" description="전체 지역 인기 스팟 모음" />
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

        {/* ✅ 그대로 재활용 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs text-neutral-500">카테고리</div>
          <div className="mt-3">
            <SpotCategorySection value={category} onChange={setCategory} />
          </div>
        </div>

        {/* ✅ 전체 모드(=카테고리별로 10개씩) */}
        {category === null ? (
          <div className="space-y-10">
            {(
              [
                ["food", "맛집"],
                ["cafe", "카페"],
                ["drink", "술/바"],
                ["activity", "액티비티"],
                ["nature", "자연"],
                ["etc", "기타"],
              ] as const
            ).map(([key, label]) => {
              const list = (data[key] ?? []) as SpotCardResponse[];
              if (!list.length) return null;

              return (
                <section key={key} className="space-y-4">
                  <div className="flex items-end justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900">{label}</h2>
                    <span className="text-xs text-neutral-500">{Math.min(list.length, 10)}개</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {list.slice(0, 10).map((spot) => (
                      <SpotCard key={spot.id} spot={spot} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* ✅ 단일 카테고리 모드 */
          items.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.slice(0, 10).map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="해당 카테고리의 스팟이 없어요."
              description="다른 카테고리를 선택해보세요."
            />
          )
        )}
      </Container>
    </div>
  );
}
