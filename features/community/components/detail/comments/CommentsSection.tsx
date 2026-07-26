"use client";

import { useState } from "react";
import { usePostComments } from "@/features/community/hooks/usePostComments";
import { countComments } from "@/features/community/lib/comment.utils";
import { Card, CardContent } from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import Skeleton from "@/shared/ui/Skeleton";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function CommentsSection({ postId }: { postId: number }) {
  const {
    commentsQuery,
    createCommentMutation,
    deleteCommentMutation,
  } = usePostComments(postId);
  const [commentValue, setCommentValue] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyValue, setReplyValue] = useState("");
  const comments = commentsQuery.data ?? [];

  const submitComment = () => {
    const content = commentValue.trim();
    if (!content || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      { content, parentId: null },
      {
        onSuccess: () => {
          setCommentValue("");
          setReplyValue("");
          setReplyTo(null);
        },
      },
    );
  };

  const submitReply = () => {
    const content = replyValue.trim();
    if (replyTo === null || !content || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      { content, parentId: replyTo },
      {
        onSuccess: () => {
          setReplyValue("");
          setReplyTo(null);
        },
      },
    );
  };

  const openReply = (commentId: number) => {
    setReplyTo(commentId);
    setReplyValue("");
  };

  const deleteComment = (commentId: number) => {
    if (deleteCommentMutation.isPending || !confirm("댓글을 삭제할까요?")) return;
    deleteCommentMutation.mutate(commentId);
  };

  if (commentsQuery.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (commentsQuery.isError) {
    return (
      <EmptyState
        title="댓글을 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-neutral-200">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-semibold text-neutral-900">
            댓글 <span className="text-neutral-500">({countComments(comments)})</span>
          </p>
          <CommentForm
            value={commentValue}
            onChange={setCommentValue}
            onSubmit={submitComment}
            placeholder="댓글을 입력하세요"
            submitLabel="등록"
            isSubmitting={createCommentMutation.isPending}
          />
        </CardContent>
      </Card>

      {comments.length === 0 ? (
        <EmptyState
          title="아직 댓글이 없어요."
          description="첫 댓글을 남겨보세요."
        />
      ) : (
        <CommentList
          comments={comments}
          replyTo={replyTo}
          replyValue={replyValue}
          isSubmitting={createCommentMutation.isPending}
          onReplyValueChange={setReplyValue}
          onOpenReply={openReply}
          onCloseReply={() => setReplyTo(null)}
          onSubmitReply={submitReply}
          onDelete={deleteComment}
        />
      )}
    </div>
  );
}
