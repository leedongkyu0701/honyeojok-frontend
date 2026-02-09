import SpotView from "@/components/spot/SpotView";

export default async function SpotsPage({params}:{params: Promise<{region: string}>}) {
    const {region} = await params;
  return (
    <SpotView region={region} />
  );
}