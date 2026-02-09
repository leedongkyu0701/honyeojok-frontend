import Image from "next/image";
import type { DestinationDetailVM } from "@/types/destinations";

export default function RegionHero({ data }: { data: DestinationDetailVM }) {
  return (
    <section className="relative h-[60vh]">
      <Image
        src={`${data.imageUrl}`}
        alt={data.name}
        layout="fill"
        objectFit="cover"
        className="brightness-75"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 max-w-5xl mx-auto h-full flex flex-col justify-end p-8 text-white">
        <h1 className="text-4xl font-bold">{data.name}</h1>
        <p className="mt-2 text-lg opacity-90">{data.summary}</p>
      </div>
    </section>
  );
}
