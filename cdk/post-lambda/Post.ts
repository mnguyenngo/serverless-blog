type Post = {
  title: string;
  titleSlug: string;
  content: string;
  created: string;
  updated: string;
  viewCount: number;
  postId: string;
  author: string;
  published: boolean;
  publishDate: string | null;
};

type PostInput = {
  title: string;
  content: string;
  author: string;
};

type PostUpdateableFields = {
  title?: string;
  titleSlug?: string;
  content?: string;
  updated?: string;
  viewCount?: number;
  published?: boolean;
  publishDate?: string | null;
};

export type { Post, PostInput, PostUpdateableFields };
