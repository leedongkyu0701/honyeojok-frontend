import DestinationsView from "@/components/destination/DestinationsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "여행지",
  description: "혼여족을 위한 추천 여행지",
};

export default function DestinationsPage() {
  return (
    <DestinationsView />
  );
}
