import DestinationsView from "@/components/destination/DestinationsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "여행지 | Honyeo",
  description: "혼자 여행하는 사람들을 위한 추천 여행지",
};

export default function DestinationsPage() {
  return (
    <DestinationsView />
  );
}
