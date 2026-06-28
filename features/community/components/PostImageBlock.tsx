"use client";

import Image from "next/image";
import type { PostImageBlockItem } from "@/features/community/schemas/response";

export default function PostImageBlock({
  images,
}: {
  images: PostImageBlockItem[];
}) {
  if (!images.length) return null;

  return (
    <div className="space-y-8">
      {images.map((img, idx) => (
        <figure key={img.url + idx} className="space-y-2">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={img.url}
              alt={img.caption ?? `image-${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          {img.caption ? (
            <figcaption className="px-1 text-center text-xs text-neutral-500">
              {img.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}