'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-react'
import { getViewStats, getTopContent } from '@/lib/analytics'

export default function AnalyticsPage() {
  const [viewStats, setViewStats] = useState<unknown>(null)
  const [topContent, setTopContent] = useState<unknown[]>([])
  // const [recentTrends, setRecentTrends] = useState<any[]>([])
  // const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  // const [news, setNews] = useState<any[]>([])
  // const [announcements, setAnnouncements] = useState<any[]>([])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, topData] = await Promise.all([
        getViewStats(),
        getTopContent(5)
      ])
      
      setViewStats(statsData)
      setTopContent(topData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // const testViewTracking = async () => {
  //   if (news.length === 0 && announcements.length === 0) {
  //     alert('No content available to test with!')
  //     return
  //   }
  //   // ... implementation
  // }

  // const testHealthCheck = async () => {
  //   try {
  //     const response = await fetch('/api/track-view')
  //     const result = await response.json()
  //     alert(`Health Check: ${result.status} - ${result.message || 'Success'}`)
  //   } catch (error) {
  //     alert(`Health Check Failed: ${error.message}`)
  //   }
  // }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300">View tracking and content performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* View Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">View Statistics</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">Current analytics overview</CardDescription>
        </CardHeader>
        <CardContent>
          {viewStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{viewStats.totalViews}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Views</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{viewStats.newsViews}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">News Views</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{viewStats.announcementViews}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Announcement Views</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{viewStats.avgViewsPerNews}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Avg Views/News</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {loading ? 'Loading analytics...' : 'No analytics data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Test Results</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">View tracking test outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{result.type}: {result.title}</p>
                    {result.success ? (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        New view count: {result.result?.newViewCount || 'Unknown'}
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Error: {result.error || 'Failed to track view'}
                      </p>
                    )}
                  </div>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Top Viewed Content</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">Most popular articles and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          {topContent.length > 0 ? (
            <div className="space-y-3">
              {topContent.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(item.published_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{item.type}</Badge>
                    <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {item.view_count} views
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No viewed content yet. Run some tests to generate data!
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  )
}