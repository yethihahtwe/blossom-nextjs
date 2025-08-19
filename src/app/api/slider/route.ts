import { NextResponse } from 'next/server';
import { getSliderImages } from '@/lib/slider-client';

export async function GET() {
  try {
    const images = await getSliderImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching slider images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slider images' },
      { status: 500 }
    );
  }
}