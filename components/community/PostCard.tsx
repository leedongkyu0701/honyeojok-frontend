import Link from "next/link";
import Image from "next/image";
import type { PostCardResponse } from "@/lib/schemas/community/response";
import { Card } from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { timeAgoOrDate } from "@/lib/timeAgo";
import { Heart, Eye, MapPin } from "lucide-react";
import Badge from "@/components/common/Badge";

type Props = {
  post: PostCardResponse;
  variant?: "default" | "best";
};

const POST_TYPE_BADGE = {
  REVIEW: {
    label: "리뷰",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  QUESTION: {
    label: "질문",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  FREE: {
    label: "자유",
    className: "bg-neutral-50 text-neutral-700 border-neutral-200",
  },
} as const;

export default function PostCard({ post, variant = "default" }: Props) {
  const isBest = variant === "best";
  const dateText = timeAgoOrDate(post.createdAt);
  const nickName = post.nickName ?? "탈퇴한 혼여족";
  const fallbackThumbnail = "/images/fallback.png";

  const showThumbnail = isBest;
  const src = post.thumbnailUrl ?? fallbackThumbnail;
  const badge = POST_TYPE_BADGE[post.type];
  return (
    <Link href={`/community/${post.id}`} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white transition",
          "hover:-translate-y-0.5 hover:shadow-lg",
          "p-0",
        )}
      >
        <div
          className={cn("flex", isBest ? "flex-col" : "flex-row items-center")}
        >
          {showThumbnail && (
            <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
              <Image
                src={src}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          <div
            className={cn(
              "min-w-0 flex-1",
              isBest ? "p-4 lg:p-5" : "p-4 sm:p-5",
            )}
          >
            <div className="mb-2 flex items-center gap-2 text-xs">
              <Badge className={cn("border", badge.className)}>
                {badge.label}
              </Badge>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500">{dateText}</span>
               {post.regionName && (
                
              <div className="inline-flex items-center gap-1 text-xs text-neutral-500">
                <span className="text-neutral-400">·</span>
                <MapPin className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
                <span>{post.regionName}</span>
              </div>
            )}
            </div>

            <div className="flex items-start gap-2 mb-2">
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

              <span className="inline-flex shrink-0 items-center gap-1">
                <Heart
                  className="h-4 w-4 text-neutral-400 fill-rose-100"
                  aria-hidden
                />
                {post.likeCount}
              </span>

              <span className="inline-flex shrink-0 items-center gap-1">
                <Eye className="h-4 w-4 text-neutral-400" aria-hidden />
                {post.viewCount}
              </span>
            </div>

            <div className="text-sm pb-2 text-neutral-600">
              <span className="text-neutral-400">by.</span>{" "}
              <span className="truncate">{nickName}</span>
            </div>

           
          </div>
        </div>
      </Card>
    </Link>
  );
}
