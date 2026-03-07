"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { se } from "date-fns/locale";
const MAX_SIZE_MB = 6;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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

  const [type, setType] = useState<CategoryType>("FREE");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [regionSlug, setRegionSlug] = useState("");
  const [regionQuery, setRegionQuery] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [skipRegion, setSkipRegion] = useState(false);

  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const debouncedRegionQuery = useDebounce(regionQuery, 400);
  const imagesRef = useRef<FileWithPreview[]>([]);

  const { data: regionSuggestions, isLoading: isRegionLoading } = useQuery({
    queryKey: ["search-destinations", debouncedRegionQuery],
    queryFn: () => searchDestinations(debouncedRegionQuery),
    enabled:
      type === "REVIEW" &&
      isOpen &&
      debouncedRegionQuery.trim().length >= 1 &&
      !skipRegion,
  });

  const maxImages = 5;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as CategoryType;
    if (selectedType !== "REVIEW") {
      setRegionSlug("");
      setRegionQuery("");
      setRating(0);
      setIsOpen(false);
      setSkipRegion(false);
    }
    setType(selectedType);
  };

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

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!content.trim()) return false;
    if (type === "REVIEW") {
      if (!regionSlug && !skipRegion) return false;
      if (rating < 0 || rating > 5) return false;
    }
    return true;
  }, [title, content, type, regionSlug, rating, skipRegion]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const t = title.trim();
    const c = content.trim();

    if (!t || !c) {
      setErrorMessage(["제목과 내용을 입력해주세요."]);
      return;
    }

    if (type === "REVIEW" && !regionSlug && !skipRegion) {
      setErrorMessage(["리뷰는 지역을 선택해주세요."]);
      return;
    }

    setErrorMessage([]);

    const formData = new FormData();
    formData.append("title", t);
    formData.append("content", c);
    formData.append("type", type);

    if (type === "REVIEW" && !skipRegion) {
      formData.append("regionSlug", regionSlug);
      formData.append("rating", String(rating));
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                게시판
              </label>
              <select
                value={type}
                onChange={handleTypeChange}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                required
              />
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="h-44 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                required
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{content.length}자</span>
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
                      setRegionSlug("");
                      setIsOpen(true);
                    }}
                    placeholder="예) 묵호, 서울, 강릉..."
                    className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                    onFocus={() => !skipRegion && setIsOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setIsOpen(false), 150);
                    }}
                  />
                  <div className="ml-2 flex items-center gap-2">
                    <input
                      id="skip-region"
                      type="checkbox"
                      checked={skipRegion}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setSkipRegion(next);

                        if (next) {
                          setRegionSlug("");
                          setRegionQuery("");
                          setIsOpen(false);
                        }
                      }}
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
                                  setRegionSlug(d.slug);
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

                  <StarRating value={rating} onChange={(v) => setRating(v)} />

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

              <Button type="submit" disabled={isSubmitting || !canSubmit}>
                {isSubmitting ? "업로드 중..." : "작성"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
