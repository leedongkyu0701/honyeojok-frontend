import { SpotCategory } from "@/types/spots";

export const SPOT_CATEGORY_ITEMS: { key: SpotCategory; label: string }[] = [
  { key: SpotCategory.NATURE, label: "자연" },
    { key: SpotCategory.ACTIVITY, label: "액티비티" },
  { key: SpotCategory.FOOD, label: "맛집" },
  { key: SpotCategory.CAFE, label: "카페" },
  { key: SpotCategory.DRINK, label: "술/바" },
  { key: SpotCategory.ETC, label: "기타" },
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
