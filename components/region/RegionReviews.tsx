"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import type { PostCardVM } from "@/types/post";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";

import { fetchPostsByRegionSlug } from "@/lib/api/community/api";

function formatDate(input?: string | Date) {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function RegionReviews({ regionSlug }: { regionSlug: string }) {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<PostCardVM[]>({
    queryKey: ["posts", "region", regionSlug],
    queryFn: () => fetchPostsByRegionSlug(regionSlug),
  });

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-70 shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="리뷰를 불러오지 못했어요."
        description={"잠시 후 다시 시도해주세요."}
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

  const list = posts.slice(0, 6);

  return (
    <section className="space-y-4">
      {/* ✅ 가로 카드 리스트 */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {list.map((p) => (
          <Link
            key={p.id}
            href={`/community/${p.id}`}
            className="group block w-70 shrink-0"
          >
            <Card className="h-full overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
              <CardContent className="space-y-2 p-4">
                {/* 상단: 카테고리/지역/날짜 */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {/* region이 PostCardVM에 있으면 표시 */}
                    {p.region ? (
                      <Badge className="shrink-0">{p.region}</Badge>
                    ) : (
                      <Badge className="shrink-0">{regionSlug}</Badge>
                    )}
                    {/* 필요하면 타입(후기/질문/자유 등)이 있다면 여기 추가 */}
                  </div>

                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatDate(p.createdAt)}
                  </span>
                </div>

                {/* 제목 */}
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {p.title}
                </h3>

              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ✅ 더보기 버튼 */}
      <div className="flex justify-end">
        <Link
          href={`/community`}
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
