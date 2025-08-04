import { supabase } from '@/lib/supabase'
import type { Notification, CreateNotificationData, UpdateNotificationData } from '@/lib/types/notification'

export class NotificationsService {
  static async getAll(): Promise<Notification[]> {
    console.log('NotificationsService.getAll() called')
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }

    console.log('getAll returned:', data?.length || 0, 'notifications')
    return data || []
  }

  static async getUnread(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching unread notifications:', error)
      throw error
    }

    return data || []
  }

  static async getUnreadCount(): Promise<number> {
    console.log('NotificationsService.getUnreadCount() called')
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      throw error
    }

    console.log('getUnreadCount returned:', count || 0)
    return count || 0
  }

  static async create(notificationData: CreateNotificationData): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        ...notificationData,
        type: notificationData.type || 'info',
        priority: notificationData.priority || 'normal',
        metadata: notificationData.metadata || {}
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      throw error
    }

    return data
  }

  // Server-side method for creating notifications (bypasses RLS)
  static async createServerSide(notificationData: CreateNotificationData): Promise<Notification | null> {
    // Dynamic import to avoid client-side bundle issues
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert([{
        ...notificationData,
        type: notificationData.type || 'info',
        priority: notificationData.priority || 'normal',
        metadata: notificationData.metadata || {}
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      throw error
    }

    return data
  }

  // Server-side method for getting all notifications (bypasses RLS)
  static async getAllServerSide(): Promise<Notification[]> {
    console.log('NotificationsService.getAllServerSide() called')
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }

    console.log('getAllServerSide returned:', data?.length || 0, 'notifications')
    return data || []
  }

  // Server-side method for getting unread count (bypasses RLS)
  static async getUnreadCountServerSide(): Promise<number> {
    console.log('NotificationsService.getUnreadCountServerSide() called')
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      throw error
    }

    console.log('getUnreadCountServerSide returned:', count || 0)
    return count || 0
  }

  static async markAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }

    return true
  }

  static async markAllAsRead(): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }

    return true
  }

  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting notification:', error)
      throw error
    }

    return true
  }

  static async update(id: string, updateData: UpdateNotificationData): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notification:', error)
      throw error
    }

    return data
  }
}

export const notificationsService = NotificationsService