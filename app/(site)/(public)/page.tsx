import BestDestinationSection from "@/features/home/components/BestDestinationSection";
import BestRouteSection from "@/features/home/components/BestRouteSection";
import BestReviewSection from "@/features/home/components/BestReviewSection";
import HeroSection from "@/features/home/components/HeroSection";
import BestSpotSection from "@/features/home/components/BestSpotSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <BestDestinationSection />
      <BestSpotSection />
      <BestRouteSection />
      <BestReviewSection />
    </>
  );
}
