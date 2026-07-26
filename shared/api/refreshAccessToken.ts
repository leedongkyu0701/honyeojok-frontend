import { ApiError } from "@/shared/api/apiError";
import { API_BASE_URL } from "@/shared/api/config";
import { parseApiError } from "@/shared/api/parseApiError";

export type RefreshTokenResponse = {
  accessToken: string;
};

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

function readAccessToken(data: unknown): RefreshTokenResponse {
  if (
    data !== null &&
    typeof data === "object" &&
    "accessToken" in data &&
    typeof data.accessToken === "string" &&
    data.accessToken.length > 0
  ) {
    return { accessToken: data.accessToken };
  }

  throw new ApiError(500, "Refresh response did not include an access token");
}

export function refreshAccessToken(): Promise<RefreshTokenResponse> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const request = (async () => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    await parseApiError(response);
    return readAccessToken(await response.json());
  })();

  refreshPromise = request;
  void request.then(
    () => {
      if (refreshPromise === request) refreshPromise = null;
    },
    () => {
      if (refreshPromise === request) refreshPromise = null;
    },
  );

  return request;
}
