import { fetchClient } from "@/lib/fetchClient";
import type { PostCardVM } from "@/types/post";
import type { PostDetailVM } from "@/types/post";
import type { CommentEntity } from "@/types/post";
import { parseApiError } from "@/lib/parseApiError";

export async function fetchPosts(
  page: number,
  type?: string,
  searchTerm?: string,
): Promise<{ posts: PostCardVM[]; totalPages: number }> {
  const response = await fetchClient(
    `/posts?page=${page}${type ? `&type=${type}` : ""}${searchTerm ? `&q=${searchTerm}` : ""}`,{
      skipAuth: true,
    }
  );
  await parseApiError(response);
  return response.json();
}

export async function fetchBestPosts(): Promise<PostCardVM[]> {
  const response = await fetchClient(`/posts/best`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchPostsByRegionSlug(
  regionSlug: string,
): Promise<PostCardVM[]> {
  const response = await fetchClient(`/posts/region/${regionSlug}`, {
    skipAuth: true,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchPostDetail(postId: number): Promise<PostDetailVM> {
  const response = await fetchClient(`/posts/${postId}`);
  await parseApiError(response);
  return response.json();
}

export async function createPost(formData: FormData): Promise<PostCardVM> {
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

export async function likePost(
  postId: number,
): Promise<{ liked: boolean; likeCount: number }> {
  const response = await fetchClient(`/posts/${postId}/like`, {
    method: "POST",
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchComments(postId: number): Promise<CommentEntity[]> {
  const response = await fetchClient(`/posts/${postId}/comments`);
  await parseApiError(response);
  return response.json();
}

export async function createComment(
  postId: number,
  content: string,
  parentId: number | null = null,
): Promise<CommentEntity> {
  const response = await fetchClient(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, parentId }),
  });
  await parseApiError(response);
  return response.json();
}

export async function deleteComment(commentId: number): Promise<void> {
  const response = await fetchClient(`/posts/comments/${commentId}`, {
    method: "DELETE",
  });
  await parseApiError(response);
  return response.json();
}
