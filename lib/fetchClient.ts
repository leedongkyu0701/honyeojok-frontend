import { useAuthStore } from "@/stores/auth.store";
import { parseApiError } from "./parseApiError";
import { ApiError } from "./apiError";
import { ErrorCode } from "@/types/error-code";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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
}

export async function fetchClient(
  endpoint: string,
  options: FetchClientOptions = {withCredentials: true},
): Promise<Response> {
  const { accessToken, logout, setAccessToken } = useAuthStore.getState();
  const withCredentials = options.withCredentials ?? true;

  const doFetch = (token?: string | null) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      credentials: withCredentials ? "include" : "omit",
    });


  const res = await doFetch(options.skipAuth ? undefined : accessToken);
  
  if (res.status !== 401 || options.skipAuth) return res;

  let shouldRefresh = true;
  try {
    const body = await res.clone().json();
    const code = body?.code;
    if (code === ErrorCode.AUTH_UNAUTHORIZED || code === ErrorCode.AUTH_FORBIDDEN) {
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
    // refresh 실패면 로그아웃
    logout();
    throw e;
  }
}
