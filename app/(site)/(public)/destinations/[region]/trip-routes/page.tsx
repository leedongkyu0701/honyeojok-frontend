import TripRouteView from "@/features/trip-route/components/TripRouteView";
import { fetchDestinationDetail } from "@/features/destination/api/destination.api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const destination = await fetchDestinationDetail(region);

  const title = `${destination.name} 여행 루트 모음`;
  const description =
    `혼여족을 위한 ${destination.name} 추천 여행 루트를 한눈에 확인하세요.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/destinations/${region}/trip-routes`,
    },
    openGraph: {
      title,
      description,
      images: [{
        url: destination.imageUrl ?? "/og.png",
        alt: `${destination.name} 여행 루트 모음`,
      }],
    },
  };
}

export default async function TripRouteListPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  return <TripRouteView region={region} />;
}