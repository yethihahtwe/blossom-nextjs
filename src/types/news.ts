export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  excerpt: string;
  published_at: string;
  status: 'draft' | 'published' | 'archived';
  category?: string;
  tags?: string[];
  author?: string;
  reading_time?: number;
  view_count?: number;
}

export interface NewsCardProps {
  news: News;
  showExcerpt?: boolean;
  showCategory?: boolean;
}

export interface NewsListProps {
  news: News[];
  totalPages: number;
  currentPage: number;
  category?: string;
  searchQuery?: string;
}