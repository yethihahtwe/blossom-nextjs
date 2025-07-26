'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Megaphone, Users, Eye } from 'lucide-react'
import { getPublishedNews, type News } from '@/lib/news'
import { getPublishedAnnouncements, type Announcement } from '@/lib/announcements'
import { getViewStats } from '@/lib/analytics'

interface DashboardStats {
  totalNews: number
  totalAnnouncements: number
  urgentAnnouncements: number
  totalViews: number
}

function getPriorityColors(priority: string) {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case 'important':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    default:
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  }
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalAnnouncements: 0,
    urgentAnnouncements: 0,
    totalViews: 0
  })
  const [recentNews, setRecentNews] = useState<News[]>([])
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [news, announcements, viewStats] = await Promise.all([
          getPublishedNews(),
          getPublishedAnnouncements(),
          getViewStats()
        ])

        const urgentCount = announcements.filter(a => a.priority === 'urgent').length

        setStats({
          totalNews: news.length,
          totalAnnouncements: announcements.length,
          urgentAnnouncements: urgentCount,
          totalViews: viewStats.totalViews // Real view count from database
        })

        // Set recent news (latest 2 items)
        setRecentNews(news.slice(0, 2))
        
        // Set recent announcements (latest 2 items)
        setRecentAnnouncements(announcements.slice(0, 2))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total News',
      value: stats.totalNews,
      description: 'Published news articles',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Announcements',
      value: stats.totalAnnouncements,
      description: 'Published announcements',
      icon: Megaphone,
      color: 'text-green-600'
    },
    {
      title: 'Urgent Items',
      value: stats.urgentAnnouncements,
      description: 'Urgent announcements',
      icon: Users,
      color: 'text-red-600'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      description: 'Page views this month',
      icon: Eye,
      color: 'text-purple-600'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Blossom International School Admin Panel</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to Blossom International School Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent News</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Latest published news articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNews.length > 0 ? (
                recentNews.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{article.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Published {new Date(article.published_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {article.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No recent news articles found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Announcements</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Latest published announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{announcement.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Published {new Date(announcement.published_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColors(announcement.priority)}`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No recent announcements found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}