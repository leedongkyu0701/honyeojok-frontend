"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CategoryType } from "@/features/community/schemas/post.schema";
import { categoryTypeSchema } from "@/features/community/schemas/post.schema";
import { provinceGroupSchema } from "@/shared/schemas/province";
import { ProvinceGroup } from "@/shared/types/util";

export type CommunityFilterState = {
  type: CategoryType;
  q: string;
  page: number;
  province: ProvinceGroup | null;
};

export function useCommunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state: CommunityFilterState = useMemo(() => {
    const typeRaw = searchParams.get("type");
    const categoryResult = categoryTypeSchema.safeParse(typeRaw);
    const type: CategoryType = categoryResult.success
      ? categoryResult.data
      : "ALL";
    const q = searchParams.get("q") ?? "";

    const pageRaw = Number(searchParams.get("page"));
    const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    const provinceParam = searchParams.get("province");
    const provinceResult = provinceGroupSchema.safeParse(provinceParam);
    const rawProvince = provinceResult.success ? provinceResult.data : null;

    const province = type === "REVIEW" ? rawProvince : null;

    return { type, q, page, province };
  }, [searchParams]);

  const pushParams = useCallback(
    (next: Partial<CommunityFilterState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.type !== undefined) {
        if (next.type === "ALL") params.delete("type");
        else params.set("type", next.type);
      }

      if (next.q !== undefined) {
        const trimmed = next.q.trim();
        if (trimmed) params.set("q", trimmed);
        else params.delete("q");
      }

      if (next.page !== undefined) {
        if (next.page <= 1) params.delete("page");
        else params.set("page", String(next.page));
      }

      if (next.province !== undefined) {
        if (next.province === null) params.delete("province");
        else params.set("province", next.province);
      }

      const query = params.toString();
      router.push(query ? `/community?${query}` : "/community", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const setType = useCallback(
    (type: CategoryType) => {
      pushParams({
        type,
        page: 1,
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
