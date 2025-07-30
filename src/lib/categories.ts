import { supabase } from './supabase'

export interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

/**
 * Create a new category
 */
export async function createCategory(name: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim() })
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    return null
  }

  return data
}

/**
 * Update a category
 */
export async function updateCategory(id: string, name: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .update({ 
      name: name.trim(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    return null
  }

  return data
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    return false
  }

  return true
}