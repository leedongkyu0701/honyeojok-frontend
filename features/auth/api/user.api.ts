import { fetchClient } from "@/shared/api/fetchClient";
import type { ProfileResponse } from "@/features/auth/types/auth";
import type { TripRouteCardResponse } from "@/features/trip-route/types/trip-routes";
import type { PostCardResponse } from "@/features/community/schemas/post.schema";
import { parseApiError } from "@/shared/api/parseApiError";

export async function fetchMeApi(): Promise<ProfileResponse> {
  const response = await fetchClient("/users/me");
  await parseApiError(response);
  return response.json();
}

export async function updateNickname(nickName: string) {
  const response = await fetchClient("/users/me/nickname", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickName }),
  });
  await parseApiError(response);
  return response.json();
}

export async function getMyBookmarks(
  page: number,
  take: number,
): Promise<{ tripRoutes: TripRouteCardResponse[]; totalPages: number }> {
  const response = await fetchClient(
    `/users/me/bookmarks?page=${page}&take=${take}`,
  );
  await parseApiError(response);
  return response.json();
}

export async function getMyPosts(
  page: number,
  take: number,
): Promise<{ posts: PostCardResponse[]; totalPages: number }> {
  const response = await fetchClient(
    `/users/me/posts?page=${page}&take=${take}`,
  );
  await parseApiError(response);
  return response.json();
}
