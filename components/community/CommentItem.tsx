import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";

export default function CommentItem({
  author,
  content,
  date,
  isDeleted = false,
  isChild = false,
  onReply,
  onDelete,
}: {
  author: string;
  content: string;
  date: string;
  isDeleted?: boolean;
  isChild?: boolean;
  onReply?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <span className="font-medium text-neutral-900">{author}</span>
            {isChild ? (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                답글
              </span>
            ) : null}
            <Badge>{date}</Badge>
          </div>

          <p className={`text-sm ${isDeleted ? "text-neutral-400" : "text-neutral-700"}`}>
            {isDeleted ? "삭제된 댓글입니다." : content}
          </p>
        </div>

        {/* 액션 */}
        <div className="flex shrink-0 items-center gap-1">
          {!isDeleted && onReply ? (
            <Button variant="ghost" size="sm" type="button" className="px-2" onClick={onReply}>
              답글
            </Button>
          ) : null}

          {!isDeleted && onDelete ? (
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
      </div>
    </div>
  );
}
