import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { CategoriesManagement } from '@/components/admin/categories-management'
import { BackupExportSettings } from '@/components/admin/backup-export-settings'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Configure application settings</p>
      </div>

      {/* Categories Management */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriesManagement />
        </CardContent>
      </Card>

      {/* Backup & Export Settings */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Backup & Export Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BackupExportSettings />
        </CardContent>
      </Card>
    </div>
  )
}