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

import { CategorizedContent, AuthoredContent, PrioritizedContent } from './types/content'

// Database Types extending base interfaces
export interface News extends CategorizedContent, AuthoredContent {
  category: string // Make category required for News
}

export interface Announcement extends PrioritizedContent {
  excerpt: string // Make excerpt required for Announcements
}