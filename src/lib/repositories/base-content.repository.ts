import { supabase } from '../supabase'
import { BaseContent, ContentRepository } from '../types/content'
import { SlugGenerator } from '../utils/slug-generator'
import { ContentValidator } from '../utils/content-validator'
import { DateFormatter } from '../utils/date-formatter'

/**
 * Base repository implementation for content entities
 */
export abstract class BaseContentRepository<T extends BaseContent> implements ContentRepository<T> {
  constructor(protected tableName: string) {}

  /**
   * Get all content items for admin panel (including drafts)
   */
  async getAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error fetching all ${this.tableName}:`, error)
      return []
    }

    return data || []
  }

  /**
   * Get all published content items
   */
  async getPublished(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    if (error) {
      console.error(`Error fetching published ${this.tableName}:`, error)
      return []
    }

    return data || []
  }

  /**
   * Get content by slug
   */
  async getBySlug(slug: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .single()

    if (error) {
      console.error(`Error fetching ${this.tableName} by slug:`, error)
      return null
    }

    return data
  }

  /**
   * Search content by title, content, or excerpt
   */
  async search(query: string): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })

    if (error) {
      console.error(`Error searching ${this.tableName}:`, error)
      return []
    }

    return data || []
  }

  /**
   * Create new content item
   */
  async create(item: Omit<T, 'id' | 'created_at' | 'updated_at' | 'slug'>): Promise<T | null> {
    try {
      // Validate data
      const errors = ContentValidator.validateCreateData(item)
      if (errors.length > 0) {
        console.error(`Validation errors for ${this.tableName}:`, errors)
        return null
      }

      // Generate unique slug
      const slug = await SlugGenerator.generateUniqueSlug(item.title, this.tableName)
      
      // Handle published_at based on status
      const now = new Date().toISOString()
      let publishedAt = null
      if (item.status === 'published') {
        publishedAt = (item as any).published_at || now
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          ...item,
          slug,
          published_at: publishedAt,
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating ${this.tableName}:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error)
      return null
    }
  }

  /**
   * Update existing content item
   */
  async update(id: string, updates: Partial<T>): Promise<T | null> {
    try {
      // Validate updates
      const errors = ContentValidator.validateUpdateData(updates)
      if (errors.length > 0) {
        console.error(`Validation errors for ${this.tableName}:`, errors)
        return null
      }

      // Clean updates and handle published_at
      const allowedFields = this.getAllowedUpdateFields()
      let cleanUpdates = ContentValidator.cleanUpdateData(updates, allowedFields)
      cleanUpdates = ContentValidator.handlePublishedAt(cleanUpdates)
      
      // Always update the updated_at timestamp
      cleanUpdates.updated_at = new Date().toISOString() as any

      const { data, error } = await supabase
        .from(this.tableName)
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error(`Error updating ${this.tableName}:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error)
      return null
    }
  }

  /**
   * Delete content item
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error)
      return false
    }

    return true
  }

  /**
   * Get recent content for homepage
   */
  async getRecent(limit: number = 3): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`Error fetching recent ${this.tableName}:`, error)
      return []
    }

    return data || []
  }

  /**
   * Abstract method to get allowed fields for updates
   * Each concrete implementation should define this
   */
  protected abstract getAllowedUpdateFields(): (keyof T)[]
}