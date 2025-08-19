import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
import { SliderImage, CreateSliderImageData, UpdateSliderImageData } from './types/slider';

// Re-export types for backward compatibility
export type { SliderImage, CreateSliderImageData, UpdateSliderImageData };

export async function getSliderImages(): Promise<SliderImage[]> {
  const { data, error } = await supabase
    .from('slider_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching slider images:', error);
    throw new Error('Failed to fetch slider images');
  }

  return data || [];
}

export async function getAllSliderImages(): Promise<SliderImage[]> {
  const { data, error } = await supabaseAdmin
    .from('slider_images')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all slider images:', error);
    throw new Error('Failed to fetch slider images');
  }

  return data || [];
}

export async function getSliderImageById(id: string): Promise<SliderImage | null> {
  const { data, error } = await supabaseAdmin
    .from('slider_images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching slider image:', error);
    throw new Error('Failed to fetch slider image');
  }

  return data;
}

export async function createSliderImage(imageData: CreateSliderImageData): Promise<SliderImage> {
  const { data, error } = await supabaseAdmin
    .from('slider_images')
    .insert([imageData])
    .select()
    .single();

  if (error) {
    console.error('Error creating slider image:', error);
    throw new Error('Failed to create slider image');
  }

  return data;
}

export async function updateSliderImage(id: string, updates: UpdateSliderImageData): Promise<SliderImage> {
  const { data, error } = await supabaseAdmin
    .from('slider_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating slider image:', error);
    throw new Error('Failed to update slider image');
  }

  return data;
}

export async function deleteSliderImage(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('slider_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting slider image:', error);
    throw new Error('Failed to delete slider image');
  }
}

export async function reorderSliderImages(imageIds: string[]): Promise<void> {
  const updates = imageIds.map((id, index) => ({
    id,
    display_order: index + 1
  }));

  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('slider_images')
      .update({ display_order: update.display_order })
      .eq('id', update.id);

    if (error) {
      console.error('Error reordering slider images:', error);
      throw new Error('Failed to reorder slider images');
    }
  }
}