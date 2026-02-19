import type {
  TripRouteCardResponse,
  TripRouteDetailResponse,
} from "@/types/trip-routes";
import { fetchClient } from "@/lib/fetchClient";
import { parseApiError } from "@/lib/parseApiError";

export async function fetchTripRoutesByRegion(
  region: string,
): Promise<TripRouteCardResponse[]> {
  const response = await fetchClient(
    `/trip-routes/region/${encodeURIComponent(region)}`,
    {
      skipAuth: true,
      withCredentials: false,
    },
  );
  await parseApiError(response);
  return response.json();
}

export async function fetchTripRouteDetail(
  region: string,
  slug: string,
): Promise<TripRouteDetailResponse> {
  const response = await fetchClient(
    `/trip-routes/${encodeURIComponent(region)}/${encodeURIComponent(slug)}`,
  );
  await parseApiError(response);
  return response.json();
}

export async function fetchHotRoutes(): Promise<TripRouteCardResponse[]> {
  const response = await fetchClient(`/trip-routes/hot`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export type BookmarkTripRouteResponse = {
  bookmarked: boolean;
  bookmarkCount: number;
};

export async function toggleBookmarkTripRoute(
  slug: string,
): Promise<BookmarkTripRouteResponse> {
  const response = await fetchClient(
    `/trip-routes/bookmark/${encodeURIComponent(slug)}`,
    { method: "POST" },
  );
  await parseApiError(response);
  return response.json();
}

export async function addBookmarkTripRoute(
  slug: string,
): Promise<BookmarkTripRouteResponse> {
  const response = await fetchClient(
    `/trip-routes/bookmark/add/${encodeURIComponent(slug)}`,
    { method: "POST" },
  );
  await parseApiError(response);
  return response.json();
}

export async function removeBookmarkTripRoute(
  slug: string,
): Promise<BookmarkTripRouteResponse> {
  const response = await fetchClient(
    `/trip-routes/bookmark/remove/${encodeURIComponent(slug)}`,
    { method: "POST" },
  );
  await parseApiError(response);
  return response.json();
}
