"use client";

import { useEffect, useRef } from "react";
import type { CommentResponse } from "@/features/community/schemas/comment.schema";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

type CommentListProps = {
  comments: CommentResponse[];
  replyTo: number | null;
  replyValue: string;
  isSubmitting: boolean;
  onReplyValueChange: (value: string) => void;
  onOpenReply: (commentId: number) => void;
  onCloseReply: () => void;
  onSubmitReply: () => void;
  onDelete: (commentId: number) => void;
};

type CommentThreadProps = Omit<CommentListProps, "comments"> & {
  comment: CommentResponse;
  depth: number;
};

function CommentThread({
  comment,
  depth,
  replyTo,
  replyValue,
  isSubmitting,
  onReplyValueChange,
  onOpenReply,
  onCloseReply,
  onSubmitReply,
  onDelete,
}: CommentThreadProps) {
  const replyFormRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (replyTo === comment.id) {
      replyFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [comment.id, replyTo]);

  return (
    <div className={depth > 0 ? "ml-8 border-l border-neutral-200 pl-4" : ""}>
      <div className="space-y-2">
        <CommentItem
          comment={comment}
          onReply={comment.isDeleted ? undefined : () => onOpenReply(comment.id)}
          onDelete={comment.isDeleted ? undefined : () => onDelete(comment.id)}
        />

        {replyTo === comment.id ? (
          <div
            ref={replyFormRef}
            className="ml-8 rounded-2xl border border-neutral-200 bg-white p-3"
          >
            <p className="mb-2 text-xs text-neutral-600">
              <span className="font-semibold">{comment.user.nickName}</span> 님에게 답글
            </p>
            <CommentForm
              value={replyValue}
              onChange={onReplyValueChange}
              onSubmit={onSubmitReply}
              onCancel={onCloseReply}
              placeholder="답글을 입력하세요"
              submitLabel="답글"
              isSubmitting={isSubmitting}
              compact
            />
          </div>
        ) : null}

        {comment.children.map((child) => (
          <CommentThread
            key={child.id}
            comment={child}
            depth={depth + 1}
            replyTo={replyTo}
            replyValue={replyValue}
            isSubmitting={isSubmitting}
            onReplyValueChange={onReplyValueChange}
            onOpenReply={onOpenReply}
            onCloseReply={onCloseReply}
            onSubmitReply={onSubmitReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default function CommentList({ comments, ...props }: CommentListProps) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentThread key={comment.id} comment={comment} depth={0} {...props} />
      ))}
    </div>
  );
}
