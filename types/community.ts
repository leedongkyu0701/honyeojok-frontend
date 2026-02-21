
export type PostType = "REVIEW" | "FREE" | "QUESTION";

export type CategoryType = "ALL" | PostType;

export type PostImageBlockItem = {
  url: string;
  caption: string | null;
};

export type PostCardResponse = {
  id: number;
  title: string;

  region?: string;

  // 서버 Date → JSON으로 오면 string(ISO)임
  createdAt: string;

  nickName?: string;

  likeCount: number;
  viewCount: number;

  thumbnailUrl?: string;

  type: PostType;
};

export type PostDetailResponse = {
  id: number;
  title: string;

  region?: string;

  createdAt: string;

  nickName?: string;

  content: string;

  type: PostType;

  rating?: number;

  images: PostImageBlockItem[];

  likeCount: number;
  viewCount: number;

  likedByMe: boolean;
};


export type CommentUserResponse = {
  id: number;
  nickName: string;
};

export type CommentResponse = {
  id: number;
  content: string;
  isDeleted: boolean;

  createdAt: string;

  postId: number;
  userId: number;
  parentId: number | null;

  user: CommentUserResponse;

  children: CommentResponse[];
};