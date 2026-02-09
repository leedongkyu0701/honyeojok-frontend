"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryType } from "@/types/post";
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
const MAX_SIZE_MB = 5;
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

  // REVIEW 전용
  const [regionSlug, setRegionSlug] = useState("");
  const [regionQuery, setRegionQuery] = useState("");
  const [rating, setRating] = useState<number>(0);

  // 이미지
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const debouncedRegionQuery = useDebounce(regionQuery, 400);

  const { data: regionSuggestions, isLoading: isRegionLoading } = useQuery({
    queryKey: ["search-destinations", debouncedRegionQuery],
    queryFn: () => searchDestinations(debouncedRegionQuery),
    enabled:
      type === "REVIEW" && isOpen && debouncedRegionQuery.trim().length >= 1,
  });

  // REVIEW가 아니면 region 관련 상태 정리
  useEffect(() => {
    if (type !== "REVIEW") {
      setRegionSlug("");
      setRegionQuery("");
      setRating(0);
      setIsOpen(false);
    }
  }, [type]);

  const maxImages = 5;

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;

    // 용량 검사
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
      // 추가된 incoming preview는 해제
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

  // 언마운트 시 blob url 정리
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!content.trim()) return false;
    if (type === "REVIEW") {
      // 리뷰면 지역 선택을 강제할지 정책 선택(여기선 강제)
      if (!regionSlug) return false;
      if (rating < 0 || rating > 5) return false;
    }
    return true;
  }, [title, content, type, regionSlug, rating]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const t = title.trim();
    const c = content.trim();

    if (!t || !c) {
      setErrorMessage(["제목과 내용을 입력해주세요."]);
      return;
    }

    if (type === "REVIEW" && !regionSlug) {
      setErrorMessage(["리뷰는 지역을 선택해주세요."]);
      return;
    }

    setErrorMessage([]);

    const formData = new FormData();
    formData.append("title", t);
    formData.append("content", c);
    formData.append("type", type);

    if (type === "REVIEW") {
      formData.append("regionSlug", regionSlug);
      formData.append("rating", String(rating));
    }

    images.forEach((file) => formData.append("image", file));
    createPostMutation.mutate(formData);
  };

  const isSubmitting = createPostMutation.isPending;

  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white">
        <CardContent className="space-y-6 p-6">
          {/* Header */}
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
    <p className="text-sm font-semibold text-red-700">작성에 실패했어요</p>
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
            {/* 게시판 */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                게시판
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CategoryType)}
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

            {/* 제목 */}
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

            {/* 이미지 업로드 (새 UI) */}
            <ImageUploader
              images={images}
              onAddFiles={handleAddFiles}
              onRemove={removeImage}
              max={maxImages}
            />

            {/* 내용 */}
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

            {/* REVIEW 전용 */}
            {type === "REVIEW" ? (
              <div className="space-y-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                {/* 지역 검색 */}
                <div className="relative space-y-2">
                  <label className="block text-sm font-semibold text-neutral-900">
                    지역 검색
                  </label>

                  <input
                    type="text"
                    value={regionQuery}
                    onChange={(e) => {
                      setRegionQuery(e.target.value);
                      setRegionSlug("");
                      setIsOpen(true);
                    }}
                    placeholder="예) 묵호, 서울, 강릉..."
                    className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                      // 클릭 선택이 blur와 충돌할 수 있어 살짝 지연
                      setTimeout(() => setIsOpen(false), 150);
                    }}
                  />

                  {/* 검색 결과 */}
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
                                  // blur보다 먼저 선택되도록
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
                      : "검색 결과에서 지역을 선택해주세요."}
                  </p>
                </div>

                {/* 평점 */}
                {/* 평점 */}
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


            {/* Actions */}
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
