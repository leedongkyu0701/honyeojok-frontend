import type { DestinationCardResponse } from "@/types/destinations";
import type { DestinationDetailResponse } from "@/types/destinations";
import type { DestinationMapResponse } from "@/types/destinations";
import type { DestinationSearchResponse } from "@/types/destinations";
import { fetchClient } from "../../fetchClient";
import { parseApiError } from "../../parseApiError";

export type DestinationListResponse<T> = {
  data: T[];
  totalPages: number;
};

export type FetchDestinationsParams = {
  province?: string | null;
  sort?: "score" | "rank" | null;
  page?: number;
  take?: number;
};

export async function fetchDestinations(
  query: FetchDestinationsParams,
): Promise<DestinationListResponse<DestinationCardResponse>> {
  const queryString = new URLSearchParams();
  if (query.province) {
    queryString.append("province", query.province);
  }
  if (query.sort) {
    queryString.append("sort", query.sort);
  }
  if (query.page != null) queryString.append("page", String(query.page));
  if (query.take != null) queryString.append("take", String(query.take));

  const qs = queryString.toString();
  const response = await fetchClient(`/destinations${qs ? `?${qs}` : ""}`, {
    skipAuth: true,
  });

  await parseApiError(response);
  return response.json();
}

export async function fetchWeeklyPick(): Promise<DestinationCardResponse> {
  const response = await fetchClient(`/destinations/weekly`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchRecommendedDestinations(): Promise<
  DestinationCardResponse[]
> {
  const response = await fetchClient(`/destinations/recommended`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchDestinationDetail(
  region: string,
): Promise<DestinationDetailResponse> {
  const response = await fetchClient(`/destinations/${region}`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchDestinationMapData(): Promise<
  DestinationMapResponse[]
> {
  const response = await fetchClient(`/destinations/map`, {
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function searchDestinations(
  query: string,
): Promise<DestinationSearchResponse[]> {
  const response = await fetchClient(
    `/destinations/search?q=${encodeURIComponent(query)}`,
    {
      skipAuth: true,
      withCredentials: false,
    },
  );
  await parseApiError(response);
  return response.json();
}
