export interface SliderImage {
  id: string;
  title: string;
  alt_text: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSliderImageData {
  title: string;
  alt_text: string;
  image_url: string;
  display_order: number;
  is_active?: boolean;
}

export interface UpdateSliderImageData {
  title?: string;
  alt_text?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}