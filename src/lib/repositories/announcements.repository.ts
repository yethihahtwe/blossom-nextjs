import { supabase } from '../supabase'
import { Announcement } from '../supabase'
import { BaseContentRepository } from './base-content.repository'
import { Priority } from '../types/content'

/**
 * Announcements-specific repository implementation
 */
export class AnnouncementsRepository extends BaseContentRepository<Announcement> {
  constructor() {
    super('announcements')
  }

  /**
   * Get allowed fields for announcement updates
   */
  protected getAllowedUpdateFields(): (keyof Announcement)[] {
    return [
      'title', 'content', 'excerpt', 'featured_image', 
      'priority', 'status', 'published_at'
    ]
  }

  /**
   * Get announcements by priority
   */
  async getByPriority(priority: Priority): Promise<Announcement[]> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .eq('priority', priority)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching announcements by priority:', error)
      return []
    }

    return data || []
  }

  /**
   * Get urgent announcements (for displaying in banners/notifications)
   */
  async getUrgentAnnouncements(): Promise<Announcement[]> {
    return this.getByPriority('urgent')
  }

  /**
   * Get announcements ordered by priority and date
   */
  async getOrderedByPriority(): Promise<Announcement[]> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('priority', { ascending: false }) // urgent, important, normal
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching ordered announcements:', error)
      return []
    }

    return data || []
  }

  /**
   * Get announcement priorities (for filter dropdowns)
   */
  async getPriorities(): Promise<Priority[]> {
    return ['urgent', 'important', 'normal']
  }
}

// Create singleton instance
export const announcementsRepository = new AnnouncementsRepository()