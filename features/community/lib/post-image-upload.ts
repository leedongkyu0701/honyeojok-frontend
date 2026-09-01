import { fetchUploadStatuses } from "@/features/community/api/upload.api";
import type { PostImageDraft } from "@/features/community/hooks/usePostImages";
import type { UploadSession } from "@/features/community/schemas/upload.schema";

const UPLOAD_STATUS_POLL_INTERVAL_MS = 1_000;
const UPLOAD_STATUS_TIMEOUT_MS = 90_000;

type PostImageUploadErrorKind =
  | "DIRECT_UPLOAD_FAILED"
  | "PROCESSING_FAILED"
  | "PROCESSING_TIMEOUT"
  | "UNEXPECTED_UPLOAD_STATUS";

export class PostImageUploadError extends Error {
  constructor(
    public readonly kind: PostImageUploadErrorKind,
    public readonly failureCode: string | null = null,
  ) {
    super(kind);
    this.name = "PostImageUploadError";
  }
}

const processingFailureMessages: Record<string, string> = {
  FILE_TOO_LARGE: "이미지 하나당 최대 용량은 6MB입니다.",
  INVALID_IMAGE: "유효한 이미지 파일인지 확인해주세요.",
  PIXEL_LIMIT_EXCEEDED: "이미지 해상도가 너무 큽니다. 더 작은 이미지를 선택해주세요.",
  ORIGINAL_NOT_FOUND: "이미지 원본을 찾을 수 없습니다. 다시 업로드해주세요.",
};

export function getPostImageUploadErrorMessage(error: PostImageUploadError) {
  if (error.kind === "DIRECT_UPLOAD_FAILED") {
    return "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
  }
  if (error.kind === "PROCESSING_TIMEOUT") {
    return "이미지 처리 시간이 초과되었습니다. 다시 시도해주세요.";
  }
  if (error.kind === "UNEXPECTED_UPLOAD_STATUS") {
    return "이미지 처리 상태를 확인할 수 없습니다. 다시 시도해주세요.";
  }

  return (
    (error.failureCode !== null
      ? processingFailureMessages[error.failureCode]
      : undefined) ?? "이미지 처리에 실패했습니다. 다시 시도해주세요."
  );
}

export async function uploadFilesToPresignedUrls(
  images: readonly Pick<PostImageDraft, "file">[],
  sessions: readonly UploadSession[],
): Promise<void> {
  if (images.length !== sessions.length) {
    throw new PostImageUploadError("UNEXPECTED_UPLOAD_STATUS");
  }

  await Promise.all(
    images.map(async (image, index) => {
      const session = sessions[index];

      try {
        const response = await fetch(session.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": session.contentType },
          body: image.file,
          credentials: "omit",
        });

        if (!response.ok) {
          throw new PostImageUploadError("DIRECT_UPLOAD_FAILED");
        }
      } catch (error) {
        if (error instanceof PostImageUploadError) {
          throw error;
        }
        throw new PostImageUploadError("DIRECT_UPLOAD_FAILED");
      }
    }),
  );
}

export async function waitForUploadsReady(
  uploadIds: readonly string[],
): Promise<void> {
  const deadline = Date.now() + UPLOAD_STATUS_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const { uploads } = await fetchUploadStatuses(uploadIds);
    const hasUnexpectedOrder =
      uploads.length !== uploadIds.length ||
      uploads.some((upload, index) => upload.uploadId !== uploadIds[index]);

    if (hasUnexpectedOrder || uploads.some((upload) => upload.status === "ATTACHED")) {
      throw new PostImageUploadError("UNEXPECTED_UPLOAD_STATUS");
    }

    const failedUpload = uploads.find((upload) => upload.status === "FAILED");
    if (failedUpload) {
      throw new PostImageUploadError(
        "PROCESSING_FAILED",
        failedUpload.failureCode,
      );
    }

    if (uploads.every((upload) => upload.status === "READY")) {
      return;
    }

    const remainingTime = deadline - Date.now();
    if (remainingTime <= 0) break;
    await delay(Math.min(UPLOAD_STATUS_POLL_INTERVAL_MS, remainingTime));
  }

  throw new PostImageUploadError("PROCESSING_TIMEOUT");
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
