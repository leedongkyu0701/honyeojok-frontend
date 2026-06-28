import { SpotCategory } from "@/features/spot/types/spots";

export const SPOT_CATEGORY_ITEMS: Array<{
  label: string;
  value: SpotCategory | null;
}> = [
  { label: "전체", value: null },
  { label: "자연", value: SpotCategory.NATURE },
  { label: "액티비티", value: SpotCategory.ACTIVITY },
  { label: "맛집", value: SpotCategory.FOOD },
  { label: "카페", value: SpotCategory.CAFE },
  { label: "술/바", value: SpotCategory.DRINK },
  { label: "기타", value: SpotCategory.ETC },
];

export function isSpotCategory(value: string | null): value is SpotCategory {
  return (
    value === SpotCategory.NATURE ||
    value === SpotCategory.ACTIVITY ||
    value === SpotCategory.FOOD ||
    value === SpotCategory.CAFE ||
    value === SpotCategory.DRINK ||
    value === SpotCategory.ETC
  );
}
