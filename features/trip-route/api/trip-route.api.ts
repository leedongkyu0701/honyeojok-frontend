import type {
  TripRouteCardResponse,
  TripRouteDetailResponse,
} from "@/features/trip-route/types/trip-routes";
import { fetchClient } from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";
import { SpotCategory } from "@/features/spot/types/spots";
import { SpotMapResponse } from "@/features/spot/types/spots";


export type FetchNearbyTripRoutesParams = {
  radiusKm?: number;
  categories?: SpotCategory[];
  limit?: number;
};

export type NearbySpotsResponse = Partial<Record<SpotCategory, SpotMapResponse[]>>;

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
    `/trip-routes/region/${encodeURIComponent(region)}/${encodeURIComponent(slug)}`,
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
    { method: "PUT" },
  );
  await parseApiError(response);
  return response.json();
}

export async function removeBookmarkTripRoute(
  slug: string,
): Promise<BookmarkTripRouteResponse> {
  const response = await fetchClient(
    `/trip-routes/bookmark/remove/${encodeURIComponent(slug)}`,
    { method: "DELETE" },
  );
  await parseApiError(response);
  return response.json();
}

export async function fetchNearbyTripRoutes(
  routeSlug: string,
  params: FetchNearbyTripRoutesParams,
): Promise<NearbySpotsResponse> {
  const qs = new URLSearchParams();
  if (params?.radiusKm != null) qs.set("radiusKm", String(params.radiusKm));
  if (params?.limit != null) qs.set("limit", String(params.limit));
  if (params?.categories?.length) {
    params.categories.forEach((c) => qs.append("categories", c));
  }
  const queryString = qs.toString();

  const response = await fetchClient(
    `/trip-routes/nearby-spots/${encodeURIComponent(routeSlug)}${
      queryString ? `?${queryString}` : ""
    }`,{
      skipAuth: true,
      withCredentials: false,
    }
  );
  await parseApiError(response);
  return response.json();
}