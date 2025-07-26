import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { CategoriesManagement } from '@/components/admin/categories-management'

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

      {/* General Settings Placeholder */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">General Settings</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Additional settings will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}