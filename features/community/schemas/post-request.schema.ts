import { z } from "zod";
import { provinceGroupSchema } from "@/shared/schemas/province";
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
