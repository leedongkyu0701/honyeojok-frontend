// types/trip-routes.ts

export type TripRouteTagEntity = {
  slug: string;
  label: string;
};

export type TripRouteItemType = "spot" | "food" | "cafe" | "stay" | "activity";

export type TripRouteItemEntity = {
  id: number;
  type: TripRouteItemType;
  order: number;
  recommendedLevel: number;

  title: string;
  description?: string;
  imageUrl?: string;

  lat?: number;
  lng?: number;

  address?: string;
  startTime?: string; // "10:30"
  endTime?: string;

  externalUrl?: string;
};

export type TripRouteDayEntity = {
  id: number;
  dayNumber: number; // 1,2,3...
  title?: string;
  note?: string;
  items: TripRouteItemEntity[];
};

// ✅ 카드(리스트)에서 내려오는 형태 (TripRoutesCardResponse)
export type TripRouteCardEntity = {
  id: number;
  slug: string;
  region: string;
  title: string;
  summary: string;
  days: number;
  bookmarkCount: number;
};

// ✅ 디테일에서 내려오는 형태 (TripRouteDetailResponse)
export type TripRouteDetailEntity = TripRouteCardEntity & {
  tags: TripRouteTagEntity[];
  daysPlan: TripRouteDayEntity[];
  bookmarkedByMe: boolean;
};

