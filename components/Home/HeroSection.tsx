import Link from "next/link";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import BestDestination from "./BestDestination";
import { Dice5, MapPinned, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className=" pl-[0.3em] text-sm uppercase tracking-[0.08em] text-neutral-500">
              혼자 어디론가 떠나고 싶을 때,
          </p>

          <h1 className="mb-8 text-4xl  font-semibold leading-tight text-neutral-900 md:text-5xl">
            혼여족
          </h1>
         

          <div className="flex flex-wrap gap-3">
            <Link href="/destinations/random">
              <Button size="lg" className="gap-2">
                <Dice5 className="h-4.5 w-4.5" />
                랜덤여행 시작
              </Button>
            </Link>

            <Link href="/destinations">
              <Button variant="outline" size="lg" className="gap-2">
                <MapPinned className="h-4.5 w-4.5" />
                추천 여행지 둘러보기
              </Button>
            </Link>

            <Link href="/community">
              <Button variant="outline" size="lg" className="gap-2">
                <MessageCircle className="h-4.5 w-4.5" />
                커뮤니티
              </Button>
            </Link>
          </div>
        </div>

        <BestDestination />
      </Container>
    </section>
  );
}
