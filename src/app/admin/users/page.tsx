import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage user accounts and permissions</p>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Management</h3>
          <p className="text-gray-600 dark:text-gray-300">
            User management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}