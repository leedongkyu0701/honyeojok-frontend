export type Provider = "apple" | "kakao" | "google" | "naver";

export type ProfileResponse = {
  id: number;
  email: string | null;
  provider: Provider;
  nickName: string;
  createdAt: string;
};
