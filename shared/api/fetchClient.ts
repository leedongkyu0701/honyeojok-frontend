import { useAuthStore } from "@/features/auth/store/auth.store";
import { parseApiError } from "./parseApiError";
import { ApiError } from "./apiError";
import { ErrorCode } from "@/shared/types/error-code";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";

let refreshPromise: Promise<string> | null = null;

async function runRefresh(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }
  refreshPromise = (async () => {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    await parseApiError(res);
    const data = await res.json();
    if (!data?.accessToken) {
      throw new ApiError(500, "No access token in refresh response");
    }
    return data.accessToken as string;
  })();

  try {
    const newToken = await refreshPromise;
    return newToken;
  } finally {
    refreshPromise = null;
  }
}

export type FetchClientOptions = RequestInit & {
  skipAuth?: boolean;
  withCredentials?: boolean;
};

export async function fetchClient(
  endpoint: string,
  options: FetchClientOptions = { withCredentials: true },
): Promise<Response> {
  const { accessToken, logout, setAccessToken } = useAuthStore.getState(); // 구독하지 않고 현재 상태만 가져오기
  const withCredentials = options.withCredentials ?? true;

  const isFormData = options.body instanceof FormData;

  const doFetch = (token?: string | null) => {
    const headers = new Headers(options.headers || {});
    if (isFormData) {
      headers.delete("Content-Type");
      headers.delete("content-type");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: withCredentials ? "include" : "omit",
    });
  };

  const res = await doFetch(options.skipAuth ? undefined : accessToken);

  if (res.status !== 401 || options.skipAuth) return res; // 401이 아닐때랑 skipAuth 옵션이 켜졌을 때는 토큰 재발급 시도하지 않고 바로 반환

  let shouldRefresh = true;
  try {
    const body = await res.clone().json();
    const code = body?.code;
    if (
      code === ErrorCode.AUTH_UNAUTHORIZED ||
      code === ErrorCode.AUTH_FORBIDDEN
    ) {
      shouldRefresh = false;
    }
  } catch {
    // ignore
  }

  if (!shouldRefresh) {
    logout();
    return res;
  }

  try {
    const newToken = await runRefresh();
    setAccessToken(newToken);
    return await doFetch(newToken);
  } catch (e) {
    logout();
    throw e;
  }
}
