"use client";
import type { DestinationDetailResponse } from "@/types/destinations";
import { useQuery } from "@tanstack/react-query";
import { fetchDestinationDetail } from "@/lib/api/destination/api";
import RegionHero from "./RegionHero";
import DifficultyBars from "@/components/region/DifficultyBars";
import RegionTabs from "@/components/region/RegionTabs";
import RegionRoutes from "@/components/region/RegionRoutes";
import RegionSpots from "./RegionSpots";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import RegionReviews from "@/components/region/RegionReviews";

export default function RegionDetailPage({ region }: { region: string }) {
  const {
    data: regionDetail,
    isLoading,
    isError,
  } = useQuery<DestinationDetailResponse>({
    queryKey: ["destinations", region],
    queryFn: () => fetchDestinationDetail(region),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 py-10">
        <Skeleton className="h-[50vh]" />
        <Container className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-48" />
        </Container>
      </div>
    );
  }

  if (isError || !regionDetail) {
    return (
      <Container className="py-10">
        <EmptyState
          title="여행지 정보를 불러오지 못했어요."
          description={"잠시 후 다시 시도해주세요."}
        />
      </Container>
    );
  }

  const creditText = regionDetail.imageCredit;

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-2">
        <RegionHero data={regionDetail} />

        {/* ✅ 이미지 하단 크레딧 */}
        {creditText ? (
          <Container>
            <p className="text-xs text-muted-foreground text-right">
              {creditText}
            </p>
          </Container>
        ) : null}
      </div>
      <DifficultyBars difficulty={regionDetail.difficulty} />
      <Container className="space-y-10">
        <RegionTabs
          tabs={[
            {
              label: "장소",
              value: "spots",
              content: <RegionSpots spots={regionDetail.spots} />,
            },
            {
              label: "루트",
              value: "routes",
              content: (
                <RegionRoutes
                  routes={regionDetail.routes}
                />
              ),
            },
            {
              label: "커뮤니티",
              value: "community",
              content: <RegionReviews regionSlug={region} />,
            },
          ]}
        />
      </Container>
    </div>
  );
}
