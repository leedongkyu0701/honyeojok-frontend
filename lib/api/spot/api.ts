import type { SpotEntity } from "@/types/spots";
import { fetchClient } from "@/lib/fetchClient";
import type { SpotCardVM } from "@/types/spots";
import { parseApiError } from "@/lib/parseApiError";

export type HotSpotsResponse = {
  healing: SpotCardVM[];
  foodie: SpotCardVM[];
  activity: SpotCardVM[];
  honsool: SpotCardVM[];
  cafe: SpotCardVM[];
}


export async function fetchSpotDetail(id: number): Promise<SpotEntity> {
    const response = await fetchClient(`/spots/${id}`,{
      skipAuth: true,
    });
    await parseApiError(response);
    return response.json();
}

export async function fetchHotSpots(): Promise<HotSpotsResponse> {
    const response = await fetchClient(`/spots/hot`,{
      skipAuth: true,
      withCredentials: false,
    });
    await parseApiError(response);
    return response.json();
}

export async function fetchRecommendedSpots(): Promise<SpotCardVM[]> {
    const response = await fetchClient(`/spots/recommended`,{
      skipAuth: true,
      withCredentials: false,
    });
    await parseApiError(response);
    return response.json();
}

export async function fetchSpotsByRegion(tag: string | null, page: number, region: string): Promise<{ data: SpotCardVM[]; totalPages: number; }> {
    const queryParams = new URLSearchParams();
    if (tag) {
        queryParams.append('tag', tag);
    }
    queryParams.append('page', page.toString());

    const response = await fetchClient(`/spots/region/${region}?${queryParams.toString()}`,{    
        skipAuth: true,
    });
    await parseApiError(response);
    return response.json();
}