import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// clsx: 여러 className 문자열을 조건부로 결합
// tailwind-merge: Tailwind CSS 클래스 이름 충돌 해결