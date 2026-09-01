import type { PostImageDraft } from "@/features/community/hooks/usePostImages";
import {
  createPostRequestSchema,
  type CreatePostRequest,
} from "@/features/community/schemas/post-request.schema";
import type { WritePostFormValues } from "@/features/community/schemas/post-form.schema";

export function buildCreatePostPayload(
  values: WritePostFormValues,
  images: readonly PostImageDraft[] = [],
  uploadIds: readonly string[] = [],
): CreatePostRequest {
  if (images.length !== uploadIds.length) {
    throw new Error("이미지와 업로드 정보의 개수가 일치하지 않습니다.");
  }

  const postImages = images.map((image, index) => {
    const caption = image.caption.trim();

    return {
      uploadId: uploadIds[index],
      ...(caption === "" ? {} : { caption }),
    };
  });

  return createPostRequestSchema.parse({
    title: values.title.trim(),
    content: values.content.trim(),
    type: values.type,
    ...(values.type === "REVIEW"
      ? {
          rating: values.rating,
          ...(values.skipRegion ? {} : { regionSlug: values.regionSlug.trim() }),
        }
      : {}),
    ...(postImages.length === 0 ? {} : { images: postImages }),
  });
}
