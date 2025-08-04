import { NextRequest, NextResponse } from 'next/server'
import { notificationsService } from '@/lib/services/notifications.service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { is_read, ...updateData } = body

    if (is_read !== undefined) {
      await notificationsService.markAsRead(params.id)
      return NextResponse.json({ success: true })
    }

    const notification = await notificationsService.update(params.id, updateData)
    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await notificationsService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}