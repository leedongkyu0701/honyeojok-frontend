import type { CommentResponse } from "@/features/community/schemas/comment.schema";

export function countComments(comments: CommentResponse[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.children),
    0,
  );
}
