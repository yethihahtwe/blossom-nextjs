import { News } from '../supabase'
import { newsRepository } from '../repositories/news.repository'
import { ContentServiceFactory } from './content.service'

/**
 * News service with additional business logic
 */
export class NewsService {
  private baseService = ContentServiceFactory.create<News>(newsRepository)

  // Delegate base operations to the generic service
  async getAll() { return this.baseService.getAll() }
  async getPublished() { return this.baseService.getPublished() }
  async getBySlug(slug: string) { return this.baseService.getBySlug(slug) }
  async search(query: string) { return this.baseService.search(query) }
  async create(data: Omit<News, 'id' | 'created_at' | 'updated_at' | 'slug'>) { 
    return this.baseService.create(data) 
  }
  async update(id: string, updates: Partial<News>) { return this.baseService.update(id, updates) }
  async delete(id: string) { return this.baseService.delete(id) }
  async getRecent(limit: number = 3) { return this.baseService.getRecent(limit) }

  // News-specific operations
  async getCategories(): Promise<string[]> {
    return newsRepository.getCategories()
  }

  async getByCategory(category: string): Promise<News[]> {
    return newsRepository.getByCategory(category)
  }

  /**
   * Business logic: Calculate reading time from content
   */
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  /**
   * Business logic: Create news with auto-calculated reading time
   */
  async createWithReadingTime(data: Omit<News, 'id' | 'created_at' | 'updated_at' | 'slug' | 'reading_time'>): Promise<News | null> {
    const reading_time = this.calculateReadingTime(data.content)
    return this.create({ ...data, reading_time })
  }
}

// Export singleton instance
export const newsService = new NewsService()