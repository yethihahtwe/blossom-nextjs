import { Announcement } from '../supabase'
import { Priority } from '../types/content'
import { announcementsRepository } from '../repositories/announcements.repository'
import { ContentServiceFactory } from './content.service'

/**
 * Announcements service with additional business logic
 */
export class AnnouncementsService {
  private baseService = ContentServiceFactory.create<Announcement>(announcementsRepository)

  // Delegate base operations to the generic service
  async getAll() { return this.baseService.getAll() }
  async getPublished() { return this.baseService.getPublished() }
  async getBySlug(slug: string) { return this.baseService.getBySlug(slug) }
  async search(query: string) { return this.baseService.search(query) }
  async create(data: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'slug'>) { 
    return this.baseService.create(data) 
  }
  async update(id: string, updates: Partial<Announcement>) { return this.baseService.update(id, updates) }
  async delete(id: string) { return this.baseService.delete(id) }
  async getRecent(limit: number = 3) { return this.baseService.getRecent(limit) }

  // Announcement-specific operations
  async getByPriority(priority: Priority): Promise<Announcement[]> {
    return announcementsRepository.getByPriority(priority)
  }

  async getUrgentAnnouncements(): Promise<Announcement[]> {
    return announcementsRepository.getUrgentAnnouncements()
  }

  async getOrderedByPriority(): Promise<Announcement[]> {
    return announcementsRepository.getOrderedByPriority()
  }

  async getPriorities(): Promise<Priority[]> {
    return announcementsRepository.getPriorities()
  }

  /**
   * Business logic: Get announcement display badge
   */
  getPriorityBadgeClass(priority: Priority): string {
    const classes = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      important: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      normal: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return classes[priority]
  }

  /**
   * Business logic: Determine if announcement should be shown as notification
   */
  shouldShowAsNotification(announcement: Announcement): boolean {
    if (announcement.priority === 'urgent') return true
    
    // Show important announcements if they're recent (within 7 days)
    if (announcement.priority === 'important') {
      const publishedDate = new Date(announcement.published_at!)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return publishedDate > weekAgo
    }
    
    return false
  }

  /**
   * Business logic: Get announcements for banner/notification display
   */
  async getNotificationAnnouncements(): Promise<Announcement[]> {
    const all = await this.getPublished()
    return all.filter(announcement => this.shouldShowAsNotification(announcement))
  }
}

// Export singleton instance
export const announcementsService = new AnnouncementsService()