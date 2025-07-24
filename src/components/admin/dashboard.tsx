'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Megaphone, Users, Eye } from 'lucide-react'
import { getPublishedNews } from '@/lib/news'
import { getPublishedAnnouncements } from '@/lib/announcements'

interface DashboardStats {
  totalNews: number
  totalAnnouncements: number
  urgentAnnouncements: number
  totalViews: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalAnnouncements: 0,
    urgentAnnouncements: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [news, announcements] = await Promise.all([
          getPublishedNews(),
          getPublishedAnnouncements()
        ])

        const urgentCount = announcements.filter(a => a.priority === 'urgent').length

        setStats({
          totalNews: news.length,
          totalAnnouncements: announcements.length,
          urgentAnnouncements: urgentCount,
          totalViews: 12500 // Mock data for now
        })
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
            <CardTitle>Recent News</CardTitle>
            <CardDescription>Latest published news articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">Latest School Updates</p>
                  <p className="text-xs text-gray-500">Published 2 hours ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Published</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">New Programs Available</p>
                  <p className="text-xs text-gray-500">Published 1 day ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Published</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest published announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">Emergency School Closure</p>
                  <p className="text-xs text-gray-500">Published 1 hour ago</p>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Urgent</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">Parent-Teacher Meeting</p>
                  <p className="text-xs text-gray-500">Published 3 hours ago</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Important</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}