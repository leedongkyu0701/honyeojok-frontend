import DestinationsView from "@/features/destination/components/DestinationsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "여행지",
  description: "혼자 떠나기 좋은 국내 여행지를 지역별로 찾아보세요.",
  alternates: {
    canonical: "/destinations",
  },
};

export default function DestinationsPage() {
  return (
    <DestinationsView />
  );
}
