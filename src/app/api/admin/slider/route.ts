import { NextRequest, NextResponse } from 'next/server';
import { getAllSliderImages, createSliderImage, reorderSliderImages } from '@/lib/slider';

export async function GET() {
  try {
    const images = await getAllSliderImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching slider images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slider images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'reorder') {
      await reorderSliderImages(body.imageIds);
      return NextResponse.json({ success: true });
    }
    
    const image = await createSliderImage(body);
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating slider image:', error);
    return NextResponse.json(
      { error: 'Failed to create slider image' },
      { status: 500 }
    );
  }
}