// src/app/spots/[region]/SpotView.tsx (또는 기존 위치)
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Pagination from "@/components/common/Pagination";
import SpotList from "@/components/spot/SpotList";

import type { SpotCategory } from "@/types/spots";
import SpotCategorySection from "./SpotCategory";
import { isSpotCategory } from "@/lib/spotCategory";

export default function SpotView({ region }: { region: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawCategory = searchParams.get("category");
  const category = useMemo<SpotCategory | null>(() => {
    if (!rawCategory) return null;
    return isSpotCategory(rawCategory) ? rawCategory : null;
  }, [rawCategory]);

  const rawPage = Number(searchParams.get("page") ?? 1);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [totalPages, setTotalPages] = useState(1);

  const setParams = (next: { category?: SpotCategory | null; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if ("category" in next) {
      const v = next.category;
      if (v) params.set("category", v);
      else params.delete("category");
      // category 변경 시 page 리셋
      params.set("page", "1");
    }

    if ("page" in next && typeof next.page === "number") {
      params.set("page", String(next.page));
    }

    router.push(`/spots/${region}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="py-10">
      <Container className="space-y-6">
        <SectionHeader
          title={`${region} 인기 장소 둘러보기`}
          description="카테고리를 눌러 스팟을 필터링해보세요."
        />

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs text-neutral-500">카테고리</div>
          <div className="mt-3">
            <SpotCategorySection
              value={category}
              onChange={(next) => setParams({ category: next })}
            />
          </div>
        </div>

        <SpotList
          region={region}
          category={category}
          page={page}
          take={8}
          onTotalPagesChange={setTotalPages}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => setParams({ page: nextPage })}
        />
      </Container>
    </div>
  );
}
