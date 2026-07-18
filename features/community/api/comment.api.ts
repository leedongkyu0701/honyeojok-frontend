import { fetchClient } from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";
import {
  commentSchema,
  commentsSchema,
  createCommentBodySchema,
  type CreateCommentBody,
} from "@/features/community/schemas/comment.schema";

export async function fetchComments(postId: number) {
  const response = await fetchClient(`/posts/${postId}/comments`);
  await parseApiError(response);
  return commentsSchema.parse(await response.json());
}

export async function createComment(postId: number, body: CreateCommentBody) {
  const parsedBody = createCommentBodySchema.parse(body);
  const response = await fetchClient(`/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedBody),
  });
  await parseApiError(response);
  return commentSchema.parse(await response.json());
}

export async function deleteComment(commentId: number): Promise<void> {
  const response = await fetchClient(`/posts/comments/${commentId}`, {
    method: "DELETE",
  });
  await parseApiError(response);
}
