import SpotDetailPage from '@/components/spot/SpotDetail';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  return <SpotDetailPage id={id} />;
}