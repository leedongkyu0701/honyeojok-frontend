import Link from "next/link";
import Container from "@/shared/ui/Container";
import LinkButton from "@/shared/ui/LinkButton";
import BestDestination from "./BestDestination";
import { ArrowRight, Dice5, MapPinned } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-white py-10 sm:py-14 lg:py-16">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
        <div>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.2] tracking-tight text-balance break-keep text-neutral-900 md:text-5xl">
            혼자 떠날 다음 여행을 찾아보세요
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 break-keep text-neutral-600">
            국내 여행지와 스팟, 추천 루트부터 다른 여행자의 경험까지.
            혼여족에서 나에게 맞는 여행을 시작해보세요.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton href="/destinations" size="lg" className="min-h-12">
              <MapPinned className="h-4.5 w-4.5" aria-hidden />
              여행지 둘러보기
            </LinkButton>
            <LinkButton
              href="/destinations/random"
              variant="outline"
              size="lg"
              className="min-h-12"
            >
              <Dice5 className="h-4.5 w-4.5" aria-hidden />
              랜덤으로 추천받기
            </LinkButton>
          </div>

          <Link
            href="/community"
            className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
          >
            여행 경험 나누는 커뮤니티
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <BestDestination />
      </Container>
    </section>
  );
}
