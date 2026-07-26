"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  MAX_POST_IMAGE_COUNT,
  POST_IMAGE_ACCEPT,
} from "@/features/community/constants/community.constants";
import type { PostImageDraft } from "@/features/community/hooks/usePostImages";
import Button from "@/shared/ui/Button";

type ImageUploaderProps = {
  images: PostImageDraft[];
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (imageId: string) => void;
  onUpdateCaption: (imageId: string, caption: string) => void;
};

export default function ImageUploader({
  images,
  onAddImages,
  onRemoveImage,
  onUpdateCaption,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const remainingSlots = MAX_POST_IMAGE_COUNT - images.length;

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl border border-neutral-200 bg-white p-4"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onAddImages(event.dataTransfer.files);
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-900">
              이미지 업로드{" "}
              <span className="text-neutral-500">
                ({images.length}/{MAX_POST_IMAGE_COUNT})
              </span>
            </p>
            <p className="text-xs text-neutral-500">
              클릭하거나 드래그하여 최대 {MAX_POST_IMAGE_COUNT}장까지 업로드할 수 있어요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-4"
              onClick={() => inputRef.current?.click()}
              disabled={remainingSlots <= 0}
            >
              파일 선택
            </Button>
            {images.length > 0 ? (
              <span className="text-xs text-neutral-500">
                남은 슬롯 {remainingSlots}
              </span>
            ) : null}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={POST_IMAGE_ACCEPT}
          multiple
          className="hidden"
          onChange={(event) => {
            onAddImages(event.target.files);
            event.currentTarget.value = "";
          }}
        />
      </div>

      {images.length > 0 ? (
        <div className="space-y-5">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="rounded-2xl border border-neutral-200 bg-white p-3"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-neutral-100">
                <Image
                  src={image.previewUrl}
                  alt={image.caption.trim() || `preview-${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(image.id)}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-base text-white hover:bg-black"
                  aria-label="사진 삭제"
                >
                  ×
                </button>
                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  {index + 1}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <label className="block text-xs font-medium text-neutral-700">
                  사진 설명(선택)
                </label>
                <input
                  type="text"
                  value={image.caption}
                  onChange={(event) =>
                    onUpdateCaption(image.id, event.target.value)
                  }
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
