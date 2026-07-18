import RandomTrip from "@/features/home/components/RandomTrip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "랜덤 여행지",
  description: "다음 혼자 여행을 위한 국내 여행지를 랜덤으로 찾아보세요.",
  alternates: {
    canonical: "/destinations/random",
  },
};

export default function RandomPage() {
  return <RandomTrip />;
}
