"use client";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

import { useQuery } from "@tanstack/react-query";
import { fetchBestPosts } from "@/lib/api/community/api";
import type { PostCardResponse } from "@/lib/schemas/community/response";
import PostCard from "@/components/community/PostCard";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function BestReviewSection() {
  const { data: posts, isLoading, isError } = useQuery<PostCardResponse[]>({
    queryKey: ["posts", "best"],
    queryFn: fetchBestPosts,
  });

  return (
    <section className="py-12">
      <Container className="space-y-6">
        <SectionHeader
          title="이번 달 인기 글"
          description="혼여족들이 많이 본 글을 모아봤어요."
          action={
            <Link href="/community">
              <Button variant="ghost" size="sm">
                커뮤니티 바로가기 →
              </Button>
            </Link>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <EmptyState
            title="베스트 글을 불러오지 못했어요."
            description="잠시 후 다시 시도해주세요."
          />
        ) : null}

        {!isLoading && !isError && posts && posts.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="best" />
            ))}
          </div>
        ) : (
          !isLoading &&
          !isError && (
            <EmptyState
              title="아직 베스트 글이 없어요."
              description="첫 글을 남기고 베스트에 도전해보세요!"
            />
          )
        )}
      </Container>
    </section>
  );
}
