"use client";

import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPost } from "@/features/community/api/post.api";
import { createUploadSessions } from "@/features/community/api/upload.api";
import { MAX_POST_IMAGE_COUNT, MAX_POST_IMAGE_SIZE_MB } from "@/features/community/constants/community.constants";
import {
  usePostImages,
  type PostImageDraft,
} from "@/features/community/hooks/usePostImages";
import { buildCreatePostPayload } from "@/features/community/lib/buildCreatePostPayload";
import {
  getPostImageUploadErrorMessage,
  PostImageUploadError,
  uploadFilesToPresignedUrls,
  waitForUploadsReady,
} from "@/features/community/lib/post-image-upload";
import { communityKeys } from "@/features/community/queries/community.keys";
import {
  writePostSchema,
  type WritePostFormValues,
} from "@/features/community/schemas/post-form.schema";
import { ApiError } from "@/shared/api/apiError";
import { ErrorCode } from "@/shared/types/error-code";
import Button from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/ui/Card";
import Container from "@/shared/ui/Container";
import ImageUploader from "./ImageUploader";
import PostBasicFields from "./PostBasicFields";
import ReviewFields from "./ReviewFields";

type SubmissionPhase =
  | "idle"
  | "preparing"
  | "uploading"
  | "processing"
  | "creating";

type CreatePostMutationInput = {
  values: WritePostFormValues;
  images: PostImageDraft[];
};

const submissionPhaseLabels: Record<SubmissionPhase, string> = {
  idle: "작성",
  preparing: "업로드 준비 중...",
  uploading: "이미지 업로드 중...",
  processing: "이미지 처리 중...",
  creating: "게시글 저장 중...",
};

export default function WritePost() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const imageDrafts = usePostImages();
  const form = useForm<WritePostFormValues>({
    resolver: zodResolver(writePostSchema),
    defaultValues: {
      type: "FREE",
      title: "",
      content: "",
      regionSlug: "",
      rating: 0,
      skipRegion: false,
    },
  });
  const type = useWatch({ control: form.control, name: "type" });
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionPhase, setSubmissionPhase] =
    useState<SubmissionPhase>("idle");

  const createPostMutation = useMutation({
    mutationFn: async ({ values, images }: CreatePostMutationInput) => {
      if (images.length === 0) {
        setSubmissionPhase("creating");
        return createPost(buildCreatePostPayload(values));
      }

      setSubmissionPhase("preparing");
      const { uploads: sessions } = await createUploadSessions(
        images.map((image) => image.file),
      );

      setSubmissionPhase("uploading");
      await uploadFilesToPresignedUrls(images, sessions);

      const uploadIds = sessions.map((session) => session.uploadId);
      setSubmissionPhase("processing");
      await waitForUploadsReady(uploadIds);

      setSubmissionPhase("creating");
      return createPost(buildCreatePostPayload(values, images, uploadIds));
    },
    meta: { silent: true },
    onSuccess: (post) => {
      void queryClient.invalidateQueries({
        queryKey: communityKeys.postLists(),
      });
      router.push(`/community/${post.id}`);
    },
    onError: (error) => {
      if (error instanceof PostImageUploadError) {
        setSubmissionError(getPostImageUploadErrorMessage(error));
        return;
      }

      if (!(error instanceof ApiError)) {
        setSubmissionError("알 수 없는 오류로 글 작성에 실패했어요.");
        return;
      }

      if (error.code === ErrorCode.VALIDATION_FAILED) {
        setSubmissionError("입력한 내용을 다시 확인해주세요.");
        return;
      }
      if (error.code === ErrorCode.FILE_TOO_LARGE) {
        setSubmissionError(
          `이미지 하나당 최대 용량은 ${MAX_POST_IMAGE_SIZE_MB}MB입니다.`,
        );
        return;
      }
      if (error.code === ErrorCode.FILE_TOO_MANY) {
        setSubmissionError(
          `최대 ${MAX_POST_IMAGE_COUNT}개의 이미지만 업로드 가능합니다.`,
        );
        return;
      }
      if (error.code === ErrorCode.FILE_INVALID_TYPE) {
        setSubmissionError("지원하지 않는 이미지 형식입니다.");
        return;
      }
      if (error.code === ErrorCode.UPLOAD_NOT_FOUND) {
        setSubmissionError(
          "업로드 정보가 만료되었거나 존재하지 않습니다. 다시 시도해주세요.",
        );
        return;
      }
      if (error.code === ErrorCode.UPLOAD_NOT_READY) {
        setSubmissionError(
          "이미지 처리가 아직 완료되지 않았습니다. 다시 시도해주세요.",
        );
        return;
      }
      if (error.code === ErrorCode.UPLOAD_PROCESSING_FAILED) {
        setSubmissionError("이미지 처리에 실패했습니다.");
        return;
      }
      if (error.code === ErrorCode.UPLOAD_ALREADY_ATTACHED) {
        setSubmissionError("이미 사용된 이미지입니다. 다시 업로드해주세요.");
        return;
      }
      setSubmissionError("글 작성에 실패했어요.");
    },
    onSettled: () => setSubmissionPhase("idle"),
  });

  const onSubmit = (values: WritePostFormValues) => {
    if (createPostMutation.isPending) return;

    setSubmissionError(null);
    imageDrafts.clearError();
    createPostMutation.mutate({
      values: { ...values },
      images: imageDrafts.images.map((image) => ({ ...image })),
    });
  };

  const isSubmitting = createPostMutation.isPending;

  const errorMessages = [imageDrafts.errorMessage, submissionError].filter(
    (message): message is string => message !== null,
  );

  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-900">새 글 작성</h1>
            <p className="text-sm text-neutral-500">
              여행 경험과 질문을 자유롭게 공유해보세요.
            </p>
          </div>

          {errorMessages.length > 0 ? (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm font-semibold text-red-700">작성에 실패했어요</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errorMessages.map((message) => (
                  <li key={message} className="text-sm text-red-700">
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <fieldset
                disabled={isSubmitting}
                className="space-y-5 border-0 p-0"
              >
                <PostBasicFields>
                  <ImageUploader
                    images={imageDrafts.images}
                    onAddImages={imageDrafts.addImages}
                    onRemoveImage={imageDrafts.removeImage}
                    onUpdateCaption={imageDrafts.updateCaption}
                    disabled={isSubmitting}
                  />
                </PostBasicFields>
                {type === "REVIEW" ? <ReviewFields /> : null}
              </fieldset>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-3"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {submissionPhaseLabels[submissionPhase]}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </Container>
  );
}
