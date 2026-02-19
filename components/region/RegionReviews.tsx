"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import PostCard from "@/components/community/PostCard";

import type { PostCardResponse } from "@/types/community";
import { fetchPostsByRegionSlug } from "@/lib/api/community/api";

export default function RegionReviews({ regionSlug }: { regionSlug: string }) {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<PostCardResponse[]>({
    queryKey: ["posts", "region", regionSlug],
    queryFn: () => fetchPostsByRegionSlug(regionSlug),
  });

  // ✅ Loading: 3개 전용 스켈레톤(좌 1개 크게 + 우 2개)
  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-12">
          <Skeleton className="h-44 lg:col-span-7 lg:h-full" />
          <div className="grid gap-4 lg:col-span-5">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="리뷰를 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        title="아직 이 지역 후기가 없어요."
        description="첫 후기를 남기고 다른 사람에게 도움을 주세요!"
      />
    );
  }

  // ✅ 백엔드가 3개만 준다 가정이지만 안전하게 3개로
  const list3 = posts.slice(0, 3);
  const [featured, ...rest] = list3;
  const rightList = rest.slice(0, 2);

  return (
    <section className="space-y-4">
      {/* ✅ 3개 전용 레이아웃: 왼쪽 크게 1개 + 오른쪽 2개 */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* featured */}
        <div className="lg:col-span-7">
          <PostCard post={featured} variant="best" />
        </div>

        {/* right list */}
        <div className="grid gap-4 lg:col-span-5">
          {rightList.map((p) => (
            <PostCard key={p.id} post={p} variant="default" />
          ))}
        </div>
      </div>

      {/* 더보기 */}
      <div className="flex justify-end">
        <Link
          href="/community"
          className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          더 많은 후기 보기
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
