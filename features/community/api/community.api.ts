import { fetchClient } from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";
import {
  postCardSchema,
  postDetailSchema,
  commentsSchema,
  commentSchema,
  likePostResponseSchema,
  postListSchema,
  postCardListSchema,
} from "@/features/community/schemas/response";
import { findPostsParamsSchema, 
  type FindPostsParams
 } from "@/features/community/schemas/request";


// export type FindPostsParams = {
//   page?: number | null;
//   take?: number | null;
//   type?: PostType | null;
//   q?: string | null;
//   province?: ProvinceGroup | null;
// };

export async function fetchPosts(params: FindPostsParams = {}) {
  const parsedParams = findPostsParamsSchema.parse(params); // 유효성 검사 및 타입 추론
  const qs = new URLSearchParams();

  if (parsedParams.page != null) qs.append("page", String(parsedParams.page));
  if (parsedParams.take != null) qs.append("take", String(parsedParams.take));
  if (parsedParams.type) qs.append("type", parsedParams.type);
  if (parsedParams.q) qs.append("q", parsedParams.q);
  if (parsedParams.province) qs.append("province", parsedParams.province);
  const response = await fetchClient(`/posts${qs.toString() ? `?${qs}` : ""}`, {
    skipAuth: true,
    withCredentials: false,
  });

  await parseApiError(response);
  const data = await response.json(); 
  return postListSchema.parse(data); 
  // 만약 여기서 에러 잡힐경우, 전역 쿼리 프로바이더에서 ZodError로 잡히게 됨.
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
