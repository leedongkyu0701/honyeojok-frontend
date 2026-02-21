"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CategoryType } from "@/types/community";
import { ProvinceGroup } from "@/types/util";

export type CommunityFilterState = {
  type: CategoryType; // "ALL" | "REVIEW" | "FREE" | "QUESTION"
  q: string;
  page: number;
  province: ProvinceGroup | null;
};

function isProvinceGroup(v: string | null): v is ProvinceGroup {
  return (
    v === "SEOUL_GYEONGGI" ||
    v === "GANGWON" ||
    v === "CHUNGCHEONG" ||
    v === "JEOLLA" ||
    v === "GYEONGSANG" ||
    v === "JEJU"
  );
}

export function useCommunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state: CommunityFilterState = useMemo(() => {
    const type = (searchParams.get("type") as CategoryType) ?? "ALL";
    const q = searchParams.get("q") ?? "";

    const pageRaw = Number(searchParams.get("page") ?? "1");
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    const provinceParam = searchParams.get("province");
    const rawProvince = isProvinceGroup(provinceParam) ? provinceParam : null;

    // ✅ REVIEW가 아니면 province는 무조건 무시 (URL 직입력 방어)
    const province = type === "REVIEW" ? rawProvince : null;

    return { type, q, page, province };
  }, [searchParams]);

  const pushParams = useCallback(
    (next: Partial<CommunityFilterState>) => {
      const params = new URLSearchParams(searchParams.toString());

      // type
      if (next.type !== undefined) {
        if (next.type === "ALL") params.delete("type");
        else params.set("type", next.type);
      }

      // q
      if (next.q !== undefined) {
        const trimmed = next.q.trim();
        if (trimmed) params.set("q", trimmed);
        else params.delete("q");
      }

      // page: 1이면 깔끔하게 제거
      if (next.page !== undefined) {
        if (next.page <= 1) params.delete("page");
        else params.set("page", String(next.page));
      }

      // province
      if (next.province !== undefined) {
        if (next.province === null) params.delete("province");
        else params.set("province", next.province);
      }

      router.push(`/community?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const setType = useCallback(
    (type: CategoryType) => {
      pushParams({
        type,
        page: 1,
        // ✅ REVIEW 아니면 province 제거
        province: type === "REVIEW" ? undefined : null,
      });
    },
    [pushParams],
  );

  const setPage = useCallback(
    (page: number) => {
      pushParams({ page });
    },
    [pushParams],
  );

  const setQuery = useCallback(
    (q: string) => {
      pushParams({ q, page: 1 });
    },
    [pushParams],
  );

  const setProvince = useCallback(
    (province: ProvinceGroup | null) => {
      // ✅ REVIEW가 아닐 때 province 세팅 시도 방어
      if (state.type !== "REVIEW") return;
      pushParams({ province, page: 1 });
    },
    [pushParams, state.type],
  );

  return {
    state,
    setType,
    setPage,
    setQuery,
    setProvince,
    pushParams,
  };
}