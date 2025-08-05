/**
 * Base interface for all content entities (News, Announcements, etc.)
 */
export interface BaseContent {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string
  view_count?: number
}

/**
 * Base interface for content with categories
 */
export interface CategorizedContent extends BaseContent {
  category?: string
}

/**
 * Base interface for content with author information
 */
export interface AuthoredContent extends BaseContent {
  author?: string
  reading_time?: number
}

/**
 * Priority levels for announcements
 */
export type Priority = 'normal' | 'important' | 'urgent'

/**
 * Extended content interface for announcements
 */
export interface PrioritizedContent extends BaseContent {
  priority: Priority
}

/**
 * Generic repository interface for content operations
 */
export interface ContentRepository<T extends BaseContent> {
  getAll(): Promise<T[]>
  getPublished(): Promise<T[]>
  getBySlug(slug: string): Promise<T | null>
  search(query: string): Promise<T[]>
  create(item: Omit<T, 'id' | 'created_at' | 'updated_at' | 'slug'>): Promise<T | null>
  update(id: string, updates: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
}

/**
 * Generic service interface for content operations
 */
export interface ContentService<T extends BaseContent> {
  getAll(): Promise<T[]>
  getPublished(): Promise<T[]>
  getBySlug(slug: string): Promise<T | null>
  search(query: string): Promise<T[]>
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'slug'>): Promise<T | null>
  update(id: string, updates: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
}

/**
 * Content creation/update data
 */
export type CreateContentData<T extends BaseContent> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'slug'>
export type UpdateContentData<T extends BaseContent> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>