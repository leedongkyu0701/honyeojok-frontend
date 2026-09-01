import type { CategoryType, PostType } from "@/features/community/schemas/post.schema";
import { ProvinceGroup } from "@/shared/types/util";

export const POST_TYPE_META = {
  REVIEW: {
    label: "리뷰",
    badgeClassName: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  QUESTION: {
    label: "질문",
    badgeClassName: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  FREE: {
    label: "자유",
    badgeClassName: "bg-neutral-50 text-neutral-700 border-neutral-200",
  },
} satisfies Record<
  PostType,
  {
    label: string;
    badgeClassName: string;
  }
>;

export const COMMUNITY_CATEGORY_OPTIONS = [
  { label: "전체", value: "ALL", description: "전체 글" },
  { label: "리뷰", value: "REVIEW", description: "여행 후기" },
  { label: "자유", value: "FREE", description: "잡담/공유" },
  { label: "질문", value: "QUESTION", description: "도움 요청" },
] satisfies ReadonlyArray<{
  label: string;
  value: CategoryType;
  description: string;
}>;

export const PROVINCE_FILTER_OPTIONS = [
  { label: "전체", value: null },
  { label: "수도권", value: ProvinceGroup.SEOUL_GYEONGGI },
  { label: "강원", value: ProvinceGroup.GANGWON },
  { label: "충청", value: ProvinceGroup.CHUNGCHEONG },
  { label: "전라", value: ProvinceGroup.JEOLLA },
  { label: "경상", value: ProvinceGroup.GYEONGSANG },
  { label: "제주", value: ProvinceGroup.JEJU },
] as const;

export const COMMUNITY_POSTS_TAKE = 10;
export const MAX_POST_IMAGE_COUNT = 5;
export const MAX_POST_IMAGE_SIZE_MB = 6;
export const MAX_POST_IMAGE_SIZE_BYTES =
  MAX_POST_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_POST_IMAGE_CAPTION_LENGTH = 500;
export const POST_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const POST_IMAGE_ACCEPT = POST_IMAGE_MIME_TYPES.join(",");
