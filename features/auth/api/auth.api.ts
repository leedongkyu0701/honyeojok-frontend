import { fetchClient } from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";
import {
  refreshAccessToken,
  type RefreshTokenResponse,
} from "@/shared/api/refreshAccessToken";

export async function logout(): Promise<void> {
  const response = await fetchClient("/auth/logout", { method: "POST" });
  await parseApiError(response);
}

export function refreshToken(): Promise<RefreshTokenResponse> {
  return refreshAccessToken();
}

export async function withdraw(): Promise<void> {
  const response = await fetchClient("/auth/withdraw", { method: "POST" });
  await parseApiError(response);
}
