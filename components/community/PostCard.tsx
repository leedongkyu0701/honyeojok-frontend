import Link from "next/link";
import Image from "next/image";
import type { PostCardResponse } from "@/types/community";
import { Card } from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { timeAgoOrDate } from "@/lib/timeAgo";

type Props = {
  post: PostCardResponse;
  variant?: "default" | "best";
};

function typeLabel(t: PostCardResponse["type"]) {
  if (t === "REVIEW") return "리뷰";
  if (t === "QUESTION") return "질문";
  return "자유";
}

function typeBadgeClass(t: PostCardResponse["type"]) {
  if (t === "REVIEW")
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (t === "QUESTION") return "bg-indigo-50 text-indigo-700 border-indigo-100";
  return "bg-neutral-50 text-neutral-700 border-neutral-200";
}

export default function PostCard({ post, variant = "default" }: Props) {
  const isBest = variant === "best";
  const dateText = timeAgoOrDate(post.createdAt);
  const nickName = post.nickName ?? "익명";

  // ✅ best 카드에서만 썸네일 표시 (default는 이미지 요청 자체가 안 나감)
  const showThumbnail = isBest && !!post.thumbnailUrl;

  return (
    <Link href={`/community/${post.id}`} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white transition",
          "hover:-translate-y-0.5 hover:shadow-lg",
          "p-0",
        )}
      >
        <div className={cn("flex", isBest ? "flex-col" : "flex-row items-center")}>
          {/* ✅ Thumbnail (BEST only) */}
          {showThumbnail && (
            <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
              <Image
                src={post.thumbnailUrl!}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className={cn("min-w-0 flex-1", isBest ? "p-4 lg:p-5" : "p-4 sm:p-5")}>
            {/* 타입 + 날짜 */}
            <div className="mb-2 flex items-center gap-2 text-xs">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 font-medium",
                  typeBadgeClass(post.type),
                )}
              >
                {typeLabel(post.type)}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500">{dateText}</span>
            </div>

            {/* 제목 + 메타 */}
<div className="flex items-start gap-2">
  <h2
    className={cn(
      "min-w-0 flex-1 font-medium tracking-tight text-neutral-900",
      isBest
        ? "text-base line-clamp-1 lg:text-lg lg:line-clamp-2"
        : "text-base line-clamp-2",
    )}
  >
    {post.title}
  </h2>

  {/* ❤️ 좋아요 / 👀 조회수 */}
  <div className="shrink-0 flex items-center gap-3 text-xs text-neutral-500 pt-0.5">
    <span className="inline-flex items-center gap-1">
      ❤️ {post.likeCount}
    </span>
    <span className="inline-flex items-center gap-1">
      👀 {post.viewCount}
    </span>
  </div>
</div>

            {/* 작성자 */}
            <div className="mt-2 text-sm text-neutral-600">
              <span className="text-neutral-400">by.</span>{" "}
              <span className="truncate">{nickName}</span>
            </div>

            {/* 지역 */}
            {post.region && (
              <div className="mt-2 text-xs text-neutral-500">📍 {post.region}</div>
            )}

          
          </div>
        </div>
      </Card>
    </Link>
  );
}