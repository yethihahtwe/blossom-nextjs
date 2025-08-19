'use client'

import { useState, useEffect } from 'react'
import { SliderImage } from '@/lib/slider'
import Image from 'next/image'
import { ImageUpload } from '@/components/ui/image-upload'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  Images as ImagesIcon,
  X,
  AlertTriangle,
  Loader2,
  GripVertical
} from 'lucide-react'

export function SliderTable() {
  const [images, setImages] = useState<SliderImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<SliderImage | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [editForm, setEditForm] = useState({
    title: '',
    alt_text: '',
    image_url: '',
    is_active: true
  })

  const [createForm, setCreateForm] = useState({
    title: '',
    alt_text: '',
    image_url: '',
    is_active: true
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/slider')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        toast.error('Failed to fetch slider images')
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to fetch slider images')
    } finally {
      setLoading(false)
    }
  }

  // Filtering logic
  const filteredImages = images.filter(image => {
    const matchesSearch = searchQuery === '' || 
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.alt_text.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  // Action handlers
  const handleView = (image: SliderImage) => {
    setSelectedImage(image)
    setViewModalOpen(true)
  }

  const handleEdit = (image: SliderImage) => {
    setSelectedImage(image)
    setEditForm({
      title: image.title,
      alt_text: image.alt_text,
      image_url: image.image_url,
      is_active: image.is_active
    })
    setEditModalOpen(true)
  }

  const handleDelete = (image: SliderImage) => {
    setSelectedImage(image)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedImage) return
    
    try {
      const response = await fetch(`/api/admin/slider/${selectedImage.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setImages(prev => prev.filter(item => item.id !== selectedImage.id))
        setDeleteDialogOpen(false)
        setSelectedImage(null)
        toast.success('Image deleted successfully!')
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  const handleCreateSubmit = async () => {
    if (!createForm.title || !createForm.alt_text || !createForm.image_url) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/slider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createForm,
          display_order: images.length + 1
        }),
      })

      if (response.ok) {
        const newImage = await response.json()
        setImages(prev => [...prev, newImage])
        setCreateModalOpen(false)
        setCreateForm({
          title: '',
          alt_text: '',
          image_url: '',
          is_active: true
        })
        toast.success('Image created successfully!')
      } else {
        toast.error('Failed to create image')
      }
    } catch (error) {
      console.error('Error creating image:', error)
      toast.error('Failed to create image')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditSubmit = async () => {
    if (!selectedImage) return

    if (!editForm.title || !editForm.alt_text || !editForm.image_url) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/slider/${selectedImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const updatedImage = await response.json()
        setImages(prev => prev.map(item => 
          item.id === selectedImage.id ? updatedImage : item
        ))
        setEditModalOpen(false)
        setSelectedImage(null)
        toast.success('Image updated successfully!')
      } else {
        toast.error('Failed to update image')
      }
    } catch (error) {
      console.error('Error updating image:', error)
      toast.error('Failed to update image')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const reorderedImages = Array.from(filteredImages)
    const [reorderedItem] = reorderedImages.splice(result.source.index, 1)
    reorderedImages.splice(result.destination.index, 0, reorderedItem)

    // Update local state optimistically
    setImages(prev => {
      const newImages = [...prev]
      const sourceItem = newImages.find(img => img.id === reorderedItem.id)
      if (sourceItem) {
        // Update display_order for all affected items
        reorderedImages.forEach((img, index) => {
          const item = newImages.find(i => i.id === img.id)
          if (item) {
            item.display_order = index + 1
          }
        })
      }
      return newImages.sort((a, b) => a.display_order - b.display_order)
    })

    try {
      await fetch('/api/admin/slider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reorder',
          imageIds: reorderedImages.map(img => img.id)
        }),
      })
    } catch (error) {
      console.error('Error reordering images:', error)
      toast.error('Failed to reorder images')
      // Refresh data on error
      fetchImages()
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={isActive 
        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
        : 'bg-red-100 text-red-800 hover:bg-red-100'
      }>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Slider Management</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading slider images...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Slider Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage homepage slider images and their order</p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Image
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 p-6 space-y-4">
        {/* Search Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 admin-panel"
            />
          </div>
        </div>

        {/* Active Filters Section */}
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

      {/* Slider Images Table */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Slider Images</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Drag and drop to reorder images</p>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="slider-images">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredImages.map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border-b border-gray-200 dark:border-gray-600 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                            snapshot.isDragging ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab flex-shrink-0"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={image.image_url}
                              alt={image.alt_text}
                              fill
                              className="object-cover rounded border border-gray-200 dark:border-gray-600"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{image.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{image.alt_text}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(image.is_active)}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Order: {image.display_order}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
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
                              >
                                <DropdownMenuItem 
                                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel cursor-pointer transition-colors font-medium"
                                  onClick={() => handleView(image)}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm">View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel cursor-pointer transition-colors font-medium"
                                  onClick={() => handleEdit(image)}
                                >
                                  <Edit className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm">Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                                <DropdownMenuItem 
                                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 admin-panel cursor-pointer transition-colors font-medium"
                                  onClick={() => handleDelete(image)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span className="text-sm">Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <ImagesIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No images found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding your first slider image.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 admin-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">
              View Slider Image
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Image details and preview
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4 py-4 admin-panel">
              <div className="relative w-full h-64">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.alt_text}
                  fill
                  className="object-cover rounded border border-gray-200 dark:border-gray-600"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Title</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedImage.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Alt Text</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedImage.alt_text}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedImage.is_active)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Display Order</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedImage.display_order}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Created</Label>
                  <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedImage.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Updated</Label>
                  <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedImage.updated_at)}</p>
                </div>
              </div>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 admin-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">
              Add New Slider Image
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Create a new slider image for the homepage
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 admin-panel">
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Title *</Label>
              <Input
                value={createForm.title}
                onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter image title"
                className="admin-panel"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Alt Text *</Label>
              <Input
                value={createForm.alt_text}
                onChange={(e) => setCreateForm(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Enter alt text for accessibility"
                className="admin-panel"
              />
            </div>
            
            <div>
              <ImageUpload
                label="Slider Image *"
                value={createForm.image_url}
                onChange={(url) => setCreateForm(prev => ({ ...prev, image_url: url }))}
                folder="slider"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-is-active"
                checked={createForm.is_active}
                onCheckedChange={(checked) => 
                  setCreateForm(prev => ({ ...prev, is_active: checked as boolean }))
                }
                className="admin-panel"
              />
              <Label htmlFor="create-is-active" className="text-sm font-medium text-gray-900 dark:text-white">
                Active
              </Label>
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
              onClick={handleCreateSubmit}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white admin-panel disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 admin-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">
              Edit Slider Image
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Update slider image details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 admin-panel">
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Title *</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter image title"
                className="admin-panel"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Alt Text *</Label>
              <Input
                value={editForm.alt_text}
                onChange={(e) => setEditForm(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Enter alt text for accessibility"
                className="admin-panel"
              />
            </div>
            
            <div>
              <ImageUpload
                label="Slider Image *"
                value={editForm.image_url}
                onChange={(url) => setEditForm(prev => ({ ...prev, image_url: url }))}
                folder="slider"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is-active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => 
                  setEditForm(prev => ({ ...prev, is_active: checked as boolean }))
                }
                className="admin-panel"
              />
              <Label htmlFor="edit-is-active" className="text-sm font-medium text-gray-900 dark:text-white">
                Active
              </Label>
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
              onClick={handleEditSubmit}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white admin-panel disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 admin-panel">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 admin-panel">
              <AlertTriangle className="h-5 w-5" />
              Delete Slider Image
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Are you sure you want to delete "{selectedImage?.title}"? This action cannot be undone and will remove the image from the homepage slider.
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
              Delete Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}