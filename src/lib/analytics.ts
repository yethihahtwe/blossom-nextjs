import { supabase } from './supabase'

export interface ViewStats {
  totalViews: number
  newsViews: number
  announcementViews: number
  totalNewsArticles: number
  totalAnnouncements: number
  avgViewsPerNews: number
  avgViewsPerAnnouncement: number
}

export interface TopContent {
  id: string
  title: string
  type: 'news' | 'announcement'
  view_count: number
  published_at: string
}

export interface ViewAnalytics {
  stats: ViewStats
  topContent: TopContent[]
  recentViews: {
    date: string
    views: number
  }[]
}

/**
 * Get comprehensive view statistics
 */
export async function getViewStats(): Promise<ViewStats> {
  try {
    // Get total view counts using the analytics view
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics_summary')
      .select('metric, value')

    if (analyticsError) {
      console.error('Error fetching analytics summary:', analyticsError)
      throw analyticsError
    }

    // Parse analytics data
    const analytics = analyticsData?.reduce((acc, item) => {
      acc[item.metric] = item.value
      return acc
    }, {} as Record<string, number>) || {}

    // Get article counts
    const { data: newsCount, error: newsError } = await supabase
      .from('news')
      .select('id', { count: 'exact' })
      .eq('status', 'published')

    const { data: announcementCount, error: announcementError } = await supabase
      .from('announcements')
      .select('id', { count: 'exact' })
      .eq('status', 'published')

    if (newsError || announcementError) {
      console.error('Error fetching content counts:', newsError || announcementError)
    }

    const totalNewsArticles = newsCount?.length || 0
    const totalAnnouncements = announcementCount?.length || 0
    const newsViews = analytics['News Views'] || 0
    const announcementViews = analytics['Announcement Views'] || 0

    return {
      totalViews: analytics['Total Views'] || 0,
      newsViews,
      announcementViews,
      totalNewsArticles,
      totalAnnouncements,
      avgViewsPerNews: totalNewsArticles > 0 ? Math.round(newsViews / totalNewsArticles) : 0,
      avgViewsPerAnnouncement: totalAnnouncements > 0 ? Math.round(announcementViews / totalAnnouncements) : 0
    }
  } catch (error) {
    console.error('Error getting view stats:', error)
    throw error
  }
}

/**
 * Get top viewed content
 */
export async function getTopContent(limit: number = 5): Promise<TopContent[]> {
  try {
    // Get top news articles
    const { data: topNews, error: newsError } = await supabase
      .from('news')
      .select('id, title, view_count, published_at')
      .eq('status', 'published')
      .gt('view_count', 0)
      .order('view_count', { ascending: false })
      .limit(limit)

    // Get top announcements
    const { data: topAnnouncements, error: announcementError } = await supabase
      .from('announcements')
      .select('id, title, view_count, published_at')
      .eq('status', 'published')
      .gt('view_count', 0)
      .order('view_count', { ascending: false })
      .limit(limit)

    if (newsError || announcementError) {
      console.error('Error fetching top content:', newsError || announcementError)
    }

    // Combine and sort by view count
    const combinedContent: TopContent[] = [
      ...(topNews || []).map(item => ({ ...item, type: 'news' as const })),
      ...(topAnnouncements || []).map(item => ({ ...item, type: 'announcement' as const }))
    ]

    return combinedContent
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting top content:', error)
    throw error
  }
}

/**
 * Get recent view trends (last 7 days)
 */
export async function getRecentViewTrends(): Promise<{ date: string; views: number }[]> {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('viewed_at')
      .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('viewed_at', { ascending: true })

    if (error) {
      console.error('Error fetching view trends:', error)
      return []
    }

    // Group by date
    const viewsByDate = (data || []).reduce((acc, view) => {
      const date = new Date(view.viewed_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert to array format
    return Object.entries(viewsByDate).map(([date, views]) => ({ date, views }))
  } catch (error) {
    console.error('Error getting view trends:', error)
    return []
  }
}

/**
 * Get comprehensive analytics
 */
export async function getAnalytics(): Promise<ViewAnalytics> {
  try {
    const [stats, topContent, recentViews] = await Promise.all([
      getViewStats(),
      getTopContent(10),
      getRecentViewTrends()
    ])

    return {
      stats,
      topContent,
      recentViews
    }
  } catch (error) {
    console.error('Error getting analytics:', error)
    throw error
  }
}