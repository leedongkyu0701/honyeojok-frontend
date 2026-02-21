"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import Button from "@/components/common/Button";

export interface FileWithPreview extends File {
  preview: string;
  caption?: string; // ✅ 캡션 추가
}

type Props = {
  images: FileWithPreview[];
  onAddFiles: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  onChangeCaption: (index: number, caption: string) => void; // ✅ 캡션 변경 핸들러
  max?: number;
};

export default function ImageUploader({
  images,
  onAddFiles,
  onRemove,
  onChangeCaption,
  max = 5,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const remain = max - images.length;

  const hasImages = images.length > 0;

  const helperText = useMemo(() => {
    if (!hasImages) return `클릭하거나 드래그해서 올리세요. (최대 ${max}장)`;
    return `사진마다 설명(선택)을 적을 수 있어요.`;
  }, [hasImages, max]);

  return (
    <div className="space-y-3">
      {/* Dropzone / Button */}
      <div
        className="rounded-2xl border border-neutral-200 bg-white p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onAddFiles(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-900">
              이미지 업로드{" "}
              <span className="text-neutral-500">
                ({images.length}/{max})
              </span>
            </p>
            <p className="text-xs text-neutral-500">{helperText}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-4"
              onClick={() => inputRef.current?.click()}
              disabled={remain <= 0}
            >
              파일 선택
            </Button>

            {hasImages ? (
              <span className="text-xs text-neutral-500">남은 슬롯 {remain}</span>
            ) : null}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onAddFiles(e.target.files)}
        />
      </div>

      {/* Images list (✅ 세로 + 캡션 입력) */}
      {hasImages ? (
        <div className="space-y-5">
          {images.map((file, idx) => (
            <div
              key={file.preview}
              className="rounded-2xl border border-neutral-200 bg-white p-3"
            >
              {/* preview */}
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-neutral-100">
                <Image
                  src={file.preview}
                  alt={file.caption?.trim() ? file.caption : `preview-${idx}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white text-base hover:bg-black"
                  aria-label="remove image"
                >
                  ×
                </button>

                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  {idx + 1}
                </div>
              </div>

              {/* caption input */}
              <div className="mt-3 space-y-2">
                <label className="block text-xs font-medium text-neutral-700">
                  사진 설명(선택)
                </label>
                <input
                  type="text"
                  value={file.caption ?? ""}
                  onChange={(e) => onChangeCaption(idx, e.target.value)}
                  placeholder="예) 해질 무렵 바다 산책로"
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                />
                <p className="text-[11px] text-neutral-500">
                  작성하지 않으면 캡션 없이 노출돼요.
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}