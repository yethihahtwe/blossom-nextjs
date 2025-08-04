import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id } = body

    // Validate input
    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing required fields: type and id' },
        { status: 400 }
      )
    }

    if (!['news', 'announcement'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "news" or "announcement"' },
        { status: 400 }
      )
    }

    // Get client information
    const ip = request.ip || 
               request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Start a transaction-like operation
    const tableName = type === 'news' ? 'news' : 'announcements'

    // First, verify the content exists and is published
    const { data: content, error: contentError } = await supabase
      .from(tableName)
      .select('id, status')
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (contentError || !content) {
      return NextResponse.json(
        { error: 'Content not found or not published' },
        { status: 404 }
      )
    }

    // Increment view count using the database function
    const { data: functionResult, error: functionError } = await supabase
      .rpc('increment_view_count', {
        table_name: tableName,
        record_id: id
      })

    if (functionError) {
      console.error('Error incrementing view count:', functionError)
      return NextResponse.json(
        { error: 'Failed to update view count' },
        { status: 500 }
      )
    }

    // Log the view in page_views table for detailed analytics
    const { error: logError } = await supabase
      .from('page_views')
      .insert({
        content_type: type,
        content_id: id,
        ip_address: ip.slice(0, 45), // Truncate IP if too long
        user_agent: userAgent.slice(0, 500) // Truncate user agent if too long
      })

    if (logError) {
      console.error('Error logging page view:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      newViewCount: functionResult,
      message: 'View tracked successfully'
    })

  } catch (error) {
    console.error('Error in track-view API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint to prevent Supabase auto-pause
export async function GET() {
  try {
    // Simple query to keep database active
    const { error } = await supabase
      .from('news')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Health check error:', error)
      return NextResponse.json(
        { status: 'error', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'Database connection active'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { status: 'error', error: 'Database connection failed' },
      { status: 500 }
    )
  }
}