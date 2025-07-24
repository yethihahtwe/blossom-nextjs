import { Card, CardContent } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure application settings</p>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Settings</h3>
          <p className="text-gray-600">
            Settings panel will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}