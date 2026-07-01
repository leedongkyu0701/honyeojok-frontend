import type { TagOption } from "@/shared/types/tag";

export const TAGS = [
  { slug: "healing", label: "힐링" },
  { slug: "nature", label: "자연" },
  { slug: "culture", label: "문화/역사" },
  { slug: "activity", label: "액티비티" },
  { slug: "solo-drinking", label: "혼술" },
  { slug: "emotional", label: "감성" },
  { slug: "shopping", label: "쇼핑" },
  { slug: "nightview", label: "야경" },
  { slug: "sea", label: "바다" },
  { slug: "mountain", label: "산" },
  { slug: "stress-relief", label: "리프레시" },
  { slug: "oneday", label: "당일치기" },
] as const satisfies readonly TagOption[];

export type TagSlug = (typeof TAGS)[number]["slug"];
// TAGS 배열 안에 들어있는 모든 객체의 slug 값만 모아서 union 타입으로 정의