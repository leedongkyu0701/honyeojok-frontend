import type { TripRouteCardResponse } from "./trip-routes";
import type { SpotCardResponse } from "./spots";
import type { TagResponse } from "./tag";
import type { ProvinceGroup } from "./util";
import type { ImageSource } from "./util";

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

  difficulty: {
    food: number;
    transport: number;
    safety: number;
    loneliness: number;
  };

  tags: TagResponse[];
  routes: TripRouteCardResponse[];
  spots: SpotCardResponse[];
};

export type DestinationSearchResponse = {
  id: number;
  slug: string;
  name: string;
};
