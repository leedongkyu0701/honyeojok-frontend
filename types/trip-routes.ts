import { TagResponse } from "./tag";

export type TripRouteCardResponse = {
  id: number;
  slug: string;

  regionSlug: string;

  title: string;
  summary: string;
  days: number;

  bookmarkCount: number;
};

export type TripRouteItemResponse = {
  id: number;

  order: number;
  recommendedLevel: number;

  title: string;
  description: string;

  imageUrl: string | null;
  imageCredit: string | null;

  lat: number | null;
  lng: number | null;

  address: string | null;

  startTime: string | null;
  endTime: string | null;

  externalUrl: string | null;

  // spot 연결된 경우에만 내려줌
  spot?: {
    id: number;
    slug: string;
  };
};

export type TripRouteDayResponse = {
  id: number;
  dayNumber: number;
  title: string;
  note: string;

  items: TripRouteItemResponse[];
};

export type TripRouteDetailResponse = {
  id: number;
  slug: string;

  title: string;
  summary: string;
  honeyoTip: string | null;
  days: number;
  honyeoCost: number;

  bookmarkCount: number;
  bookmarkedByMe: boolean;

  tags: TagResponse[];
  daysPlan: TripRouteDayResponse[];
};
