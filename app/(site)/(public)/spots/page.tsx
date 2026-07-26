import HotSpotView from "@/features/spot/components/HotSpotView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "추천 스팟",
  description:
    "혼밥 식당, 카페, 산책 장소 등 혼자 방문하기 좋은 여행 스팟을 확인하세요.",
  alternates: {
    canonical: "/spots",
  },
};

export default function SpotsPage() {
  return (
    <HotSpotView />
  );
}
