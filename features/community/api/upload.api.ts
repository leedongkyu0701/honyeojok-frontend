import { fetchClient } from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";
import {
  createUploadSessionsRequestSchema,
  createUploadSessionsResponseSchema,
  uploadIdSchema,
  uploadStatusesResponseSchema,
} from "@/features/community/schemas/upload.schema";

type UploadFile = Pick<File, "size" | "type">;

export async function createUploadSessions(files: readonly UploadFile[]) {
  const body = createUploadSessionsRequestSchema.parse({
    files: files.map((file) => ({
      contentType: file.type,
      size: file.size,
    })),
  });
  const response = await fetchClient("/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  await parseApiError(response);
  return createUploadSessionsResponseSchema.parse(await response.json());
}

export async function fetchUploadStatuses(uploadIds: readonly string[]) {
  const parsedUploadIds = uploadIdSchema.array().min(1).max(5).parse(uploadIds);
  const query = new URLSearchParams({ ids: parsedUploadIds.join(",") });
  const response = await fetchClient(`/uploads/status?${query.toString()}`);

  await parseApiError(response);
  return uploadStatusesResponseSchema.parse(await response.json());
}
