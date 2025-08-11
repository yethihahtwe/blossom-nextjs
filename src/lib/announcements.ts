import { supabase, type Announcement } from './supabase'

// Re-export types
export type { Announcement }

/**
 * Get all published announcements
 */
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching announcements:', error)
    return []
  }

  return data || []
}

/**
 * Get announcements by priority
 */
export async function getAnnouncementsByPriority(priority: 'normal' | 'important' | 'urgent'): Promise<Announcement[]> {
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
 * Search announcements by title, content, or excerpt
 */
export async function searchAnnouncements(query: string): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error searching announcements:', error)
    return []
  }

  return data || []
}

/**
 * Get a single announcement by slug
 */
export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .single()

  if (error) {
    console.error('Error fetching announcement by slug:', error)
    return null
  }

  return data
}

/**
 * Get recent urgent announcements for display
 */
export async function getUrgentAnnouncements(limit: number = 5): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('status', 'published')
    .eq('priority', 'urgent')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching urgent announcements:', error)
    return []
  }

  return data || []
}