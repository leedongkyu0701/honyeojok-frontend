import RandomTrip from "@/components/Map/RandomTrip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "랜덤 여행지",
  description: "혼여족을 위한 랜덤 여행지 뽑기 서비스",
};

export default function RandomPage() {
  return <RandomTrip />;
}