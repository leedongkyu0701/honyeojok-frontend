import { fetchClient } from "@/lib/fetchClient";
import { parseApiError } from "@/lib/parseApiError";
import { ProvinceGroup } from "@/types/util";
import {
  postCardSchema,
  postDetailSchema,
  commentsSchema,
  commentSchema,
  likePostResponseSchema,
  postListSchema,
  postCardListSchema,
  type PostType,
} from "@/lib/schemas/community/response";


export type FindPostsParams = {
  page?: number | null;
  take?: number | null;
  type?: PostType | null;
  q?: string | null;
  province?: ProvinceGroup | null;
};

export async function fetchPosts(params: FindPostsParams = {}) {
  const qs = new URLSearchParams();

  if (params.page != null) qs.append("page", String(params.page));
  if (params.take != null) qs.append("take", String(params.take));
  if (params.type) qs.append("type", params.type);
  if (params.q) qs.append("q", params.q);
  if (params.province) qs.append("province", params.province);
  const response = await fetchClient(`/posts${qs.toString() ? `?${qs}` : ""}`, {
    skipAuth: true,
    withCredentials: false,
  });

  await parseApiError(response);
  const data = await response.json();
  return postListSchema.parse(data);
}

export async function incrementPostViewCount(postId: number): Promise<void> {
  const response = await fetchClient(`/posts/${postId}/view`, {
    method: "POST",
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
}

export async function fetchBestPosts() {
  const response = await fetchClient(`/posts/best`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  const data = await response.json();
  return postCardListSchema.parse(data);
}

export async function fetchPostsByRegionSlug(regionSlug: string) {
  const response = await fetchClient(
    `/posts/region/${encodeURIComponent(regionSlug)}`,
    {
      skipAuth: true,
      withCredentials: false,
    },
  );
  await parseApiError(response);
  const data = await response.json();
  return postCardListSchema.parse(data);
}

export async function fetchPostDetail(postId: number) {
  const response = await fetchClient(`/posts/${postId}`);
  await parseApiError(response);
  const data = await response.json();
  return postDetailSchema.parse(data);
}

export async function createPost(
  formData: FormData,
) {
  const response = await fetchClient("/posts", {
    method: "POST",
    body: formData,
  });
  await parseApiError(response);
  const data = await response.json();
  return postCardSchema.parse(data);
}

export async function deletePost(postId: number): Promise<void> {
  const response = await fetchClient(`/posts/${postId}`, {
    method: "DELETE",
  });
  await parseApiError(response);
}

export async function likePost(postId: number) {
  const response = await fetchClient(`/posts/${postId}/like`, {
    method: "POST",
  });
  await parseApiError(response);
  const data = await response.json();
  return likePostResponseSchema.parse(data);
}

export async function fetchComments(postId: number) {
  const response = await fetchClient(`/posts/${postId}/comments`);
  await parseApiError(response);
  const data = await response.json();
  return commentsSchema.parse(data);
}

export type CreateCommentBody = {
  content: string;
  parentId?: number | null;
};

export async function createComment(postId: number, body: CreateCommentBody) {
  const response = await fetchClient(`/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  await parseApiError(response);
  const data = await response.json();
  return commentSchema.parse(data);
}

export async function deleteComment(commentId: number): Promise<void> {
  const response = await fetchClient(`/posts/comments/${commentId}`, {
    method: "DELETE",
  });
  await parseApiError(response);
}
