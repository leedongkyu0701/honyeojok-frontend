  export type PostEntity = {
    id: number;
    title: string;
    content: string;
    type: "REVIEW" | "FREE" | "QUESTION";
    rating?: number;
    imageUrls?: string[];
    region?: string;
    createdAt: string;
    nickName: string;
    likeCount: number;
    likedByMe: boolean;
    thumbnailUrl?: string;
  };

  export type PostCardVM = Pick<
    PostEntity,
    "id" | "title" | "region" | "createdAt" | "nickName" | "likeCount" | "thumbnailUrl" | 'type'
  >;

  export type PostDetailVM = PostEntity;
  export type CategoryType = "ALL" | "REVIEW" | "FREE" | "QUESTION";


  export type CommentUserVM = {
    id: number;
    nickName: string;
  };

  export type CommentEntity = {
    id: number;
    content: string;
    isDeleted: boolean;
    createdAt: string; // 서버가 Date를 ISO string으로 내려준다고 가정(일반적)
    postId: number;
    userId: number;
    parentId: number | null;
    user: CommentUserVM;
    children: CommentEntity[];
  };