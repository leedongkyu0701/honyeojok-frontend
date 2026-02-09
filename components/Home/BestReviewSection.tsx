"use client";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";

import { useQuery } from "@tanstack/react-query";
import { fetchBestPosts } from "@/lib/api/community/api";
import type { PostCardVM } from "@/types/post";
import PostCard from "@/components/community/PostCard";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function BestReviewSection() {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery<PostCardVM[]>({
    queryKey: ["posts", "best-reviews"],
    queryFn: fetchBestPosts,
  });

  return (
    <section className="py-12">
      <Container className="space-y-6">
        <SectionHeader
          title="이달의 추천지역"
          description="혼자 떠나기 좋은 지역을 편집팀이 직접 선정했어요."
          action={
            <Link href="/community">
              <Button variant="ghost" size="sm">
                커뮤니티 바로가기 →
              </Button>
            </Link>
          }
        />

        {/* ✅ Loading: lg 이상 3개, 그 외 1개씩 */}
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <EmptyState
            title="베스트 리뷰를 불러오지 못했어요."
            description={"잠시 후 다시 시도해주세요."}
          />
        ) : null}

        {!isLoading && !isError && reviews && reviews.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {reviews.map((review) => (
              <PostCard key={review.id} post={review} variant="best" />
            ))}
          </div>
        ) : (
          !isLoading &&
          !isError && (
            <EmptyState
              title="아직 베스트 리뷰가 없어요."
              description="첫 리뷰를 남기고 베스트에 도전해보세요!"
            />
          )
        )}
      </Container>
    </section>
  );
}
