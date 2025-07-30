import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  category: string
  author?: string
  reading_time?: number
  published_at?: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  priority: 'normal' | 'important' | 'urgent'
  published_at: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}