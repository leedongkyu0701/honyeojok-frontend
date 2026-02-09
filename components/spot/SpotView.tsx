"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Pagination from "@/components/common/Pagination";
import { fetchTags } from "@/lib/api/tags/api";
import { useQuery } from "@tanstack/react-query";
import SpotList from "@/components/spot/SpotList";

export default function SpotView({ region }: { region: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();


  const tag = searchParams.get("tag") ?? "";
  const rawPage = Number(searchParams.get("page") ?? 1);
const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [totalPages, setTotalPages] = useState(1);

  const { data: tags, isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 60, // 1시간 동안 fresh
    gcTime: 1000 * 60 * 60 * 24, // 24시간 캐시 유지
    refetchOnWindowFocus: false, // 포커스 복귀 시 재요청 ❌
    refetchOnReconnect: false, // 네트워크 복구 시 재요청 ❌
  });

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    if (key !== "page") params.set("page", "1");

    // 페이지 이동 시 스크롤 튐 방지하고 싶으면 scroll:false 유지
    router.push(`/spots/${region}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="py-10">
      <Container className="space-y-6">
        <SectionHeader
          title={`${region} 인기 장소 둘러보기`}
          description="태그별로 상위 10개의 스팟을 확인해보세요."
        />

        <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:grid-cols-[1fr_auto]">
          <label className="flex flex-col text-xs text-neutral-500">
            태그
            <select
              className="mt-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
              value={tag}
              onChange={(event) => updateParams("tag", event.target.value)}
              disabled={loadingTags}
            >
              <option value="">전체</option>
              {tags?.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <SpotList
          tag={tag || null}
          page={page}
          onTotalPagesChange={setTotalPages}
            region={region}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => updateParams("page", String(nextPage))}
        />
      </Container>
    </div>
  );
}
