export type TagResponse = {
  id: number;
  slug: string;
  label: string;
};

export type TagOption = Pick<TagResponse, "slug" | "label">;