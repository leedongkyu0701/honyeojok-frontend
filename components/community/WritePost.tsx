"use client";

import { useEffect, useRef, useState } from "react";
import type { CategoryType } from "@/types/community";
import { createPost } from "@/lib/api/community/api";
import { useRouter } from "next/navigation";

import Container from "@/components/common/Container";
import { Card, CardContent } from "@/components/common/Card";
import Button from "@/components/common/Button";

import { searchDestinations } from "@/lib/api/destination/api";
import { useMutation, useQuery } from "@tanstack/react-query";

import ImageUploader, {
  type FileWithPreview,
} from "@/components/community/ImageUploader";

import StarRating from "../common/StarRating";
import { ApiError } from "@/lib/apiError";
import { ErrorCode } from "@/types/error-code";

import { useForm, Controller, useWatch } from "react-hook-form";

const MAX_SIZE_MB = 6;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type WritePostFormValues = {
  type: CategoryType;
  title: string;
  content: string;
  regionSlug: string;
  rating: number;
  skipRegion: boolean;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}

export default function WritePost() {
  const router = useRouter();

  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [regionQuery, setRegionQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const imagesRef = useRef<FileWithPreview[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<WritePostFormValues>({
    defaultValues: {
      type: "FREE",
      title: "",
      content: "",
      regionSlug: "",
      rating: 0,
      skipRegion: false,
    },
  });

  const type = useWatch({ control, name: "type" });
  const content = useWatch({ control, name: "content" });
  const regionSlug = useWatch({ control, name: "regionSlug" });
  const skipRegion = useWatch({ control, name: "skipRegion" });

  const debouncedRegionQuery = useDebounce(regionQuery, 400);
  const maxImages = 5;

  const { data: regionSuggestions, isLoading: isRegionLoading } = useQuery({
    queryKey: ["search-destinations", debouncedRegionQuery],
    queryFn: () => searchDestinations(debouncedRegionQuery),
    enabled:
      type === "REVIEW" &&
      isOpen &&
      debouncedRegionQuery.trim().length >= 1 &&
      !skipRegion,
  });

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        try {
          URL.revokeObjectURL(img.preview);
        } catch {}
      });
    };
  }, []);

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_SIZE_BYTES) {
        setErrorMessage([`이미지 하나당 최대 용량은 ${MAX_SIZE_MB}MB입니다.`]);
        return;
      }
    }

    const incoming: FileWithPreview[] = Array.from(files).map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) }),
    );

    if (incoming.length + images.length > maxImages) {
      setErrorMessage([`최대 ${maxImages}개의 이미지만 업로드 가능합니다.`]);
      incoming.forEach((f) => URL.revokeObjectURL(f.preview));
      return;
    }

    setErrorMessage([]);
    setImages((prev) => [...prev, ...incoming]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const createPostMutation = useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    meta: { silent: true },
    onSuccess: (res) => {
      router.push(`/community/${res.id}`);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        if (err.code === ErrorCode.VALIDATION_FAILED) {
          setErrorMessage(["입력한 내용을 다시 확인해주세요."]);
          return;
        }
        if (err.code === ErrorCode.FILE_TOO_LARGE) {
          setErrorMessage([
            `이미지 하나당 최대 용량은 ${MAX_SIZE_MB}MB입니다.`,
          ]);
          return;
        }
        if (err.code === ErrorCode.FILE_TOO_MANY) {
          setErrorMessage([
            `최대 ${maxImages}개의 이미지만 업로드 가능합니다.`,
          ]);
          return;
        }
        if (err.code === ErrorCode.FILE_INVALID_TYPE) {
          setErrorMessage(["지원하지 않는 이미지 형식입니다."]);
          return;
        }
        setErrorMessage(["글 작성에 실패했어요."]);
        return;
      }
      setErrorMessage(["알 수 없는 오류로 글 작성에 실패했어요."]);
    },
  });

  const handleChangeCaption = (index: number, caption: string) => {
    setImages((prev) =>
      prev.map((img, i) => {
        if (i === index) {
          return Object.assign(img, { caption });
        }
        return img;
      }),
    );
  };

  const onSubmit = async (data: WritePostFormValues) => {
    if (data.type === "REVIEW" && !data.regionSlug && !data.skipRegion) {
      setError("regionSlug", {
        type: "manual",
        message: "리뷰 게시글은 지역 선택이 필요해요.",
      });
      return;
    }

    setErrorMessage([]);

    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("content", data.content.trim());
    formData.append("type", data.type);

    if (data.type === "REVIEW" && !data.skipRegion) {
      formData.append("regionSlug", data.regionSlug);
      formData.append("rating", String(data.rating));
    }

    images.forEach((file) => {
      formData.append("captions", (file.caption ?? "").trim());
    });
    images.forEach((file) => formData.append("image", file));

    createPostMutation.mutate(formData);
  };

  const isSubmitting = createPostMutation.isPending;

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

          {errorMessage.length > 0 && (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 p-4"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm font-semibold text-red-700">
                작성에 실패했어요
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errorMessage.map((msg) => (
                  <li key={msg} className="text-sm text-red-700">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                게시판
              </label>
              <select
                {...register("type", {
                  onChange: (e) => {
                    const nextType = e.target.value as CategoryType;

                    if (nextType !== "REVIEW") {
                      setValue("regionSlug", "");
                      setValue("rating", 0);
                      setValue("skipRegion", false);
                      setRegionQuery("");
                      clearErrors("regionSlug");
                      setIsOpen(false);
                    }
                  },
                })}
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
              >
                <option value="FREE">일반 게시글</option>
                <option value="REVIEW">리뷰</option>
                <option value="QUESTION">질문</option>
              </select>
              <p className="text-xs text-neutral-500">
                {type === "REVIEW"
                  ? "리뷰는 지역 선택/평점 입력이 필요해요."
                  : "일반/질문은 자유롭게 작성할 수 있어요."}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                제목
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "제목을 입력해주세요.",
                  validate: (value) =>
                    value.trim() !== "" || "제목을 입력해주세요.", // 실패시 setError로 메시지 전달, 성공시 true 반환
                })}
                placeholder="제목을 입력하세요"
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
              />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            <ImageUploader
              images={images}
              onAddFiles={handleAddFiles}
              onRemove={removeImage}
              onChangeCaption={handleChangeCaption}
              max={maxImages}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                내용
              </label>
              <textarea
                {...register("content", {
                  required: "내용을 입력해주세요.",
                  validate: (value) =>
                    value.trim() !== "" || "내용을 입력해주세요.",
                })}
                placeholder="내용을 입력하세요"
                className="h-44 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
              />
              {errors.content && (
                <p className="text-xs text-red-600">{errors.content.message}</p>
              )}
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{content.length || 0}자</span>
              </div>
            </div>

            {type === "REVIEW" ? (
              <div className="space-y-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="relative space-y-2">
                  <label className="block text-sm font-semibold text-neutral-900">
                    지역 검색
                  </label>

                  <input
                    type="text"
                    disabled={skipRegion}
                    value={regionQuery}
                    onChange={(e) => {
                      if (skipRegion) return;
                      setRegionQuery(e.target.value);
                      setValue("regionSlug", "");
                      clearErrors("regionSlug");
                      setIsOpen(true);
                    }}
                    placeholder="예) 묵호, 서울, 강릉..."
                    className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                    onFocus={() => !skipRegion && setIsOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setIsOpen(false), 150);
                    }}
                  />
                  {errors.regionSlug && (
                    <p className="text-xs text-red-600">
                      {errors.regionSlug.message}
                    </p>
                  )}

                  <div className="ml-2 flex items-center gap-2">
                    <input
                      id="skip-region"
                      type="checkbox"
                      {...register("skipRegion", {
                        onChange: (e) => {
                          const checked = e.target.checked;

                          if (checked) {
                            setValue("regionSlug", "");
                            setRegionQuery("");
                            clearErrors("regionSlug");
                            setIsOpen(false);
                          }
                        },
                      })}
                      className="h-4 w-4 accent-neutral-900"
                    />
                    <label
                      htmlFor="skip-region"
                      className="text-sm text-neutral-700"
                    >
                      지역 선택 안 함
                    </label>
                  </div>

                  {isOpen && debouncedRegionQuery.trim().length >= 1 ? (
                    <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
                      {isRegionLoading ? (
                        <div className="p-3 text-sm text-neutral-500">
                          검색 중...
                        </div>
                      ) : regionSuggestions && regionSuggestions.length > 0 ? (
                        <ul className="max-h-64 overflow-auto">
                          {regionSuggestions.map((d) => (
                            <li key={d.id}>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-50"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setValue("regionSlug", d.slug, {
                                    shouldValidate: true,
                                  });
                                  clearErrors("regionSlug");
                                  setRegionQuery(d.name);
                                  setIsOpen(false);
                                }}
                              >
                                <span className="font-medium text-neutral-900">
                                  {d.name}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 text-sm text-neutral-500">
                          검색 결과가 없어요.
                        </div>
                      )}
                    </div>
                  ) : null}

                  <p className="text-xs text-neutral-500">
                    {regionSlug
                      ? `선택됨: ${regionSlug}`
                      : "아직 지역이 없다면 제목에 지역을 포함후 지역 선택 안 함 체크박스를 클릭해주세요."}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-900">
                    평점
                  </label>

                  {/* <StarRating value={rating} onChange={(v) => setRating(v)} /> */}
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <p className="text-xs text-neutral-500">
                    별을 클릭해서 1~5점으로 평가해주세요.
                  </p>
                </div>
              </div>
            ) : null}

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
                {isSubmitting ? "업로드 중..." : "작성"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
