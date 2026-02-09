"use client";
import { fetchPosts } from "@/lib/api/community/api";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./PostCard";
import type { PostCardVM } from "@/types/post";
import { useCommunityStore } from "@/stores/community.store";
import { useState } from "react";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function PostList() {
  const category = useCommunityStore((state) => state.category);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(q);
  const page = Number(searchParams.get("page") || "1");
  const router = useRouter();

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

    router.push(`/community?${params.toString()}`);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateParams("q", searchTerm);
  };

  const { data, isLoading,isError } = useQuery<{
    posts: PostCardVM[];
    totalPages: number;
  }>({
    queryKey: ["posts", { category, q, page }],
    queryFn: () =>
      fetchPosts(page, category === "ALL" ? undefined : category, q),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
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
      {data?.posts.length === 0 ? (
        <EmptyState
          title="게시글이 없습니다."
          description="첫 번째 글을 작성해보세요."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {data?.posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}

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
            className="px-4 whitespace-nowrap"
          >
            검색
          </Button>
        </div>
      </form>

      <Pagination
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={(next) => updateParams("page", String(next))}
      />
    </div>
  );
}
