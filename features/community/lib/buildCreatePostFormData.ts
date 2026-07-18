import type { PostImageDraft } from "@/features/community/hooks/usePostImages";
import type { WritePostFormValues } from "@/features/community/schemas/post-form.schema";

export function buildCreatePostFormData(
  values: WritePostFormValues,
  images: PostImageDraft[],
): FormData {
  const formData = new FormData();

  formData.append("title", values.title.trim());
  formData.append("content", values.content.trim());
  formData.append("type", values.type);

  if (values.type === "REVIEW") {
    if (!values.skipRegion) {
      formData.append("regionSlug", values.regionSlug);
    }
    formData.append("rating", String(values.rating));
  }

  images.forEach((image) => {
    formData.append("captions", image.caption.trim());
  });
  images.forEach((image) => {
    formData.append("image", image.file);
  });

  return formData;
}
