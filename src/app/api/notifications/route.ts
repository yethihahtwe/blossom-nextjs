import { NextRequest, NextResponse } from 'next/server'
import { notificationsService } from '@/lib/services/notifications.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const countOnly = searchParams.get('count') === 'true'

    if (countOnly) {
      const count = await notificationsService.getUnreadCount()
      return NextResponse.json({ count })
    }

    const notifications = unreadOnly 
      ? await notificationsService.getUnread()
      : await notificationsService.getAll()

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, priority, metadata } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    const notification = await notificationsService.create({
      title,
      message,
      type,
      priority,
      metadata
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const markAllRead = searchParams.get('markAllRead') === 'true'

    if (markAllRead) {
      await notificationsService.markAllAsRead()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}