'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, MoreHorizontal, Tag } from 'lucide-react'

interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}

// Mock data - replace with actual API calls
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'School Events',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Academic News',
    created_at: '2024-01-20T14:15:00Z',
    updated_at: '2024-02-01T09:20:00Z'
  },
  {
    id: '3',
    name: 'Sports & Activities',
    created_at: '2024-02-10T16:45:00Z',
    updated_at: '2024-02-10T16:45:00Z'
  }
]

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [loading, setLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '' })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreate = () => {
    if (!formData.name.trim()) return

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setCategories(prev => [...prev, newCategory])
    setFormData({ name: '' })
    setIsCreateOpen(false)
  }

  const handleEdit = () => {
    if (!selectedCategory || !formData.name.trim()) return

    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, name: formData.name.trim(), updated_at: new Date().toISOString() }
        : cat
    ))
    setFormData({ name: '' })
    setSelectedCategory(null)
    setIsEditOpen(false)
  }

  const handleDelete = () => {
    if (!selectedCategory) return

    setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id))
    setSelectedCategory(null)
    setIsDeleteOpen(false)
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setFormData({ name: category.name })
    setIsEditOpen(true)
  }

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">News Categories</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage categories for organizing news articles</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white dark:text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your news articles.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter category name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateOpen(false)
                  setFormData({ name: '' })
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">Category Name</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Created</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Last Updated</TableHead>
                <TableHead className="text-gray-900 dark:text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900 dark:text-white">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {formatDate(category.created_at)}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {formatDate(category.updated_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <DropdownMenuItem 
                          onClick={() => openEditDialog(category)}
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(category)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
      {categories.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your first category to start organizing your news articles.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="col-span-3"
                placeholder="Enter category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditOpen(false)
                setFormData({ name: '' })
                setSelectedCategory(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!formData.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteOpen(false)
                setSelectedCategory(null)
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}