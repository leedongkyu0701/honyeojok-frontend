import Link from "next/link";
import Container from "@/shared/ui/Container";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-200 bg-white">
      <Container className="py-10">
        <div className=" text-sm text-neutral-500">
          <p className=" text-base font-semibold text-neutral-900">HonYeoJok</p>
          <p className="mb-2">혼자 떠나는 여행을 위한 정보 커뮤니티.</p>
          <p>
            문의:{" "}
            <a
              href="mailto:honyeo259@gmail.com"
              className="underline hover:text-neutral-900"
            >
              honyeo259@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/auth/terms" className="hover:text-neutral-900">
              이용약관
            </Link>
            <Link href="/auth/privacy" className="hover:text-neutral-900">
              개인정보처리방침
            </Link>
          </div>

          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} HonYeoJok. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
