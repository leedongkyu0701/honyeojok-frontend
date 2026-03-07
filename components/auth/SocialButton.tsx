"use client";

import Image from "next/image";
import {cn} from "@/lib/utils";

type Props = {
  href: string;
  iconSrc: string;
  iconAlt: string;
  brand: "kakao" | "google" | "naver";
};

const brandRing: Record<Props["brand"], string> = {
  kakao: "bg-[#FEE500]",
  google: "bg-white",
  naver: "bg-[#03C75A]",
};

export default function SocialButton({ href, iconSrc, iconAlt, brand }: Props) {
  return (
    <a
      href={href}
      aria-label={iconAlt}
      className={cn(
        "group grid h-12 w-12 place-items-center rounded-full",
        "border border-neutral-200 shadow-sm",
        "transition hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-neutral-900/10",
        brandRing[brand],
      )}
    >
      <span className="relative h-6 w-6">
        <Image
          src={iconSrc}
          alt={iconAlt}
          fill
          sizes="24px"
          className="object-contain"
        />
      </span>
    </a>
  );
}
