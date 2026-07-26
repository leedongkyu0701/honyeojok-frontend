import { z } from "zod";

export const commentUserSchema = z.object({
  id: z.number(),
  nickName: z.string(),
});

type CommentNode = {
  id: number;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  postId: number;
  userId: number;
  parentId: number | null;
  user: {
    id: number;
    nickName: string;
  };
  children: CommentNode[];
};

export const commentSchema: z.ZodType<CommentNode> = z.lazy(() =>
  z.object({
    id: z.number(),
    content: z.string(),
    isDeleted: z.boolean(),
    createdAt: z.string(),
    postId: z.number(),
    userId: z.number(),
    parentId: z.number().nullable(),
    user: commentUserSchema,
    children: z.array(commentSchema),
  }),
);

export const commentsSchema = z.array(commentSchema);
export const createCommentBodySchema = z.object({
  content: z.string().trim().min(1),
  parentId: z.number().nullable().optional(),
});

export type CommentUserResponse = z.infer<typeof commentUserSchema>;
export type CommentResponse = z.infer<typeof commentSchema>;
export type CreateCommentBody = z.input<typeof createCommentBodySchema>;
