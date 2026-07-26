import { useAuthStore } from "@/features/auth/store/auth.store";
import { parseApiError } from "./parseApiError";
import { ErrorCode } from "@/shared/types/error-code";
import { refreshAccessToken } from "./refreshAccessToken";
import { API_BASE_URL } from "./config";

export const publicRequestOptions = {
  skipAuth: true,
  withCredentials: false,
} as const;

export type FetchClientOptions = Omit<RequestInit, "credentials"> & {
  skipAuth?: boolean;
  withCredentials?: boolean;
};

async function shouldRefresh(response: Response): Promise<boolean> {
  try {
    await parseApiError(response.clone());
  } catch (error) {
    return (
      error instanceof Error &&
      "code" in error &&
      (error.code === ErrorCode.AUTH_TOKEN_EXPIRED ||
        error.code === ErrorCode.AUTH_INVALID_TOKEN)
    );
  }

  return false;
}

export async function fetchClient(
  endpoint: string,
  options: FetchClientOptions = {},
): Promise<Response> {
  const {
    skipAuth = false,
    withCredentials = true,
    headers: requestHeaders,
    ...requestOptions
  } = options;
  const { accessToken, logout, setAccessToken } = useAuthStore.getState();

  const isFormData = requestOptions.body instanceof FormData;

  const doFetch = (token?: string | null) => {
    const headers = new Headers(requestHeaders);
    if (isFormData) {
      headers.delete("Content-Type");
      headers.delete("content-type");
    }
    if (skipAuth || !token) {
      headers.delete("Authorization");
      headers.delete("authorization");
    } else {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestOptions,
      headers,
      credentials: withCredentials ? "include" : "omit",
    });
  };

  const res = await doFetch(skipAuth ? undefined : accessToken);

  if (res.status !== 401 || skipAuth) return res;

  if (!(await shouldRefresh(res))) {
    logout();
    return res;
  }

  try {
    const { accessToken: newAccessToken } = await refreshAccessToken();
    setAccessToken(newAccessToken);
    return doFetch(newAccessToken);
  } catch (error) {
    logout();
    throw error;
  }
}
