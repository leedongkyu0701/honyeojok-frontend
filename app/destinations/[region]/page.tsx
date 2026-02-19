import RegionDetail from "@/components/region/RegionDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "지역별 추천 루트 | 혼여족",
  description: "혼여족을 위한 지역별 추천 루트",
};

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  return <RegionDetail region={region} />;
}
