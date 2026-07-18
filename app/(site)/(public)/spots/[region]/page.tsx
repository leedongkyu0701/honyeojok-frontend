import SpotView from "@/features/spot/components/SpotView";
import { fetchDestinationDetail } from "@/features/destination/api/destination.api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/shared/api/apiError";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  try {
    const destination = await fetchDestinationDetail(region);
    const title = `${destination.name} 여행 장소 모음`;
    const description = `혼여족을 위한 ${destination.name} 추천 여행 장소를 한눈에 확인하세요.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/spots/${destination.slug}`,
      },
      openGraph: {
        title,
        description,
        images: [destination.imageUrl ?? "/og.png"],
      },
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function SpotsPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  return <SpotView region={region} />;
}
