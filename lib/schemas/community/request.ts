import { z } from "zod";
import { postTypeSchema } from "./response";
import { provinceGroupSchema } from "../common/province";

export const findPostsParamsSchema = z.object({
  page: z.coerce.number().int().min(1).nullish(),
  take: z.coerce.number().int().min(1).max(10).nullish(),
  type: postTypeSchema.nullish(),
  q: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  province: provinceGroupSchema.nullish(),
});

export type FindPostsParams = z.input<typeof findPostsParamsSchema>;
