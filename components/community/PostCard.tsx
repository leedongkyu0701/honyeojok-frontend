import Link from "next/link";
import type { PostCardVM } from "@/types/post";
import { Card } from "@/components/common/Card";
import { cn } from "@/lib/utils";

type Props = {
  post: PostCardVM;
  variant?: "default" | "best";
};

function typeLabel(t: PostCardVM["type"]) {
  if (t === "REVIEW") return "리뷰";
  if (t === "QUESTION") return "질문";
  return "자유";
}

function typeBadgeClass(t: PostCardVM["type"]) {
  if (t === "REVIEW")
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (t === "QUESTION") return "bg-indigo-50 text-indigo-700 border-indigo-100";
  return "bg-neutral-50 text-neutral-700 border-neutral-200";
}

export default function PostCard({ post, variant = "default" }: Props) {
  const isBest = variant === "best";
  const dateText = new Date(post.createdAt).toLocaleDateString();

  return (
    <Link href={`/community/${post.id}`} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white transition",
          "hover:-translate-y-0.5 hover:shadow-lg",
          "p-0",
        )}
      >
        {/* ✅ best는 모바일에서 row(컴팩트), lg에서 col(카드형) */}
        <div className={cn("flex", isBest ? "flex-row lg:flex-col" : "flex-row")}>

          {/* Content */}
          <div className={cn(isBest ? "p-4 lg:p-5" : "p-4 sm:p-5", "min-w-0 flex-1")}>
            {/* 상단 메타: 타입 + 날짜 */}
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

            {/* 제목 + 좋아요 */}
            <div className="flex items-start justify-between gap-2">
              <h2
                className={cn(
                  "min-w-0 font-medium tracking-tight text-neutral-900",
                  // ✅ best: 모바일에서 1줄로 더 컴팩트, lg에서 2줄
                  isBest
                    ? "text-base line-clamp-1 lg:text-lg lg:line-clamp-2"
                    : "text-base line-clamp-2",
                )}
              >
                {post.title}
              </h2>

              <span
                className={cn(
                  "shrink-0 rounded-full border border-neutral-200 bg-white/90 px-2 py-1 text-xs text-neutral-600",
                  "inline-flex items-center gap-1",
                )}
                aria-label={`좋아요 ${post.likeCount ?? 0}`}
              >
                <span aria-hidden>❤️</span>
                <span className="tabular-nums">{post.likeCount ?? 0}</span>
              </span>
            </div>

            {/* 작성자 */}
            <div className="mt-2 text-sm text-neutral-600">
              <span className="text-neutral-400">by.</span>{" "}
              <span className="truncate">{post.nickName}</span>
            </div>

            {/* 지역 */}
            {post.region ? (
              <div className={cn("mt-2 text-xs text-neutral-500", isBest && "line-clamp-1")}>
                📍 {post.region}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
