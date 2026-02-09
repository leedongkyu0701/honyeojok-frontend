import type { TripRouteCardEntity } from "@/types/trip-routes";
import type { TripRouteDetailEntity } from "@/types/trip-routes";
import { fetchClient } from "@/lib/fetchClient";
import { parseApiError } from "@/lib/parseApiError";

export async function fetchTripRoutesByRegion(
  region: string,
): Promise<TripRouteCardEntity[]> {
  const response = await fetchClient(`/trip-routes/region/${region}`, {
    skipAuth: true,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchTripRouteDetail(
  region: string,
  slug: string,
): Promise<TripRouteDetailEntity> {
  const response = await fetchClient(`/trip-routes/${region}/${slug}`);
  await parseApiError(response);
  return response.json();
}

export async function fetchHotRoutes(): Promise<TripRouteCardEntity[]> {
  const response = await fetchClient(`/trip-routes/hot`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function toggleBookmarkTripRoute(
  slug: string,
): Promise<{ bookmarked: boolean; bookmarkCount: number }> {
  const response = await fetchClient(`/trip-routes/bookmark/${slug}`, {
    method: "POST",
  });
  await parseApiError(response);
  return response.json();
}

export async function addBookmarkTripRoute(
  slug: string,
): Promise<{ bookmarked: boolean; bookmarkCount: number }> {
  const response = await fetchClient(`/trip-routes/bookmark/add/${slug}`, {
    method: "POST",
  });
  await parseApiError(response);
  return response.json();
}

export async function removeBookmarkTripRoute(
  slug: string,
): Promise<{ bookmarked: boolean; bookmarkCount: number }> {
  const response = await fetchClient(`/trip-routes/bookmark/remove/${slug}`, {
    method: "POST",
  });
  await parseApiError(response);
  return response.json();
}
