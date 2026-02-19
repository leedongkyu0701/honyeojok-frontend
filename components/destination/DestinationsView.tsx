"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import DestinationList from "@/components/destination/DestinationList";
import Pagination from "@/components/common/Pagination";
import { ProvinceGroup } from "@/types/util";
import type { FetchDestinationsParams } from "@/lib/api/destination/api";

const provinces = [
  { label: "전체", value: "" },
  { label: "서울/경기", value: ProvinceGroup.SEOUL_GYEONGGI },
  { label: "강원", value: ProvinceGroup.GANGWON },
  { label: "충청", value: ProvinceGroup.CHUNGCHEONG },
  { label: "전라", value: ProvinceGroup.JEOLLA },
  { label: "경상", value: ProvinceGroup.GYEONGSANG },
  { label: "제주", value: ProvinceGroup.JEJU },
] as const;

const sorts: Array<{ label: string; value: NonNullable<FetchDestinationsParams["sort"]> }> = [
  { label: "인기순", value: "rank" },
  { label: "평점순", value: "score" },
];

export default function DestinationsView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const province = searchParams.get("province") ?? "";
  const sort = (searchParams.get("sort") as FetchDestinationsParams["sort"]) ?? "rank";
  const page = Number(searchParams.get("page") ?? 1);

  const [totalPages, setTotalPages] = useState(1);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    // 필터/정렬 변경 시 페이지는 1로
    if (key !== "page") params.set("page", "1");

    router.push(`/destinations?${params.toString()}`);
  };

  const activeProvinceLabel = useMemo(() => {
    const found = provinces.find((p) => p.value === province);
    return found?.label ?? "전체";
  }, [province]);

  return (
    <div className="py-10">
      <Container className="space-y-6">
        <SectionHeader
          title="여행지 둘러보기"
          description="혼행에 최적화된 지역을 골라보세요."
        />

        {/* ✅ 상단 필터 바 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-4">
          {/* Province chips */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-neutral-500">지역</p>
              <p className="text-sm font-medium text-neutral-900">{activeProvinceLabel}</p>
            </div>

            {/* Sort */}
            <div className="shrink-0">
              <label className="flex flex-col text-xs text-neutral-500">
                정렬
                <select
                  className="mt-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
                  value={sort ?? "rank"}
                  onChange={(e) => updateParams("sort", e.target.value)}
                >
                  {sorts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {provinces.map((p) => {
              const active = p.value === province;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => updateParams("province", p.value)}
                  className={[
                    "shrink-0 rounded-full border px-3 py-2 text-sm transition",
                    active
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ✅ 리스트 (q 제거) */}
        <DestinationList
          province={province || null}
          sort={sort}
          page={page}
          onTotalPagesChange={setTotalPages}
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
