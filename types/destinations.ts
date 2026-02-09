import type { TripRouteCardEntity } from "./trip-routes";
import type { SpotCardVM } from "./spots";

export type DestinationEntity = {
  id: number;
  slug: string;
  name: string;

  score: number;
  imageUrl: string;
  imageSource?: ImageSource;
  imageCredit?: string;

  latitude: number;
  longitude: number;

  difficulty: {
    food: number;
    transport: number;
    safety: number;
    loneliness: number;
  };

  summary: string; 
  reviewCount: number;
  rank?: number;
};



export type DestinationCardVM = Pick<
  DestinationEntity,
  "id" | "slug" | "name" | "score" | "imageUrl" | "summary"
>;


export type DestinationMapVM = Pick<
  DestinationEntity,
  "id" | "slug" | "name" | "latitude" | "longitude" | "score"
> ;


export type DestinationDetailVM = Pick<
  DestinationEntity,
  | "id"
  | "slug"
  | "name"
  | "score"
  | "imageUrl"
  | "difficulty"
  | "summary"
  | "imageSource"
  | "imageCredit"
> & {
  routes: TripRouteCardEntity[];
  spots: SpotCardVM[];
};

export type DestinationFindByQueryVM = Pick<
  DestinationEntity,
  "id" | "slug" | "name"
>;

export enum ProvinceGroup {
  SEOUL_GYEONGGI = "SEOUL_GYEONGGI",
  GANGWON = "GANGWON",
  CHUNGCHEONG = "CHUNGCHEONG",
  JEOLLA = "JEOLLA",
  GYEONGSANG = "GYEONGSANG",
  JEJU = "JEJU",
}

export enum ImageSource {
  UNSPLASH = 'UNSPLASH',
  KTO = 'KTO', // 한국관광공사
  OWNER = 'OWNER', // 업체/사장님 제공
  USER = 'USER', // 유저 업로드
  ETC = 'ETC',
}

