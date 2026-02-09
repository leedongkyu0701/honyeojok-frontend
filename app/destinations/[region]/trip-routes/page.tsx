import RegionTripRoute from "@/components/trip-route/RegionTripRoute";

export default async function TripRouteListPage({
  params,
}: {
  params: { region: string };
}) {
  const { region } = await params;

  return <RegionTripRoute region={region} />;
}
