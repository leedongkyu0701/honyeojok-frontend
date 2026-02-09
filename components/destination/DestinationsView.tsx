"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Button from "@/components/common/Button";
import DestinationList from "@/components/destination/DestinationList";
import Pagination from "@/components/common/Pagination";
import { ProvinceGroup } from "@/types/destinations";
import type { FetchDestinationsParams } from "@/lib/api/destination/api";

const provinces = [
  { label: "전체", value: "" },
  { label: "서울/경기", value: ProvinceGroup.SEOUL_GYEONGGI },
  { label: "강원", value: ProvinceGroup.GANGWON },
  { label: "충청", value: ProvinceGroup.CHUNGCHEONG },
  { label: "전라", value: ProvinceGroup.JEOLLA },
  { label: "경상", value: ProvinceGroup.GYEONGSANG },
  { label: "제주", value: ProvinceGroup.JEJU },
];

const sorts = [
  { label: "인기순", value: "rank" },
  { label: "평점순", value: "score" },
  { label: "리뷰순", value: "reviewCount" },
];

export default function DestinationsView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const province = searchParams.get("province") ?? "";
  const sort = searchParams.get("sort") ?? "rank";
  const page = Number(searchParams.get("page") ?? 1);

  const [totalPages, setTotalPages] = useState(1);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`/destinations?${params.toString()}`);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateParams("q", query);
  };

  return (
    <div className="py-10">
      <Container className="space-y-6">
        <SectionHeader
          title="여행지 둘러보기"
          description="혼행에 최적화된 지역을 골라보세요."
        />

        <form
          onSubmit={handleSearch}
          className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:grid-cols-[1.2fr_1fr_1fr_auto]"
        >
          <label className="flex flex-col text-xs text-neutral-500">
            지역
            <select
              className="mt-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 pr-8"
              value={province}
              onChange={(event) => updateParams("province", event.target.value)}
            >
              {provinces.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-neutral-500">
            정렬
            <select
              className="mt-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
              value={sort}
              onChange={(event) => updateParams("sort", event.target.value)}
            >
              {sorts.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-neutral-500">
            검색
            <input
              className="mt-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
              placeholder="이름 ex) 서울, 부산, 동해"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" size="md">
              검색
            </Button>
          </div>
        </form>

        <DestinationList
          province={province || null}
          sort={sort as FetchDestinationsParams["sort"]}
          query={searchParams.get("q")}
          page={page}
          onTotalPagesChange={setTotalPages}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) =>
            updateParams("page", String(nextPage))
          }
        />
      </Container>
    </div>
  );
}
