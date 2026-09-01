"use client";

import { useEffect, useRef, useState } from "react";
import {
  MAX_POST_IMAGE_COUNT,
  MAX_POST_IMAGE_SIZE_BYTES,
  MAX_POST_IMAGE_SIZE_MB,
  POST_IMAGE_MIME_TYPES,
} from "@/features/community/constants/community.constants";

export type PostImageDraft = {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
};

const allowedMimeTypes = new Set<string>(POST_IMAGE_MIME_TYPES);

export function usePostImages() {
  const [images, setImages] = useState<PostImageDraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const imagesRef = useRef<PostImageDraft[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  const addImages = (fileList: FileList | null) => {
    if (!fileList) return;

    const incomingFiles = Array.from(fileList);
    if (incomingFiles.length + images.length > MAX_POST_IMAGE_COUNT) {
      setErrorMessage(
        `최대 ${MAX_POST_IMAGE_COUNT}개의 이미지만 업로드 가능합니다.`,
      );
      return;
    }

    if (incomingFiles.some((file) => !allowedMimeTypes.has(file.type))) {
      setErrorMessage("지원하지 않는 이미지 형식입니다.");
      return;
    }

    if (incomingFiles.some((file) => file.size <= 0)) {
      setErrorMessage("비어있는 이미지 파일은 업로드할 수 없습니다.");
      return;
    }

    if (incomingFiles.some((file) => file.size > MAX_POST_IMAGE_SIZE_BYTES)) {
      setErrorMessage(
        `이미지 하나당 최대 용량은 ${MAX_POST_IMAGE_SIZE_MB}MB입니다.`,
      );
      return;
    }

    const drafts = incomingFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      caption: "",
    }));

    setErrorMessage(null);
    setImages((current) => [...current, ...drafts]);
  };

  const removeImage = (imageId: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === imageId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((image) => image.id !== imageId);
    });
  };

  const updateCaption = (imageId: string, caption: string) => {
    setImages((current) =>
      current.map((image) =>
        image.id === imageId ? { ...image, caption } : image,
      ),
    );
  };

  const clearImages = () => {
    setImages((current) => {
      current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
  };

  return {
    images,
    errorMessage,
    addImages,
    removeImage,
    updateCaption,
    clearImages,
    clearError: () => setErrorMessage(null),
  };
}
