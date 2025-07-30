import { supabase, type News } from './supabase'

/**
 * Get all news articles for admin panel (including drafts)
 */
export async function getAllNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all news:', error)
    return []
  }

  return data || []
}

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

/**
 * Create a new news article
 */
export async function createNews(newsData: Omit<News, 'id' | 'created_at' | 'updated_at' | 'slug' | 'published_at'>): Promise<News | null> {
  // Generate base slug from title
  const baseSlug = newsData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 90) // Leave room for suffix
  
  // Find a unique slug
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    // Check if slug exists
    const { data: existing } = await supabase
      .from('news')
      .select('slug')
      .eq('slug', slug)
      .single()
    
    if (!existing) {
      // Slug is unique, break out of loop
      break
    }
    
    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`
    counter++
  }

  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('news')
    .insert({
      ...newsData,
      slug,
      published_at: newsData.status === 'published' ? now : null, // Only set published_at if status is published
      category: newsData.category || 'General' // Ensure category is provided
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating news:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    console.error('Data being inserted:', JSON.stringify({
      ...newsData,
      slug,
      published_at: newsData.status === 'published' ? now : null,
      category: newsData.category || 'General'
    }, null, 2))
    return null
  }

  return data
}