import { fetchClient } from "@/lib/fetchClient";
import type { ProfileVM } from "@/types/user";
import type { TripRouteCardEntity } from "@/types/trip-routes";
import type { PostCardVM } from "@/types/post";
import { parseApiError } from "@/lib/parseApiError";

export async function fetchMeApi(): Promise<ProfileVM> {
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
  limit: number,
): Promise<{ tripRoutes: TripRouteCardEntity[]; totalPages: number }> {
  const response = await fetchClient(
    `/users/me/bookmarks?page=${page}&limit=${limit}`,
  );
  await parseApiError(response);
  return response.json();
}

export async function getMyPosts(
  page: number,
  limit: number,
): Promise<{ posts: PostCardVM[]; totalPages: number }> {
  const response = await fetchClient(
    `/users/me/posts?page=${page}&limit=${limit}`,
  );
  await parseApiError(response);
  return response.json();
}
