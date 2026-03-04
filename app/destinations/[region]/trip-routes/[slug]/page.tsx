import TripRouteDetail from "@/components/trip-route/TripRouteDetail";
import { fetchTripRouteDetail } from "@/lib/api/trip-route/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/apiError";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; slug: string }>;
}): Promise<Metadata> {
  const { region, slug } = await params;
  try{
  const tripRoute = await fetchTripRouteDetail(region, slug);

  const title = `${tripRoute.title} 여행 루트 정보`;
  const description =
    `${tripRoute.summary}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/destinations/${region}/trip-routes/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: ["/og.png"],
    },
  };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}


export default async function TripRouteDetailPage({ params }: { params: Promise<{ region: string; slug: string }> }) {
    const { region, slug } = await params;

  return (
    <TripRouteDetail region={region} slug={slug} />
  );
}
