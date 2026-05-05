export type TagResponse = {
  id: number;
  slug: string;
  label: string;
};

export const tags = [
  { slug: 'healing', label: '힐링' },
  { slug: 'nature', label: '자연' },
  { slug: 'culture', label: '문화/역사' },
  { slug: 'activity', label: '액티비티' },
  { slug: 'solo-drinking', label: '혼술' },
  { slug: 'emotional', label: '감성' },
  { slug: 'shopping', label: '쇼핑' },
  { slug: 'nightview', label: '야경' },
  { slug: 'sea', label: '바다' },
  { slug: 'mountain', label: '산' },
  { slug: 'stress-relief', label: '리프레시' },
  { slug: 'oneday', label: '당일치기' },
];