import { BaseContent, ContentService, ContentRepository } from '../types/content'

/**
 * Generic content service implementation
 */
export class BaseContentService<T extends BaseContent> implements ContentService<T> {
  constructor(private repository: ContentRepository<T>) {}

  async getAll(): Promise<T[]> {
    return this.repository.getAll()
  }

  async getPublished(): Promise<T[]> {
    return this.repository.getPublished()
  }

  async getBySlug(slug: string): Promise<T | null> {
    return this.repository.getBySlug(slug)
  }

  async search(query: string): Promise<T[]> {
    return this.repository.search(query)
  }

  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'slug'>): Promise<T | null> {
    return this.repository.create(data)
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    return this.repository.update(id, updates)
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }

  /**
   * Get recent content for homepage
   */
  async getRecent(limit: number = 3): Promise<T[]> {
    if ('getRecent' in this.repository) {
      return (this.repository as ContentRepository<T> & { getRecent: (limit: number) => Promise<T[]> }).getRecent(limit)
    }
    // Fallback to getting all published and limiting
    const published = await this.getPublished()
    return published.slice(0, limit)
  }
}

/**
 * Service factory for creating content services
 */
export class ContentServiceFactory {
  static create<T extends BaseContent>(repository: ContentRepository<T>): ContentService<T> {
    return new BaseContentService(repository)
  }
}