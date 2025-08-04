export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'contact_form'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  is_read: boolean
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateNotificationData {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error' | 'contact_form'
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  metadata?: Record<string, any>
}

export interface UpdateNotificationData {
  title?: string
  message?: string
  type?: 'info' | 'success' | 'warning' | 'error' | 'contact_form'
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  is_read?: boolean
  metadata?: Record<string, any>
}