"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import PostCard from "@/components/community/PostCard";

import type { PostCardResponse } from "@/lib/schemas/community/response";
import { fetchPostsByRegionSlug } from "@/lib/api/community/api";
import Button from "../common/Button";

export default function RegionReviews({ regionSlug }: { regionSlug: string }) {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<PostCardResponse[]>({
    queryKey: ["posts", "region", regionSlug],
    queryFn: () => fetchPostsByRegionSlug(regionSlug),
  });

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

  const list = posts.slice(0, 3);
  const [featured, ...rest] = list;
  const rightList = rest.slice(0, 2);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-7">
          <PostCard post={featured} variant="best" />
        </div>

        <div className="grid gap-4 sm:col-span-5">
          {rightList.map((p) => (
            <PostCard key={p.id} post={p} variant="default" />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={`/community`}>
          <Button variant="ghost" size="sm">
            더 많은 여행 후기 보기 →
          </Button>
        </Link>
      </div>
    </section>
  );
}
