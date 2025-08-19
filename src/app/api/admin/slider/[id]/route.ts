import { NextRequest, NextResponse } from 'next/server';
import { getSliderImageById, updateSliderImage, deleteSliderImage } from '@/lib/slider';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const image = await getSliderImageById(id);
    
    if (!image) {
      return NextResponse.json(
        { error: 'Slider image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching slider image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slider image' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    const image = await updateSliderImage(id, updates);
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating slider image:', error);
    return NextResponse.json(
      { error: 'Failed to update slider image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteSliderImage(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slider image:', error);
    return NextResponse.json(
      { error: 'Failed to delete slider image' },
      { status: 500 }
    );
  }
}