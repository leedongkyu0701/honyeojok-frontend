import {
  fetchClient,
  publicRequestOptions,
} from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";
import {
  likePostResponseSchema,
  postCardListSchema,
  postCardSchema,
  postDetailSchema,
  postListSchema,
} from "@/features/community/schemas/post.schema";
import {
  findPostsParamsSchema,
  type FindPostsParamsInput,
} from "@/features/community/schemas/post-request.schema";

export async function fetchPosts(params: FindPostsParamsInput = {}) {
  const parsedParams = findPostsParamsSchema.parse(params);
  const query = new URLSearchParams();

  if (parsedParams.page != null) query.set("page", String(parsedParams.page));
  if (parsedParams.take != null) query.set("take", String(parsedParams.take));
  if (parsedParams.type) query.set("type", parsedParams.type);
  if (parsedParams.q) query.set("q", parsedParams.q);
  if (parsedParams.province) query.set("province", parsedParams.province);

  const queryString = query.toString();
  const response = await fetchClient(
    `/posts${queryString ? `?${queryString}` : ""}`,
    publicRequestOptions,
  );

  await parseApiError(response);
  return postListSchema.parse(await response.json());
}

export async function fetchBestPosts() {
  const response = await fetchClient("/posts/best", publicRequestOptions);
  await parseApiError(response);
  return postCardListSchema.parse(await response.json());
}

export async function fetchPostsByRegionSlug(regionSlug: string) {
  const response = await fetchClient(
    `/posts/region/${encodeURIComponent(regionSlug)}`,
    publicRequestOptions,
  );
  await parseApiError(response);
  return postCardListSchema.parse(await response.json());
}

export async function fetchPostDetail(postId: number) {
  const response = await fetchClient(`/posts/${postId}`);
  await parseApiError(response);
  return postDetailSchema.parse(await response.json());
}

export async function incrementPostViewCount(postId: number): Promise<void> {
  const response = await fetchClient(`/posts/${postId}/view`, {
    method: "POST",
    ...publicRequestOptions,
  });
  await parseApiError(response);
}

export async function createPost(formData: FormData) {
  const response = await fetchClient("/posts", {
    method: "POST",
    body: formData,
  });
  await parseApiError(response);
  return postCardSchema.parse(await response.json());
}

export async function deletePost(postId: number): Promise<void> {
  const response = await fetchClient(`/posts/${postId}`, { method: "DELETE" });
  await parseApiError(response);
}

export async function likePost(postId: number) {
  const response = await fetchClient(`/posts/${postId}/like`, {
    method: "POST",
  });
  await parseApiError(response);
  return likePostResponseSchema.parse(await response.json());
}
