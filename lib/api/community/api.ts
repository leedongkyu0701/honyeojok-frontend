import { fetchClient } from "@/lib/fetchClient";
import { parseApiError } from "@/lib/parseApiError";
import type {
  PostCardResponse,
  PostDetailResponse,
  PostType,
  CommentResponse,
} from "@/types/community";

export type PostListResponse<T> = {
  posts: T[];
  totalPages: number;
};

export type FindPostsParams = {
  page?: number | null;
  take?: number | null;
  type?: PostType | null;
  q?: string | null;
};

export async function fetchPosts(
  params: FindPostsParams = {},
): Promise<PostListResponse<PostCardResponse>> {
  const qs = new URLSearchParams();

  if (params.page != null) qs.append("page", String(params.page));
  if (params.take != null) qs.append("take", String(params.take));
  if (params.type) qs.append("type", params.type);
  if (params.q) qs.append("q", params.q);
  
  const response = await fetchClient(`/posts${qs.toString() ? `?${qs}` : ""}`, {
    skipAuth: true,
    withCredentials: false,
  });

  await parseApiError(response);
  return response.json();
}

export async function incrementPostViewCount(postId: number): Promise<void> {
  const response = await fetchClient(`/posts/${postId}/view`, {
    method: "POST",
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
}

export async function fetchBestPosts(): Promise<PostCardResponse[]> {
  const response = await fetchClient(`/posts/best`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchPostsByRegionSlug(
  regionSlug: string,
): Promise<PostCardResponse[]> {
  const response = await fetchClient(
    `/posts/region/${encodeURIComponent(regionSlug)}`,
    {
      skipAuth: true,
      withCredentials: false,
    },
  );
  await parseApiError(response);
  return response.json();
}

export async function fetchPostDetail(postId: number): Promise<PostDetailResponse> {
  const response = await fetchClient(`/posts/${postId}`);
  await parseApiError(response);
  return response.json();
}


export async function createPost(formData: FormData): Promise<PostCardResponse> {
  const response = await fetchClient("/posts", {
    method: "POST",
    body: formData,
  });
  await parseApiError(response);
  return response.json();
}

export async function deletePost(postId: number): Promise<void> {
  const response = await fetchClient(`/posts/${postId}`, {
    method: "DELETE",
  });
  await parseApiError(response);
}

export type LikePostResponse = { liked: boolean; likeCount: number };

export async function likePost(postId: number): Promise<LikePostResponse> {
  const response = await fetchClient(`/posts/${postId}/like`, {
    method: "POST",
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchComments(postId: number): Promise<CommentResponse[]> {
  const response = await fetchClient(`/posts/${postId}/comments`);
  await parseApiError(response);
  return response.json();
}

export type CreateCommentBody = {
  content: string;
  parentId?: number | null;
};

export async function createComment(
  postId: number,
  body: CreateCommentBody,
): Promise<CommentResponse> {
  const response = await fetchClient(`/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await parseApiError(response);
  return response.json();
}

export async function deleteComment(commentId: number): Promise<void> {
  const response = await fetchClient(`/posts/comments/${commentId}`, {
    method: "DELETE",
  });
  await parseApiError(response);
}