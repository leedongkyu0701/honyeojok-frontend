import { ApiError, type ApiErrorBody } from "./apiError";

export async function parseApiError(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  let body: unknown = null;
  try {
    body = await response.clone().json();
  } catch {
    // ignore
  }

  if (
    body &&
    typeof body === "object" &&
    "ok" in body &&
    body.ok === false
  ) {
    const apiErrorBody = body as ApiErrorBody;
    throw new ApiError(
      response.status,
      apiErrorBody.message,
      apiErrorBody.code,
      apiErrorBody.details,
      apiErrorBody.requestId,
    );
  } else {
    throw new ApiError(response.status, response.statusText || "Request failed"); // body가 ApiErrorBody 형태가 아니면 statusText를 메시지로 사용
  }
}
