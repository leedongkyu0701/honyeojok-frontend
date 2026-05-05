"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/shared/ui/Container";
import SectionHeader from "@/shared/ui/SectionHeader";
import DestinationList from "@/features/destination/components/DestinationList";
import Pagination from "@/shared/ui/Pagination";
import { ProvinceGroup } from "@/shared/types/util";
import type { FetchDestinationsParams } from "@/features/destination/api/destination.api";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { usePaginationGuard } from "@/shared/hooks/usePaginationGuard";

const provinces: Array<{
  label: string;
  value: ProvinceGroup | "";
}> = [
  { label: "전체", value: "" },
  { label: "서울/경기", value: ProvinceGroup.SEOUL_GYEONGGI },
  { label: "강원", value: ProvinceGroup.GANGWON },
  { label: "충청", value: ProvinceGroup.CHUNGCHEONG },
  { label: "전라", value: ProvinceGroup.JEOLLA },
  { label: "경상", value: ProvinceGroup.GYEONGSANG },
  { label: "제주", value: ProvinceGroup.JEJU },
] as const;

const sorts: Array<{
  label: string;
  value: NonNullable<FetchDestinationsParams["sort"]>;
}> = [
  { label: "인기순", value: "rank" },
  { label: "평점순", value: "score" },
];

export default function DestinationsView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const province = searchParams.get("province") ?? "";
  const rawSort = searchParams.get("sort");
  const sort = rawSort === "score" || rawSort === "rank" ? rawSort : "rank";
  const rawPage = searchParams.get("page");
  const page = Math.max(
    1,
    Number.isFinite(Number(rawPage)) ? Number(rawPage) : 1,
  );

  const [totalPages, setTotalPages] = useState(1);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== "") params.set(key, value);
      else params.delete(key);

      if (key !== "page") params.set("page", "1");

      const url = `?${params.toString()}`;

      if (key === "page") router.push(url);
      else router.replace(url, { scroll: false });
    },
    [router, searchParams],
  );

  usePaginationGuard({
    totalPages,
    page,
    onOverflow: (nextPage) => updateParams("page", String(nextPage)),
  });

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

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 px-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-neutral-500">지역</p>
              <p className="text-sm font-medium text-neutral-900">
                {activeProvinceLabel}
              </p>
            </div>

            <div className="shrink-0 ">
              <label>
                <span className="sr-only">정렬</span>
                <select
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
                  value={sort}
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
                <Button
                  key={p.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams("province", p.value)}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0 rounded-full",
                    active &&
                      "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-900",
                  )}
                >
                  {p.label}
                </Button>
              );
            })}
          </div>
        </div>

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
