"use client";

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { fetchPosts } from "@/lib/api/community/api";
import type { PostCardResponse, PostType } from "@/lib/schemas/community/response";

import PostCard from "./PostCard";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

import { useCommunityFilters } from "@/hooks/useCommunityFilters";

const TAKE = 10;

export default function PostList() {
  const { state, setPage, setQuery } = useCommunityFilters();
  const { q, page, type, province } = state;


  const [searchTerm, setSearchTerm] = useState(q);

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  const postType: PostType | null =
    type === "ALL" ? null : (type as PostType);

  const { data, isLoading, isError, isFetching } = useQuery<{
    posts: PostCardResponse[];
    totalPages: number;
  }>({
    queryKey: ["posts", { page, take: TAKE, type: postType, q, province }],
    queryFn: () =>
      fetchPosts({
        page,
        take: TAKE,
        type: postType,
        q: q || undefined,
        province,
      }),
    placeholderData: keepPreviousData,
    staleTime:30_000,
    gcTime: 60_000,
  });

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setQuery(searchTerm);
  };

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
        onPageChange={setPage}
      />
    </div>
  );
}