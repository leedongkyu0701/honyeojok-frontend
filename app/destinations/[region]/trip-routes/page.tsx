import TripRouteView from "@/components/trip-route/TripRouteView";

export default async function TripRouteListPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;

  return <TripRouteView region={region} />;
}
