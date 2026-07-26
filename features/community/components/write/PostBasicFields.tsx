"use client";

import { useWatch, useFormContext } from "react-hook-form";
import type { ReactNode } from "react";
import { COMMUNITY_CATEGORY_OPTIONS } from "@/features/community/constants/community.constants";
import { postTypeSchema } from "@/features/community/schemas/post.schema";
import type { WritePostFormValues } from "@/features/community/schemas/post-form.schema";

export default function PostBasicFields({ children }: { children: ReactNode }) {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<WritePostFormValues>();
  const type = useWatch({ control, name: "type" });
  const content = useWatch({ control, name: "content" });

  const handleTypeChange = (value: string) => {
    const result = postTypeSchema.safeParse(value);
    if (!result.success) return;

    setValue("type", result.data, { shouldDirty: true, shouldValidate: true });
    if (result.data !== "REVIEW") {
      setValue("regionSlug", "");
      setValue("rating", 0);
      setValue("skipRegion", false);
      clearErrors(["regionSlug", "rating"]);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor="post-type"
          className="block text-sm font-semibold text-neutral-900"
        >
          게시판
        </label>
        <select
          id="post-type"
          {...register("type")}
          onChange={(event) => handleTypeChange(event.target.value)}
          className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
        >
          {COMMUNITY_CATEGORY_OPTIONS.filter((option) => option.value !== "ALL").map(
            (option) => (
              <option key={option.value} value={option.value}>
                {option.value === "FREE" ? "일반 게시글" : option.label}
              </option>
            ),
          )}
        </select>
        <p className="text-xs text-neutral-500">
          {type === "REVIEW"
            ? "리뷰는 지역 선택/평점 입력이 필요해요."
            : "일반/질문은 자유롭게 작성할 수 있어요."}
        </p>
      </div>

      {children}

      <div className="space-y-2">
        <label
          htmlFor="post-title"
          className="block text-sm font-semibold text-neutral-900"
        >
          제목
        </label>
        <input
          id="post-title"
          type="text"
          {...register("title")}
          placeholder="제목을 입력하세요"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "post-title-error" : undefined}
          className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
        />
        {errors.title ? (
          <p id="post-title-error" className="text-xs text-red-600">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="post-content"
          className="block text-sm font-semibold text-neutral-900"
        >
          내용
        </label>
        <textarea
          id="post-content"
          {...register("content")}
          placeholder="내용을 입력하세요"
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? "post-content-error" : undefined}
          className="h-44 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
        />
        {errors.content ? (
          <p id="post-content-error" className="text-xs text-red-600">
            {errors.content.message}
          </p>
        ) : null}
        <div className="flex justify-between text-xs text-neutral-500">
          <span>{content.length}자</span>
        </div>
      </div>
    </>
  );
}
