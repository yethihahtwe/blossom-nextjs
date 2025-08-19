import { supabase } from './supabase'

/**
 * Generic storage service for handling file uploads
 */
export class StorageService {
  /**
   * Upload a file to Supabase Storage
   */
  static async uploadImage(
    file: File, 
    folder: string = 'general',
    bucket: string = 'images'
  ): Promise<string | null> {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading file:', error)
        throw new Error(`Storage upload failed: ${error.message}`)
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
  static async deleteImage(url: string, bucket: string = 'images'): Promise<boolean> {
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
}

// Legacy functions for backward compatibility
export async function uploadImage(file: File, folder: string = 'general', bucket: string = 'images'): Promise<string | null> {
  return StorageService.uploadImage(file, folder, bucket)
}

export async function deleteImage(url: string, bucket: string = 'images'): Promise<boolean> {
  return StorageService.deleteImage(url, bucket)
}