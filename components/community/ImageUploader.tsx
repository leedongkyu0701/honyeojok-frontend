"use client";

import Image from "next/image";
import { useRef } from "react";
import Button from "@/components/common/Button";

export interface FileWithPreview extends File {
  preview: string;
}

export default function ImageUploader({
  images,
  onAddFiles,
  onRemove,
  max = 5,
}: {
  images: FileWithPreview[];
  onAddFiles: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const remain = max - images.length;

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
            <p className="text-xs text-neutral-500">
              클릭하거나 드래그해서 올리세요. (최대 {max}장)
            </p>
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

            {images.length > 0 ? (
              <span className="text-xs text-neutral-500">
                남은 슬롯 {remain}
              </span>
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

      {/* Preview rail */}
      {images.length > 0 ? (
        <div className="relative -mx-1">
          <div
            className="flex gap-3 overflow-x-auto px-1 pb-1
                       snap-x snap-mandatory
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((file, idx) => (
              <div
                key={file.preview}
                className="relative h-28 w-28 shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100"
              >
                <Image
                  src={file.preview}
                  alt={`preview-${idx}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white text-sm hover:bg-black"
                  aria-label="remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* scroll hint */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-white to-transparent" />
        </div>
      ) : null}
    </div>
  );
}
