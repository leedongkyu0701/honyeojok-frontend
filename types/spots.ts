import type { TagResponse } from "./tag";
import type { ImageSource } from "./util";

export enum SpotCategory {
  FOOD = "food",
  CAFE = "cafe",
  DRINK = "drink",
  ACTIVITY = "activity",
  NATURE = "nature",
  ETC = "etc",
}

export type SpotDestinationResponse = {
  id: number;
  slug: string;
  name: string;
};

export type SpotCardResponse = {
  id: number;
  slug: string;
  name: string;

  summary: string;
  category: SpotCategory;
  imageUrl: string | null;

  lat: number | null;
  lng: number | null;

  tags: TagResponse[];
  destination: SpotDestinationResponse;
};

export type SpotDetailResponse = {
  id: number;
  slug: string;
  name: string;

  category: SpotCategory;

  description: string;
  honyeoTip: string | null;

  imageUrl: string | null;
  imageSource: ImageSource | null;
  imageCredit: string | null;

  address: string | null;
  lat: number | null;
  lng: number | null;
  externalUrl: string | null;

  tags: TagResponse[];
  destination: SpotDestinationResponse;
};

export type SpotMapResponse = {
  id: number;
  slug: string;
  name: string;

  category: SpotCategory;
  summary: string;

  lat: number | null;
  lng: number | null;
};

export type FindHotSpotsResponse = {
  food: SpotCardResponse[];
  cafe: SpotCardResponse[];
  drink: SpotCardResponse[];
  activity: SpotCardResponse[];
  nature: SpotCardResponse[];
  etc: SpotCardResponse[];
};
