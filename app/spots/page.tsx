import HotSpotView from "@/components/spot/HotSpotView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "추천 스팟",
  description: "혼여족을 위한 추천 여행지",
};

export default function DestinationsPage() {
  return (
    <HotSpotView />
  );
}
