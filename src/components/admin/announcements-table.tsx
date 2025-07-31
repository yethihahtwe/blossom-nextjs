'use client'

import { useState, useEffect } from 'react'
import { announcementsService } from '@/lib/services/announcements.service'
import { type Announcement } from '@/lib/supabase'
import { Priority } from '@/lib/types/content'
import { StorageService } from '@/lib/storage'
import { DateFormatter } from '@/lib/utils/date-formatter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { Editor } from '@/components/ui/editor'
import { Label } from '@/components/ui/label'
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
import { CalendarIcon, Search, Plus, Edit, Trash2, Eye, Filter, MoreHorizontal, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export function AnnouncementsTable() {
  // State management
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | ''>('')
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form states
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    priority: 'normal' as Priority,
    status: 'draft' as 'draft' | 'published',
    published_at: undefined as Date | undefined
  })
  
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    priority: 'normal' as Priority,
    status: 'draft' as 'draft' | 'published',
    published_at: undefined as Date | undefined
  })

  // Date picker states
  const [createDatePickerOpen, setCreateDatePickerOpen] = useState(false)
  const [editDatePickerOpen, setEditDatePickerOpen] = useState(false)

  // Load announcements
  useEffect(() => {
    loadAnnouncements()
  }, [])

  // Filter announcements
  useEffect(() => {
    let filtered = announcements

    if (searchQuery) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (priorityFilter) {
      filtered = filtered.filter(announcement => announcement.priority === priorityFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(announcement => announcement.status === statusFilter)
    }

    setFilteredAnnouncements(filtered)
  }, [announcements, searchQuery, priorityFilter, statusFilter])

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const data = await announcementsService.getAll()
      setAnnouncements(data)
    } catch (error) {
      console.error('Error loading announcements:', error)
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const resetCreateForm = () => {
    setCreateForm({
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      priority: 'normal',
      status: 'draft',
      published_at: undefined
    })
  }

  const handleCreateSubmit = async () => {
    if (!createForm.title.trim() || !createForm.content.trim() || !createForm.excerpt.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const announcementData = {
        ...createForm,
        published_at: createForm.published_at ? DateFormatter.toISOString(createForm.published_at) : undefined
      }

      const newAnnouncement = await announcementsService.create(announcementData)
      
      if (newAnnouncement) {
        setAnnouncements(prev => [newAnnouncement, ...prev])
        setCreateModalOpen(false)
        resetCreateForm()
        toast.success('Announcement created successfully!')
      } else {
        toast.error('Failed to create announcement')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      toast.error('Failed to create announcement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditSubmit = async () => {
    if (!selectedAnnouncement || !editForm.title.trim() || !editForm.content.trim() || !editForm.excerpt.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const updateData = {
        ...editForm,
        published_at: editForm.published_at ? DateFormatter.toISOString(editForm.published_at) : undefined
      }

      const updatedAnnouncement = await announcementsService.update(selectedAnnouncement.id, updateData)
      
      if (updatedAnnouncement) {
        setAnnouncements(prev => 
          prev.map(announcement => 
            announcement.id === selectedAnnouncement.id ? updatedAnnouncement : announcement
          )
        )
        setEditModalOpen(false)
        setSelectedAnnouncement(null)
        toast.success('Announcement updated successfully!')
      } else {
        toast.error('Failed to update announcement')
      }
    } catch (error) {
      console.error('Error updating announcement:', error)
      toast.error('Failed to update announcement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setViewModalOpen(true)
  }

  const handleDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedAnnouncement) return

    try {
      const success = await announcementsService.delete(selectedAnnouncement.id)
      
      if (success) {
        setAnnouncements(prev => prev.filter(item => item.id !== selectedAnnouncement.id))
        setDeleteDialogOpen(false)
        setSelectedAnnouncement(null)
        toast.success('Announcement deleted successfully!')
      } else {
        toast.error('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      toast.error('Failed to delete announcement')
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setEditForm({
      title: announcement.title,
      content: announcement.content,
      excerpt: announcement.excerpt,
      featured_image: announcement.featured_image || '',
      priority: announcement.priority,
      status: announcement.status,
      published_at: announcement.published_at ? new Date(announcement.published_at) : undefined
    })
    setEditModalOpen(true)
  }

  const handleImageUpload = async (file: File, isEdit: boolean = false) => {
    try {
      const imageUrl = await StorageService.uploadImage(file, 'announcements')
      if (imageUrl) {
        if (isEdit) {
          setEditForm(prev => ({ ...prev, featured_image: imageUrl }))
        } else {
          setCreateForm(prev => ({ ...prev, featured_image: imageUrl }))
        }
        toast.success('Image uploaded successfully!')
        return imageUrl
      } else {
        toast.error('Failed to upload image')
        return null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      return null
    }
  }

  const getPriorityBadge = (priority: Priority) => {
    const variants = {
      urgent: 'destructive',
      important: 'default',
      normal: 'secondary'
    } as const
    
    const colors = {
      urgent: 'bg-red-100 text-red-800 hover:bg-red-100',
      important: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      normal: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    }
    
    return (
      <Badge className={colors[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: 'draft' | 'published') => {
    return (
      <Badge variant={status === 'published' ? 'default' : 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Announcements</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage school announcements and notifications</p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
            className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'draft' | 'published' | '')}
            className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnnouncements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{announcement.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {announcement.excerpt}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getPriorityBadge(announcement.priority)}</TableCell>
                <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                <TableCell>
                  {announcement.published_at 
                    ? DateFormatter.formatDate(announcement.published_at)
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  {DateFormatter.formatDate(announcement.created_at)}
                </TableCell>
                <TableCell className="text-right">
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
                        onClick={() => handleView(announcement)}
                      >
                        <Eye className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm">View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel cursor-pointer transition-colors font-medium"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                      <DropdownMenuItem 
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 admin-panel cursor-pointer transition-colors font-medium"
                        onClick={() => handleDelete(announcement)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="text-sm">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No announcements found.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={createForm.title}
                onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter announcement title"
              />
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt *</label>
              <Textarea
                value={createForm.excerpt}
                onChange={(e) => setCreateForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary for notifications and listings"
                rows={3}
              />
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Publish Date</label>
              <Popover open={createDatePickerOpen} onOpenChange={setCreateDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !createForm.published_at && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {createForm.published_at ? (
                      DateFormatter.formatDate(createForm.published_at.toISOString())
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 admin-panel" data-admin-panel>
                  <Calendar
                    mode="single"
                    selected={createForm.published_at}
                    onSelect={(date) => {
                      setCreateForm(prev => ({ ...prev, published_at: date }))
                      setCreateDatePickerOpen(false)
                    }}
                    initialFocus
                    className="bg-white dark:bg-gray-800 admin-panel"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <ImageUpload
                value={createForm.featured_image}
                onChange={(url) => setCreateForm(prev => ({ ...prev, featured_image: url }))}
                onUpload={(file) => handleImageUpload(file, false)}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <Editor
                content={createForm.content}
                onChange={(content) => setCreateForm(prev => ({ ...prev, content }))}
                placeholder="Write the announcement content..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateModalOpen(false)
                  resetCreateForm()
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSubmit}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Announcement'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter announcement title"
              />
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt *</label>
              <Textarea
                value={editForm.excerpt}
                onChange={(e) => setEditForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary for notifications and listings"
                rows={3}
              />
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Publish Date</label>
              <Popover open={editDatePickerOpen} onOpenChange={setEditDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editForm.published_at && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editForm.published_at ? (
                      DateFormatter.formatDate(editForm.published_at.toISOString())
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 admin-panel" data-admin-panel>
                  <Calendar
                    mode="single"
                    selected={editForm.published_at}
                    onSelect={(date) => {
                      setEditForm(prev => ({ ...prev, published_at: date }))
                      setEditDatePickerOpen(false)
                    }}
                    initialFocus
                    className="bg-white dark:bg-gray-800 admin-panel"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <ImageUpload
                value={editForm.featured_image}
                onChange={(url) => setEditForm(prev => ({ ...prev, featured_image: url }))}
                onUpload={(file) => handleImageUpload(file, true)}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <Editor
                content={editForm.content}
                onChange={(content) => setEditForm(prev => ({ ...prev, content }))}
                placeholder="Write the announcement content..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditModalOpen(false)
                  setSelectedAnnouncement(null)
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">
              View Announcement
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Full details of the selected announcement.
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-6 admin-panel">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Title</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedAnnouncement.title}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excerpt</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedAnnouncement.excerpt || 'No excerpt available.'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content</h3>
                <div 
                  className="prose dark:prose-invert max-w-none text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-700 px-4 py-4 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Priority</h3>
                  <div>{getPriorityBadge(selectedAnnouncement.priority)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Status</h3>
                  <div>{getStatusBadge(selectedAnnouncement.status)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Published Date</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedAnnouncement.published_at 
                      ? DateFormatter.formatDate(selectedAnnouncement.published_at)
                      : 'Not published'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Created</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {DateFormatter.formatDate(selectedAnnouncement.created_at)}
                  </p>
                </div>
              </div>

              {selectedAnnouncement.featured_image && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Featured Image</h3>
                  <img 
                    src={selectedAnnouncement.featured_image} 
                    alt={selectedAnnouncement.title}
                    className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setViewModalOpen(false)}
              className="admin-panel"
            >
              Close
            </Button>
            {selectedAnnouncement && (
              <Button 
                onClick={() => {
                  setViewModalOpen(false)
                  handleEdit(selectedAnnouncement)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white admin-panel"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Announcement
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 admin-panel">
              <AlertTriangle className="h-5 w-5" />
              Delete Announcement
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Are you sure you want to delete this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="admin-panel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white admin-panel"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Announcement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}