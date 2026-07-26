"use client";

import type { PostDetailResponse } from "@/features/community/schemas/post.schema";
import Button from "@/shared/ui/Button";
import LikeButton from "./LikeButton";

type PostActionsProps = {
  post: PostDetailResponse;
  isDeleting: boolean;
  onDelete: () => void;
};

function DeleteButton({ isDeleting, onDelete }: Omit<PostActionsProps, "post">) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onDelete}
      className="px-2 py-1 text-xs text-neutral-500 hover:text-red-600"
      disabled={isDeleting}
    >
      삭제
    </Button>
  );
}

export default function PostActions({
  post,
  isDeleting,
  onDelete,
}: PostActionsProps) {
  return (
    <>
      <div className="ml-auto hidden items-center gap-1 md:flex">
        <DeleteButton isDeleting={isDeleting} onDelete={onDelete} />
        <LikeButton post={post} />
      </div>
      <div className="flex w-full justify-end gap-1 md:hidden">
        <DeleteButton isDeleting={isDeleting} onDelete={onDelete} />
        <LikeButton post={post} />
      </div>
    </>
  );
}
