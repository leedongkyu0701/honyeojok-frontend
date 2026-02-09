export type Provider = "apple" | "kakao" | "google" | "naver";

export type ProfileVM = {
  id: number;
  email: string | null;
  provider: Provider;
  nickName: string;
  createdAt: string;
};
