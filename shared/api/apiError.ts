import { ErrorCode } from "@/shared/types/error-code";

export type ApiErrorBody = {
  ok: false;
  code: ErrorCode;
  message: string;
  details?: unknown;
  requestId?: string;
  path?: string;
  timestamp?: string;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: ErrorCode,
    public details?: unknown,
    public requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
