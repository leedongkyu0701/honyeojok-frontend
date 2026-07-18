import { z } from "zod";
import { postTypeSchema } from "./post.schema";

export const writePostSchema = z
  .object({
    type: postTypeSchema,
    title: z
      .string()
      .trim()
      .min(1, { error: "제목을 입력해주세요." })
      .max(50, { error: "제목은 50자 이하로 입력해주세요." }),
    content: z
      .string()
      .trim()
      .min(1, { error: "내용을 입력해주세요." })
      .max(5000, { error: "내용은 5000자 이하로 입력해주세요." }),
    regionSlug: z.string().trim(),
    rating: z.number().min(0).max(5),
    skipRegion: z.boolean(),
  })
  .superRefine((data, context) => {
    if (data.type !== "REVIEW") return;

    if (!data.skipRegion && data.regionSlug === "") {
      context.addIssue({
        code: "custom",
        path: ["regionSlug"],
        message: "리뷰 게시글은 지역 선택이 필요해요.",
      });
    }

    if (data.rating < 1) {
      context.addIssue({
        code: "custom",
        path: ["rating"],
        message: "별점은 1점 이상 선택해주세요.",
      });
    }
  });

export type WritePostFormValues = z.infer<typeof writePostSchema>;
