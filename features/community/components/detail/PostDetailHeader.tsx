import type { ReactNode } from "react";
import { Eye, MapPin } from "lucide-react";
import { POST_TYPE_META } from "@/features/community/constants/community.constants";
import type { PostDetailResponse } from "@/features/community/schemas/post.schema";
import { timeAgoOrDate } from "@/shared/lib/timeAgo";
import { cn } from "@/shared/lib/utils";

type PostDetailHeaderProps = {
  post: PostDetailResponse;
  actions: ReactNode;
};

export default function PostDetailHeader({
  post,
  actions,
}: PostDetailHeaderProps) {
  const postType = POST_TYPE_META[post.type];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 font-medium",
            postType.badgeClassName,
          )}
        >
          {postType.label}
        </span>
        <span className="text-neutral-400">·</span>
        <span className="text-neutral-600">{timeAgoOrDate(post.createdAt)}</span>
        <span className="text-neutral-400">·</span>
        <span className="inline-flex items-center gap-1 text-neutral-500">
          <Eye className="h-3 w-3" aria-hidden />
          {post.viewCount}
        </span>
        {post.regionName ? (
          <div className="inline-flex items-center gap-1 text-xs text-neutral-500">
            <span className="text-neutral-400">·</span>
            <MapPin className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
            <span>{post.regionName}</span>
          </div>
        ) : null}
        {actions}
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold leading-snug text-neutral-900 md:text-2xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span>by.</span>
          <span className="font-medium text-neutral-700">{post.nickName}</span>
        </div>
      </div>
    </div>
  );
}
