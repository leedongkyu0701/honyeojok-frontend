import SpotDetailPage from "@/features/spot/components/SpotDetail";
import { fetchSpotDetail } from "@/features/spot/api/spot.api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/shared/api/apiError";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const spotId = Number(id);
    if (!Number.isFinite(spotId) || spotId <= 0) {
      notFound();
    }
    const spot = await fetchSpotDetail(Number(id));

    const title = `${spot.name} 여행 장소 정보`;
    const description = spot.summary;

    return {
      title,
      description,
      alternates: {
        canonical: `/spots/${spot.destination.slug}/${id}`,
      },
      openGraph: {
        title: title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/spots/${spot.destination.slug}/${id}`,
        images: [
          {
            url: spot.imageUrl || "/og.png",
            alt: spot.name,
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SpotDetailPage id={id} />;
}
