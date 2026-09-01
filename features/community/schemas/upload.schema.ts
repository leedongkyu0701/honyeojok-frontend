import { z } from "zod";
import {
  MAX_POST_IMAGE_COUNT,
  MAX_POST_IMAGE_SIZE_BYTES,
  POST_IMAGE_MIME_TYPES,
} from "@/features/community/constants/community.constants";

export const uploadIdSchema = z.string().uuid();

export const createUploadSessionFileSchema = z.object({
  contentType: z.enum(POST_IMAGE_MIME_TYPES),
  size: z.number().int().min(1).max(MAX_POST_IMAGE_SIZE_BYTES),
});

export const createUploadSessionsRequestSchema = z.object({
  files: z
    .array(createUploadSessionFileSchema)
    .min(1)
    .max(MAX_POST_IMAGE_COUNT),
});

export const uploadSessionSchema = z.object({
  uploadId: uploadIdSchema,
  uploadUrl: z.string().url(),
  contentType: z.string(),
  expiresAt: z.string(),
});

export const createUploadSessionsResponseSchema = z.object({
  uploads: z.array(uploadSessionSchema),
});

export const uploadStatusSchema = z.object({
  uploadId: uploadIdSchema,
  status: z.enum(["PENDING", "PROCESSING", "READY", "FAILED", "ATTACHED"]),
  failureCode: z.string().nullable(),
});

export const uploadStatusesResponseSchema = z.object({
  uploads: z.array(uploadStatusSchema),
});

export type CreateUploadSessionFile = z.infer<
  typeof createUploadSessionFileSchema
>;
export type UploadSession = z.infer<typeof uploadSessionSchema>;
export type UploadStatus = z.infer<typeof uploadStatusSchema>;
