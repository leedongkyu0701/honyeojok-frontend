import type {
  SpotCardResponse,
  SpotDetailResponse,
  FindHotSpotsResponse,
  SpotCategory,
} from "@/features/spot/types/spots";
import {
  fetchClient,
  publicRequestOptions,
} from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";

export type SpotListResponse<T> = {
  data: T[];
  totalPages: number;
};


export async function fetchSpotDetail(id: number): Promise<SpotDetailResponse> {
  const response = await fetchClient(`/spots/${id}`, publicRequestOptions);
  await parseApiError(response);
  return response.json();
}

export async function fetchHotSpots(): Promise<FindHotSpotsResponse> {
  const response = await fetchClient("/spots/hot", publicRequestOptions);
  await parseApiError(response);
  return response.json();
}

export async function fetchRecommendedSpots(): Promise<SpotCardResponse[]> {
  const response = await fetchClient(
    "/spots/recommended",
    publicRequestOptions,
  );
  await parseApiError(response);
  return response.json();
}

export async function fetchSpotsByRegion(
  region: string,
  params: {
    category?: SpotCategory | null;
    page?: number;
    take?: number;
  } = {},
): Promise<SpotListResponse<SpotCardResponse>> {
  const query = new URLSearchParams();

  if (params.category) query.append("category", params.category);

  if (params.page != null) query.append("page", String(params.page));
  if (params.take != null) query.append("take", String(params.take));

  const qs = query.toString();

  const response = await fetchClient(
    `/spots/region/${encodeURIComponent(region)}${qs ? `?${qs}` : ""}`,
    publicRequestOptions,
  );

  await parseApiError(response);
  return response.json();
}
