"use client";

import { useQuery } from "@tanstack/react-query";
import { COMMUNITY_POSTS_TAKE } from "@/features/community/constants/community.constants";
import PostCard from "@/features/community/components/common/PostCard";
import { useCommunityFilters } from "@/features/community/hooks/useCommunityFilters";
import { postListQueryOptions } from "@/features/community/queries/post.queries";
import EmptyState from "@/shared/ui/EmptyState";
import Pagination from "@/shared/ui/Pagination";
import Skeleton from "@/shared/ui/Skeleton";
import PostSearchForm from "./PostSearchForm";

export default function PostList() {
  const { state, setPage, setQuery } = useCommunityFilters();
  const { page, province, q, type } = state;
  const params = {
    page,
    take: COMMUNITY_POSTS_TAKE,
    type: type === "ALL" ? undefined : type,
    q: q || undefined,
    province: province ?? undefined,
  };
  const postsQuery = useQuery(postListQueryOptions(params));
  const posts = postsQuery.data?.posts ?? [];
  const totalPages = postsQuery.data?.totalPages ?? 1;

  if (postsQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
    );
  }

  if (postsQuery.isError) {
    return (
      <EmptyState
        title="게시글을 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  return (
    <div className="space-y-6" aria-busy={postsQuery.isFetching}>
      <PostSearchForm
        query={q}
        onSearch={setQuery}
        isPending={postsQuery.isFetching}
      />

      {postsQuery.isFetching ? (
        <p className="text-right text-xs text-neutral-500" role="status">
          목록을 업데이트하고 있어요.
        </p>
      ) : null}

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
        disabled={postsQuery.isFetching}
      />
    </div>
  );
}
