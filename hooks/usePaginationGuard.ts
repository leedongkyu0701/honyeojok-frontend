"use client";

import { useEffect } from "react";

type Options = {
  totalPages?: number;
  page: number;
  onOverflow: (nextPage: number) => void;
  fallbackPage?: (totalPages: number) => number;
  enabled?: boolean;
};

export function usePaginationGuard({
  totalPages,
  page,
  onOverflow,
  fallbackPage = () => 1,
  enabled = true,
}: Options) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof totalPages !== "number" || totalPages < 1) return;

    if (page > totalPages) {
      onOverflow(fallbackPage(totalPages));
    }
  }, [enabled, totalPages, page, onOverflow, fallbackPage]);
}