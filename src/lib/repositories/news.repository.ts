import { supabase } from '../supabase'
import { News } from '../supabase'
import { BaseContentRepository } from './base-content.repository'

/**
 * News-specific repository implementation
 */
export class NewsRepository extends BaseContentRepository<News> {
  constructor() {
    super('news')
  }

  /**
   * Get allowed fields for news updates
   */
  protected getAllowedUpdateFields(): (keyof News)[] {
    return [
      'title', 'content', 'excerpt', 'featured_image', 
      'category', 'status', 'author', 'reading_time', 'published_at'
    ]
  }

  /**
   * Get news categories (unique categories from published news)
   */
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('news')
      .select('category')
      .eq('status', 'published')
      .not('published_at', 'is', null)

    if (error) {
      console.error('Error fetching news categories:', error)
      return []
    }

    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category) || [])]
    return categories.filter(Boolean).sort()
  }

  /**
   * Get news by category
   */
  async getByCategory(category: string): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching news by category:', error)
      return []
    }

    return data || []
  }
}

// Create singleton instance
export const newsRepository = new NewsRepository()