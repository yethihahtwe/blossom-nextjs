import { supabase, type News } from './supabase'

/**
 * Get all published news articles
 */
export async function getPublishedNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data || []
}

/**
 * Get unique news categories
 */
export async function getNewsCategories(): Promise<string[]> {
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
  return categories.sort()
}

/**
 * Search news by title, content, or excerpt
 */
export async function searchNews(query: string): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error searching news:', error)
    return []
  }

  return data || []
}

/**
 * Get news by category
 */
export async function getNewsByCategory(category: string): Promise<News[]> {
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

/**
 * Get a single news article by slug
 */
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .single()

  if (error) {
    console.error('Error fetching news by slug:', error)
    return null
  }

  return data
}

/**
 * Get recent news for homepage (limit to specified number)
 */
export async function getRecentNews(limit: number = 3): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent news:', error)
    return []
  }

  return data || []
}

/**
 * Update an existing news article
 */
export async function updateNews(id: string, updates: Partial<News>): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating news:', error)
    return null
  }

  return data
}