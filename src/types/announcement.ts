export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  excerpt: string;
  priority: 'normal' | 'important' | 'urgent';
  published_at: string;
  status: 'draft' | 'published' | 'archived';
  category?: string;
  tags?: string[];
  author?: string;
}

export interface AnnouncementCardProps {
  announcement: Announcement;
  showExcerpt?: boolean;
  showCategory?: boolean;
}

export interface AnnouncementListProps {
  announcements: Announcement[];
  totalPages: number;
  currentPage: number;
  priority?: string;
  searchQuery?: string;
}