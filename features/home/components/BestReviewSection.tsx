"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import Container from "@/shared/ui/Container";
import SectionHeader from "@/shared/ui/SectionHeader";
import Skeleton from "@/shared/ui/Skeleton";
import EmptyState from "@/shared/ui/EmptyState";
import Button from "@/shared/ui/Button";

import { fetchBestPosts } from "@/features/community/api/community.api";
import type { PostCardResponse } from "@/features/community/schemas/response";
import PostCard from "@/features/community/components/PostCard";

const GRID_CLASS = "grid grid-cols-1 gap-4 sm:grid-cols-3";
const SKELETON_COUNT = 3;

export default function BestReviewSection() {
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<PostCardResponse[]>({
    queryKey: ["posts", "best"],
    queryFn: fetchBestPosts,
  });

  let content: ReactNode;

  if (isLoading) {
    content = (
      <div className={GRID_CLASS}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={index} className="h-80 w-full rounded-2xl" />
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <EmptyState
        title="베스트 글을 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  } else if (posts.length === 0) {
    content = (
      <EmptyState
        title="아직 베스트 글이 없어요."
        description="첫 글을 남기고 베스트에 도전해보세요!"
      />
    );
  } else {
    content = (
      <div className={GRID_CLASS}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} variant="best" />
        ))}
      </div>
    );
  }

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

        {content}
      </Container>
    </section>
  );
}