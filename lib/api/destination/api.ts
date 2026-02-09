import type { DestinationCardVM } from "@/types/destinations";
import type { DestinationMapVM } from "@/types/destinations";
import type { DestinationDetailVM } from "@/types/destinations";
import type { DestinationFindByQueryVM } from "@/types/destinations";
import { fetchClient } from "../../fetchClient";
import { parseApiError } from "../../parseApiError";

export type DestinationListResponse<T> = {
  data: T[];
  totalPages: number;
};

export type FetchDestinationsParams = {
  province?: string | null;
  sort?: "score" | "reviewCount" | "rank" | null;
  q?: string | null;
  page?: number;
  take?: number;
};

export async function fetchDestinations(
  query: FetchDestinationsParams,
): Promise<DestinationListResponse<DestinationCardVM>> {
  const queryString = new URLSearchParams();
  if (query.province) {
    queryString.append("province", query.province);
  }
  if (query.sort) {
    queryString.append("sort", query.sort);
  }
  if (query.q) {
    queryString.append("q", query.q);
  }
  if (query.page) {
    queryString.append("page", query.page.toString());
  }
  if (query.take) {
    queryString.append("take", query.take.toString());
  }
  const qs = queryString.toString();
  const response = await fetchClient(`/destinations${qs ? `?${qs}` : ""}`,{
    skipAuth: true,
  });

  await parseApiError(response);
  return response.json();
}

export async function fetchWeeklyPick(): Promise<DestinationCardVM> {
  const response = await fetchClient(`/destinations/weekly`,{
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchRecommendedDestinations(): Promise<
  DestinationCardVM[]
> {
  const response = await fetchClient(`/destinations/recommended`,{
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchDestinationDetail(
  region: string,
): Promise<DestinationDetailVM> {
  const response = await fetchClient(`/destinations/${region}`,{
    skipAuth: true,
  });
  await parseApiError(response);
  return response.json();
}

export async function fetchDestinationMapData(): Promise<DestinationMapVM[]> {
  const response = await fetchClient(`/destinations/map`,{
    skipAuth: true,
    withCredentials: false,
  });
  await parseApiError(response);
  return response.json();
}

export async function searchDestinations(
  query: string,
): Promise<DestinationFindByQueryVM[] | []> {
  const response = await fetchClient(
    `/destinations/search?q=${encodeURIComponent(query)}`,{
      skipAuth: true,
    }
  );
  await parseApiError(response);
  return response.json();
}
