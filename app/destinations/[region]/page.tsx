import RegionDetail from "@/components/region/RegionDetail";
import { fetchDestinationDetail } from "@/lib/api/destination/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/apiError";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;

  try {
  const destination = await fetchDestinationDetail(region);

  return {
    title: `${destination.name} 여행 정보`,
    description:
      destination.description ??
      `혼여족을 위한 ${destination.name} 여행 지역 정보와 추천 여행 루트`,
    alternates: {
      canonical: `/destinations/${region}`,
    },
    openGraph: {
      title: `${destination.name} 여행 정보`,
      description:
        destination.description ??
        `혼여족을 위한 ${destination.name} 여행 지역 정보와 추천 여행 루트`,
      images: [
        {
          url: destination.imageUrl ?? "/og.png",
          alt: `${destination.name} 여행 정보`,
        },
      ],
    },
  };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  return <RegionDetail region={region} />;
}
