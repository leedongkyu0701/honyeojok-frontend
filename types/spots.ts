export type SpotTag = {
  slug: string;
  label: string;
};

export type SpotDestination = {
  slug: string;
  name: string;
};

import { ImageSource } from "./destinations";

export type SpotEntity = {
  id: number;
  slug: string;
  name: string;

  note?: string | null;
  description: string;

  imageUrl?: string | null;
  imageSource?: ImageSource | null;
  imageCredit?: string | null;
  address?: string | null;
  externalUrl?: string | null;
  isRecommended: boolean;

  destination: SpotDestination;
  tags: SpotTag[];
};

export type SpotCardVM = {
  id: number;
  slug: string;
  name: string;
  imageUrl?: string | null;
  note?: string | null;
  tags?: SpotTag[];
  destination: SpotDestination;
};