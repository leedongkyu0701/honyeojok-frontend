import BestDestinationSection from "@/components/Home/BestDestinationSection";
import BestRouteSection from "@/components/Home/BestRouteSection";
import HeroSection from "@/components/Home/HeroSection";
import BestReviewSection from "@/components/Home/BestReviewSection";
import BestSpotSection from "@/components/Home/BestSpotSection";

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
