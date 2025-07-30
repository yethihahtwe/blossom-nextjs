import { BaseContent } from '../types/content'

/**
 * Content validation utilities
 */
export class ContentValidator {
  /**
   * Validate required fields for content creation
   */
  static validateCreateData<T extends BaseContent>(data: Partial<T>): string[] {
    const errors: string[] = []
    
    if (!data.title?.trim()) {
      errors.push('Title is required')
    }
    
    if (!data.content?.trim()) {
      errors.push('Content is required')
    }
    
    if (data.title && data.title.length > 200) {
      errors.push('Title must be less than 200 characters')
    }
    
    return errors
  }

  /**
   * Validate content for update
   */
  static validateUpdateData<T extends BaseContent>(data: Partial<T>): string[] {
    const errors: string[] = []
    
    if (data.title !== undefined && !data.title?.trim()) {
      errors.push('Title cannot be empty')
    }
    
    if (data.content !== undefined && !data.content?.trim()) {
      errors.push('Content cannot be empty')
    }
    
    if (data.title && data.title.length > 200) {
      errors.push('Title must be less than 200 characters')
    }
    
    return errors
  }

  /**
   * Clean update data by removing undefined values and invalid fields
   */
  static cleanUpdateData<T extends BaseContent>(
    updates: Partial<T>, 
    allowedFields: (keyof T)[]
  ): Partial<T> {
    const cleanUpdates: Partial<T> = {}
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key as keyof T) && value !== undefined) {
        (cleanUpdates as any)[key] = value
      }
    }
    
    return cleanUpdates
  }

  /**
   * Handle published_at based on status
   */
  static handlePublishedAt<T extends BaseContent>(updates: Partial<T>): Partial<T> {
    const result = { ...updates }
    
    if (updates.status === 'published' && !updates.published_at) {
      (result as any).published_at = new Date().toISOString()
    } else if (updates.status === 'draft') {
      (result as any).published_at = null
    }
    
    return result
  }
}