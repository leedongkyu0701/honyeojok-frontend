"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import Container from "@/components/common/Container";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isCommunity =
    pathname === "/community" || pathname.startsWith("/community");

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="HonYeo"
            width={50}
            height={50}
            priority
          />
          <span className="sr-only">혼자여행</span>
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          {/* Community */}
          <Link
            href="/community"
            aria-label="커뮤니티"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition",
              isCommunity
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            <MessageCircle className="h-4.5 w-4.5" />
          </Link>

          {/* Auth / MyPage */}
          <Link
            href={isAuthenticated ? "/auth" : "/auth/login"}
            aria-label={isAuthenticated ? "마이페이지" : "로그인"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <User className="h-4.5 w-4.5" />
          </Link>
        </div>
      </Container>
    </nav>
  );
}
