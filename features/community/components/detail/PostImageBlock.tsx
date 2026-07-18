import Image from "next/image";
import type { PostImageBlockItem } from "@/features/community/schemas/post.schema";

export default function PostImageBlock({
  images,
}: {
  images: PostImageBlockItem[];
}) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-8">
      {images.map((image, index) => (
        <figure key={`${image.url}-${index}`} className="space-y-2">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={image.url}
              alt={image.caption ?? `image-${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          {image.caption ? (
            <figcaption className="px-1 text-center text-xs text-neutral-500">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
