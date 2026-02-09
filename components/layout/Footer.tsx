import Link from "next/link";
import Container from "@/components/common/Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <Container className="py-10">
        {/* Top */}
        <div className="space-y-2 text-sm text-neutral-500">
          <p className="text-base font-semibold text-neutral-900">HonYeo</p>
          <p>혼자 떠나는 여행을 더 편하게.</p>
        </div>

        {/* Bottom */}
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
            © {new Date().getFullYear()} HonYeo. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
