import type { TripRouteCardResponse } from "@/features/trip-route/types/trip-routes";
import type { SpotCardResponse } from "@/features/spot/types/spots";
import type { TagResponse } from "@/shared/types/tag";
import type { ProvinceGroup } from "@/shared/types/util";
import type { ImageSource } from "@/shared/types/util";

export type DestinationCardResponse = {
  id: number;
  slug: string;
  name: string;
  score: number;
  summary: string;
  imageUrl: string | null;
};

export type DestinationMapResponse = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  latitude: number;
  longitude: number;
  score: number;
  tagSlugs: string[];
};

export type DestinationDetailResponse = {
  id: number;
  slug: string;
  name: string;
  province: ProvinceGroup;
  score: number;

  imageUrl: string | null;
  imageSource: ImageSource | null;
  imageCredit: string | null;

  summary: string;
  description: string;

  difficulty: HonyeoDifficulty;

  tags: TagResponse[];
  routes: TripRouteCardResponse[];
  spots: SpotCardResponse[];
};

export type DestinationSearchResponse = {
  id: number;
  slug: string;
  name: string;
};


export type HonyeoDifficulty = {
  food: number;
  transport: number;
  safety: number;
  loneliness: number;
};