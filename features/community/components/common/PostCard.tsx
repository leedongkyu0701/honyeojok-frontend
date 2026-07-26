import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MapPin } from "lucide-react";
import { POST_TYPE_META } from "@/features/community/constants/community.constants";
import type { PostCardResponse } from "@/features/community/schemas/post.schema";
import { timeAgoOrDate } from "@/shared/lib/timeAgo";
import { cn } from "@/shared/lib/utils";
import Badge from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";

type PostCardProps = {
  post: PostCardResponse;
  variant?: "default" | "best";
};

export default function PostCard({ post, variant = "default" }: PostCardProps) {
  const isBest = variant === "best";
  const badge = POST_TYPE_META[post.type];
  const thumbnailUrl = post.thumbnailUrl ?? "/images/fallback.png";

  return (
    <Link href={`/community/${post.id}`} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 transition",
          "hover:-translate-y-0.5 hover:shadow-lg",
        )}
      >
        <div className={cn("flex", isBest ? "flex-col" : "flex-row items-center")}>
          {isBest ? (
            <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
              <Image
                src={thumbnailUrl}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : null}

          <div className={cn("min-w-0 flex-1", isBest ? "p-4 lg:p-5" : "p-4 sm:p-5")}>
            <div className="mb-2 flex items-center gap-2 text-xs">
              <Badge className={cn("border", badge.badgeClassName)}>
                {badge.label}
              </Badge>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500">{timeAgoOrDate(post.createdAt)}</span>
              {post.regionName ? (
                <div className="inline-flex items-center gap-1 text-xs text-neutral-500">
                  <span className="text-neutral-400">·</span>
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
                  <span>{post.regionName}</span>
                </div>
              ) : null}
            </div>

            <div className="mb-2 flex items-start gap-2">
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
                  className="h-4 w-4 fill-rose-100 text-neutral-400"
                  aria-hidden
                />
                {post.likeCount}
              </span>

              <span className="inline-flex shrink-0 items-center gap-1">
                <Eye className="h-4 w-4 text-neutral-400" aria-hidden />
                {post.viewCount}
              </span>
            </div>

            <div className="pb-2 text-sm text-neutral-600">
              <span className="text-neutral-400">by.</span>{" "}
              <span className="truncate">{post.nickName}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
