"use client";

import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { fetchPosts } from "@/lib/api/community/api";
import type { PostCardResponse, CategoryType, PostType } from "@/types/community";

import PostCard from "./PostCard";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

const TAKE = 10;

function isPostType(v: string | null): v is PostType {
  return v === "REVIEW" || v === "FREE" || v === "QUESTION";
}

export default function PostList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const typeParam = searchParams.get("type"); // ALL이면 없을 수도
  const pageRaw = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const category: CategoryType = (typeParam as CategoryType) ?? "ALL";
  const type: PostType | null =
    category === "ALL" ? null : isPostType(category) ? category : null;

  const [searchTerm, setSearchTerm] = useState(q);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    if (key !== "page") params.set("page", "1");

    router.push(`/community?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateParams("q", searchTerm.trim());
  };

  const { data, isLoading, isError, isFetching } = useQuery<{
    posts: PostCardResponse[];
    totalPages: number;
  }>({
    queryKey: ["posts", { page, take: TAKE, type, q }],
    queryFn: () =>
      fetchPosts({
        page,
        take: TAKE,
        type,
        q: q || null,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const posts = useMemo(() => data?.posts ?? [], [data?.posts]);
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="게시글을 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색 */}
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
      >
        <div className="flex flex-1 items-center gap-2">
          <input
            value={searchTerm}
            aria-label="검색어"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="검색어 입력"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            type="submit"
            className="whitespace-nowrap px-4"
            disabled={isFetching}
          >
            검색
          </Button>
        </div>
      </form>

      {/* 목록 */}
      {posts.length === 0 ? (
        <EmptyState
          title="게시글이 없습니다."
          description="첫 번째 글을 작성해보세요."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(next) => updateParams("page", String(next))}
      />
    </div>
  );
}
