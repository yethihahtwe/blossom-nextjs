import { supabase } from '../supabase'

/**
 * Slug generator utility for content items
 */
export class SlugGenerator {
  /**
   * Generate a unique slug for a given title and table
   */
  static async generateUniqueSlug(title: string, tableName: string): Promise<string> {
    // Generate base slug from title
    const baseSlug = this.createBaseSlug(title)
    
    // Find a unique slug
    let slug = baseSlug
    let counter = 1
    
    while (true) {
      // Check if slug exists
      const { data: existing } = await supabase
        .from(tableName)
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
    
    return slug
  }

  /**
   * Create base slug from title
   */
  static createBaseSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 90) // Leave room for suffix
  }

  /**
   * Validate slug format
   */
  static isValidSlug(slug: string): boolean {
    const slugPattern = /^[a-z0-9-]+$/
    return slugPattern.test(slug) && !slug.startsWith('-') && !slug.endsWith('-')
  }
}