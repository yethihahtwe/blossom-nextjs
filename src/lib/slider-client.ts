import { supabase } from './supabase';
import { SliderImage } from './types/slider';

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