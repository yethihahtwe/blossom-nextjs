'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Database, 
  FileText, 
  Image, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportProgress {
  step: string
  progress: number
  total: number
  isComplete: boolean
}

export function BackupExportSettings() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null)
  const [lastBackup, setLastBackup] = useState<string | null>(null)

  const exportData = async (type: 'news' | 'announcements' | 'all' | 'full-backup') => {
    setIsExporting(true)
    setExportProgress({ step: 'Initializing...', progress: 0, total: 100, isComplete: false })

    try {
      let data: any = {}
      let filename = ''
      let totalSteps = 1

      switch (type) {
        case 'news':
          setExportProgress({ step: 'Exporting news articles...', progress: 25, total: 100, isComplete: false })
          const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false })
          data = { news: newsData || [] }
          filename = `news-export-${new Date().toISOString().split('T')[0]}.json`
          break

        case 'announcements':
          setExportProgress({ step: 'Exporting announcements...', progress: 25, total: 100, isComplete: false })
          const { data: announcementsData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
          data = { announcements: announcementsData || [] }
          filename = `announcements-export-${new Date().toISOString().split('T')[0]}.json`
          break

        case 'all':
          totalSteps = 2
          setExportProgress({ step: 'Exporting news articles...', progress: 25, total: 100, isComplete: false })
          const { data: allNewsData } = await supabase.from('news').select('*').order('created_at', { ascending: false })
          
          setExportProgress({ step: 'Exporting announcements...', progress: 50, total: 100, isComplete: false })
          const { data: allAnnouncementsData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
          
          data = {
            news: allNewsData || [],
            announcements: allAnnouncementsData || []
          }
          filename = `content-export-${new Date().toISOString().split('T')[0]}.json`
          break

        case 'full-backup':
          totalSteps = 4
          setExportProgress({ step: 'Exporting news articles...', progress: 20, total: 100, isComplete: false })
          const { data: backupNewsData } = await supabase.from('news').select('*').order('created_at', { ascending: false })
          
          setExportProgress({ step: 'Exporting announcements...', progress: 40, total: 100, isComplete: false })
          const { data: backupAnnouncementsData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
          
          setExportProgress({ step: 'Exporting categories...', progress: 60, total: 100, isComplete: false })
          const { data: categoriesData } = await supabase.from('categories').select('*').order('name', { ascending: true })
          
          setExportProgress({ step: 'Exporting user profiles...', progress: 80, total: 100, isComplete: false })
          const { data: userProfilesData } = await supabase.from('user_profiles').select('id, role, created_at, updated_at').order('created_at', { ascending: false })
          
          data = {
            metadata: {
              exportDate: new Date().toISOString(),
              version: '1.0',
              type: 'full-backup'
            },
            news: backupNewsData || [],
            announcements: backupAnnouncementsData || [],
            categories: categoriesData || [],
            userProfiles: userProfilesData || []
          }
          filename = `full-backup-${new Date().toISOString().split('T')[0]}.json`
          break
      }

      setExportProgress({ step: 'Preparing download...', progress: 90, total: 100, isComplete: false })

      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportProgress({ step: 'Export complete!', progress: 100, total: 100, isComplete: true })
      setLastBackup(new Date().toLocaleString())
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`)

      // Reset progress after 2 seconds
      setTimeout(() => {
        setExportProgress(null)
      }, 2000)

    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
      setExportProgress(null)
    } finally {
      setIsExporting(false)
    }
  }

  const getDataStats = async () => {
    try {
      const [newsCount, announcementsCount, categoriesCount] = await Promise.all([
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('announcements').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true })
      ])

      return {
        news: newsCount.count || 0,
        announcements: announcementsCount.count || 0,
        categories: categoriesCount.count || 0
      }
    } catch (error) {
      return { news: 0, announcements: 0, categories: 0 }
    }
  }

  const [stats, setStats] = useState({ news: 0, announcements: 0, categories: 0 })

  // Load stats on component mount
  useState(() => {
    getDataStats().then(setStats)
  })

  return (
    <div className="space-y-6">
      {/* Export Progress */}
      {exportProgress && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              {exportProgress.isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              )}
              <span className="font-medium text-sm">{exportProgress.step}</span>
            </div>
            <Progress value={exportProgress.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {exportProgress.progress}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.news}</div>
              <div className="text-sm text-muted-foreground">News Articles</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.announcements}</div>
              <div className="text-sm text-muted-foreground">Announcements</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.categories}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Individual Exports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Individual Exports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => exportData('news')}
              disabled={isExporting}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm admin-panel"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export News Articles ({stats.news})
            </Button>
            
            <Button
              onClick={() => exportData('announcements')}
              disabled={isExporting}
              className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white border-orange-600 hover:border-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm admin-panel"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Export Announcements ({stats.announcements})
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Exports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Bulk Exports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => exportData('all')}
              disabled={isExporting}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Content
            </Button>
            
            <Button
              onClick={() => exportData('full-backup')}
              disabled={isExporting}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
            >
              <Database className="h-4 w-4 mr-2" />
              Full System Backup
              <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">
                Recommended
              </Badge>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backup Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Backup Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lastBackup && (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Last backup:</span>
                </div>
                <span className="text-sm text-muted-foreground">{lastBackup}</span>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                Backup Guidelines
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Regular backups are recommended weekly</li>
                <li>• Full System Backup includes all content and settings</li>
                <li>• Exported files are in JSON format for easy import</li>
                <li>• Store backups in a secure location</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}