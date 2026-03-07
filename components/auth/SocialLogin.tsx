"use client";
import Link from "next/link";
import SocialButton from "./SocialButton";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const KAKAO_AUTH_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/kakao`;
const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
const NAVER_AUTH_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/naver`;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    if (error === "withdrawn_user") {
      toast.error("탈퇴한 계정이에요", {
        description: "재가입할 수 없어요. 다른 계정으로 로그인해주세요.",
      });
    } else if (error === "oauth_failed") {
      toast.error("소셜 로그인에 실패했어요", {
        description: "다시 시도해주세요.",
      });
    }
    router.replace("/auth/login");
  }, [router, searchParams]);

  return (
    <main className="min-h-[calc(100vh-60px)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-200/40 blur-3xl" />
          <div className="absolute -bottom-28 -right-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white" />
        </div>

        <div className="mx-auto flex max-w-md flex-col px-5 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs text-neutral-700 shadow-sm backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              혼자여행, 가볍게 시작하기
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">
              혼여족 로그인
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              아이디/비밀번호 없이도 OK. <br className="sm:hidden" />
              SNS로 3초 만에 시작해요.
            </p>
          </div>

          <section className="rounded-3xl border border-neutral-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-neutral-900">
                처음 오셨나요?
              </p>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                버튼을 누르면{" "}
                <span className="font-medium">자동으로 회원가입</span>
                이 진행돼요. <br />
                나중에 원하면 닉네임도 언제든 바꿀 수 있어요.
              </p>
            </div>

            <div className="mt-2">
              <p className="text-center text-xs font-medium text-neutral-700">
                SNS 계정으로 간편하게 로그인
              </p>

              <div className="mt-3 flex items-center justify-center gap-4">
                <SocialButton
                  href={NAVER_AUTH_URL}
                  brand="naver"
                  iconSrc="/login/naver-logo.png"
                  iconAlt="네이버로 로그인"
                />
                <SocialButton
                  href={KAKAO_AUTH_URL}
                  brand="kakao"
                  iconSrc="/login/kakao-logo.png"
                  iconAlt="카카오로 로그인"
                />
                <SocialButton
                  href={GOOGLE_AUTH_URL}
                  brand="google"
                  iconSrc="/login/google-logo.png"
                  iconAlt="구글로 로그인"
                />
              </div>

              <div className="mt-4 border-t border-neutral-200" />
            </div>

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-neutral-900/5 text-neutral-700">
                  🔒
                </div>
                <div className="text-xs text-neutral-600 leading-5">
                  <p className="font-medium text-neutral-800">
                    비밀번호는 저장하지 않아요
                  </p>
                  <p>
                    로그인은 소셜 제공자(카카오/구글/네이버)로만 처리되고,
                    우리는 필요한 최소 정보만 저장해요.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-neutral-500">
                <span>계속하면</span>
                <Link
                  href="/auth/terms"
                  className="underline underline-offset-4 hover:text-neutral-700"
                >
                  이용약관
                </Link>
                <span>및</span>
                <Link
                  href="/auth/privacy"
                  className="underline underline-offset-4 hover:text-neutral-700"
                >
                  개인정보처리방침
                </Link>
                <span>에 동의한 것으로 간주돼요.</span>
              </div>
            </div>
          </section>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white/70 p-4 text-xs text-neutral-600 shadow-sm backdrop-blur">
            <p className="font-medium text-neutral-800">
              로그인하면 뭐가 좋아?
            </p>
            <ul className="mt-2 space-y-1.5 leading-5">
              <li>• 여행 루트 북마크 저장</li>
              <li>• 후기/질문 글 작성 &amp; 댓글</li>
              <li>• 나만의 추천/랜덤 여행 기록</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
