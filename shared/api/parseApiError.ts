import { ApiError, type ApiErrorBody } from "./apiError";
import { ErrorCode } from "@/shared/types/error-code";

function isErrorCode(value: unknown): value is ErrorCode {
  return Object.values(ErrorCode).some((code) => code === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!isRecord(value)) return false;
  if (
    value.ok !== false ||
    !isErrorCode(value.code) ||
    typeof value.message !== "string"
  ) {
    return false;
  }

  return (
    !("requestId" in value) ||
    value.requestId === undefined ||
    typeof value.requestId === "string"
  );
}

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

  if (isApiErrorBody(body)) {
    const apiErrorBody = body;
    throw new ApiError(
      response.status,
      apiErrorBody.message,
      apiErrorBody.code,
      apiErrorBody.details,
      apiErrorBody.requestId,
    );
  }

  throw new ApiError(response.status, response.statusText || "Request failed");
}
