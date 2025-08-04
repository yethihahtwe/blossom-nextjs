'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Search, Plus, Edit, Trash2, MoreHorizontal, AlertTriangle, Mail, Shield, User as UserIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminUser extends User {
  role?: 'admin' | 'editor' | 'viewer'
  last_sign_in?: string
  created_at?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form states
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer'
  })
  
  const [editForm, setEditForm] = useState({
    role: 'viewer' as 'admin' | 'editor' | 'viewer'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      
      // Call API route to get users
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Error loading users:', data.error)
        toast.error(data.error || 'Failed to load users')
        return
      }
      
      setUsers(data.users)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.password) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      // Call API route to create user
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: createForm.email,
          password: createForm.password,
          role: createForm.role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error creating user:', data.error)
        toast.error(data.error || 'Failed to create user')
        return
      }

      setCreateModalOpen(false)
      setCreateForm({ email: '', password: '', role: 'viewer' })
      toast.success('User created successfully!')
      loadUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    setIsSaving(true)
    try {
      // Call API route to update user
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: editForm.role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error updating user:', data.error)
        toast.error(data.error || 'Failed to update user')
        return
      }

      setEditModalOpen(false)
      setSelectedUser(null)
      toast.success('User updated successfully!')
      loadUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      // Call API route to delete user
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error deleting user:', data.error)
        toast.error(data.error || 'Failed to delete user')
        return
      }

      setDeleteDialogOpen(false)
      setSelectedUser(null)
      toast.success('User deleted successfully!')
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user)
    setEditForm({
      role: user.role || 'viewer'
    })
    setEditModalOpen(true)
  }

  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-red-100 text-red-800 hover:bg-red-100',
      editor: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      viewer: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    }
    
    return (
      <Badge className={variants[role as keyof typeof variants] || variants.viewer}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage admin panel users and permissions</p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 p-6 space-y-4">
        {/* Search Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Search on the left */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 admin-panel"
            />
          </div>
        </div>

        {/* Active Filters Section - Always Reserved Space */}
        <div className="min-h-[2.5rem] flex items-center">
          {searchQuery ? (
            <div className="flex items-center gap-2 flex-wrap w-full">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">Active filters:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 admin-panel font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer group"
                  onClick={() => setSearchQuery('')}
                >
                  <span className="text-xs">Search: {searchQuery}</span>
                  <X className="ml-1 h-3 w-3 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors" />
                </Badge>
              </div>
            </div>
          ) : (
            <div className="w-full h-10 flex items-center">
              <span className="text-sm text-gray-400 dark:text-gray-500 font-normal italic">No active filters</span>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-6">User</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4">Role</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4">Last Sign In</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4">Created</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <TableCell className="font-medium py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white font-semibold">{user.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">{getRoleBadge(user.role || 'viewer')}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-4">{formatDate(user.last_sign_in_at)}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-4">{formatDate(user.created_at)}</TableCell>
                <TableCell className="text-right py-4 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600 admin-panel transition-colors"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 admin-panel shadow-lg"
                      data-admin-panel
                    >
                      <DropdownMenuItem 
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel cursor-pointer transition-colors font-medium"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm">Edit Role</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                      <DropdownMenuItem 
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 admin-panel cursor-pointer transition-colors font-medium"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="text-sm">Delete User</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding your first admin user.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create User Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">Add New User</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Create a new admin panel user account with assigned role.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 admin-panel">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Email *</label>
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
                className="admin-panel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Password *</label>
              <Input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                className="admin-panel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Role</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'editor' | 'viewer' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white admin-panel text-sm md:text-sm"
              >
                <option value="viewer">Viewer - Read only access</option>
                <option value="editor">Editor - Can create and edit content</option>
                <option value="admin">Admin - Full access</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              disabled={isSaving}
              className="admin-panel disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white admin-panel disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">Edit User Role</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Update the role and permissions for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 admin-panel">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'editor' | 'viewer' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white admin-panel text-sm md:text-sm"
              >
                <option value="viewer">Viewer - Read only access</option>
                <option value="editor">Editor - Can create and edit content</option>
                <option value="admin">Admin - Full access</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={isSaving}
              className="admin-panel disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white admin-panel disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 admin-panel">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Are you sure you want to delete {selectedUser?.email}? This action cannot be undone and will permanently remove their access to the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="admin-panel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white admin-panel"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}