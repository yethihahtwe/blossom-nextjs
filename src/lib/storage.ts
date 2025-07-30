import { supabase } from './supabase'

/**
 * Upload a file to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string = 'images'): Promise<string | null> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `news/${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteImage(url: string, bucket: string = 'images'): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/${bucket}/`)
    if (urlParts.length < 2) return false
    
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}