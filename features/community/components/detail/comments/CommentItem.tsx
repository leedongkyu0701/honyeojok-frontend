import type { CommentResponse } from "@/features/community/schemas/comment.schema";
import { timeAgoOrDate } from "@/shared/lib/timeAgo";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";

type CommentItemProps = {
  comment: CommentResponse;
  onReply?: () => void;
  onDelete?: () => void;
};

export default function CommentItem({
  comment,
  onReply,
  onDelete,
}: CommentItemProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <span className="font-medium text-neutral-900">
              {comment.user.nickName}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs">{timeAgoOrDate(comment.createdAt)}</span>
          </div>
          <p
            className={cn(
              "whitespace-pre-wrap break-all text-sm",
              comment.isDeleted ? "text-neutral-400" : "text-neutral-700",
            )}
          >
            {comment.isDeleted ? "삭제된 댓글입니다." : comment.content}
          </p>
        </div>

        {!comment.isDeleted ? (
          <div className="flex shrink-0 items-center gap-1">
            {onReply ? (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="px-2"
                onClick={onReply}
              >
                답글
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="px-2 text-neutral-500 hover:text-neutral-900"
                onClick={onDelete}
              >
                삭제
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
