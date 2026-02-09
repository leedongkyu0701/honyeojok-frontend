import TripRouteDetail from "@/components/trip-route/TripRouteDetail";


export default async function TripRouteDetailPage({ params }: { params: Promise<{ region: string; slug: string }> }) {
    const { region, slug } = await params;

  return (
    <TripRouteDetail region={region} slug={slug} />
  );
}
