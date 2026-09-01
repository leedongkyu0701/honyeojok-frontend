import { z } from "zod";
import { provinceGroupSchema } from "@/shared/schemas/province";
import { MAX_POST_IMAGE_CAPTION_LENGTH } from "@/features/community/constants/community.constants";
import { postTypeSchema } from "./post.schema";

export const findPostsParamsSchema = z.object({
  page: z.coerce.number().int().min(1).nullish(),
  take: z.coerce.number().int().min(1).max(10).nullish(),
  type: postTypeSchema.nullish(),
  q: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  province: provinceGroupSchema.nullish(),
});

export type FindPostsParamsInput = z.input<typeof findPostsParamsSchema>;
export type FindPostsParams = z.output<typeof findPostsParamsSchema>;

export const createPostImageSchema = z.object({
  uploadId: z.string().uuid(),
  caption: z.string().trim().max(MAX_POST_IMAGE_CAPTION_LENGTH).optional(),
});

export const createPostRequestSchema = z
  .object({
    title: z.string().trim().min(1).max(50),
    content: z.string().trim().min(1).max(5000),
    type: postTypeSchema,
    regionSlug: z.string().trim().min(1).optional(),
    rating: z.number().int().min(1).max(5).optional(),
    images: z.array(createPostImageSchema).max(5).optional(),
  })
  .superRefine((data, context) => {
    if (data.type === "REVIEW" && data.rating === undefined) {
      context.addIssue({
        code: "custom",
        path: ["rating"],
        message: "리뷰 게시글에는 평점이 필요합니다.",
      });
    }

    if (data.type !== "REVIEW") {
      if (data.regionSlug !== undefined) {
        context.addIssue({
          code: "custom",
          path: ["regionSlug"],
          message: "리뷰 게시글에만 지역을 설정할 수 있습니다.",
        });
      }
      if (data.rating !== undefined) {
        context.addIssue({
          code: "custom",
          path: ["rating"],
          message: "리뷰 게시글에만 평점을 설정할 수 있습니다.",
        });
      }
    }

    const uploadIds = data.images?.map((image) => image.uploadId) ?? [];
    if (new Set(uploadIds).size !== uploadIds.length) {
      context.addIssue({
        code: "custom",
        path: ["images"],
        message: "이미지는 중복해서 첨부할 수 없습니다.",
      });
    }
  });

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
