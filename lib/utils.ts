import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// clsx의 역할 : 여러 className 문자열을 조건부로 결합
// tailwind-merge의 역할 : Tailwind CSS 클래스 이름 충돌 해결