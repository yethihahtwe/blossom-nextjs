'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  FileText, 
  Filter, 
  Calendar as CalendarIcon,
  X,
  ChevronDown,
  AlertTriangle
} from 'lucide-react'
import { getPublishedNews, type News } from '@/lib/news'
import { format } from 'date-fns'

const ITEMS_PER_PAGE = 10

// Mock categories - replace with actual API call
const mockCategories = [
  { id: '1', name: 'School Events' },
  { id: '2', name: 'Academic News' },
  { id: '3', name: 'Sports & Activities' },
  { id: '4', name: 'Announcements' },
  { id: '5', name: 'Alumni News' }
]

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export function NewsTable() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false)
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<News | null>(null)
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  })

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getPublishedNews()
        setNews(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Advanced filtering logic
  const filteredNews = news.filter(article => {
    // Text search filter
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Category filter (mock implementation - in real app, you'd have article.category)
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(categoryId => {
        // Mock: randomly assign categories for demo
        const mockCategoryId = (parseInt(article.id) % mockCategories.length + 1).toString()
        return categoryId === mockCategoryId
      })
    
    // Date range filter
    const matchesDateRange = (!dateRange.from && !dateRange.to) || (() => {
      const articleDate = new Date(article.published_at)
      const fromDate = dateRange.from
      const toDate = dateRange.to
      
      if (fromDate && toDate) {
        return articleDate >= fromDate && articleDate <= toDate
      } else if (fromDate) {
        return articleDate >= fromDate
      } else if (toDate) {
        return articleDate <= toDate
      }
      return true
    })()
    
    return matchesSearch && matchesCategory && matchesDateRange
  })

  // Filter helper functions
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleDateRangeSelect = (range: DateRange) => {
    setDateRange(range)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setDateRange({ from: undefined, to: undefined })
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Action handlers
  const handleView = (article: News) => {
    setSelectedArticle(article)
    setViewModalOpen(true)
  }

  const handleEdit = (article: News) => {
    setSelectedArticle(article)
    setEditForm({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      status: article.status as 'draft' | 'published' | 'archived'
    })
    setEditModalOpen(true)
  }

  const handleDelete = (article: News) => {
    setSelectedArticle(article)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedArticle) return
    
    try {
      // TODO: Implement actual delete API call
      // await deleteNews(selectedArticle.id)
      
      // For now, remove from local state
      setNews(prev => prev.filter(item => item.id !== selectedArticle.id))
      setDeleteDialogOpen(false)
      setSelectedArticle(null)
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedArticle) return
    
    try {
      // TODO: Implement actual update API call
      // await updateNews(selectedArticle.id, editForm)
      
      // For now, update local state
      setNews(prev => prev.map(item => 
        item.id === selectedArticle.id 
          ? { ...item, ...editForm, updated_at: new Date().toISOString() }
          : item
      ))
      setEditModalOpen(false)
      setSelectedArticle(null)
    } catch (error) {
      console.error('Error updating article:', error)
    }
  }

  const hasActiveFilters = selectedCategories.length > 0 || dateRange.from || dateRange.to || searchQuery

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Published</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Draft</Badge>
      case 'archived':
        return <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">News</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage school news articles</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">News</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage school news articles</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white dark:text-white">
          <Plus className="h-4 w-4 mr-2 text-white dark:text-white" />
          New Article
        </Button>
      </div>


      {/* News Table with Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          {/* Search and Filter Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 p-6 space-y-4">
            {/* Search Row */}
            <div className="flex items-center justify-between gap-4">
              {/* Search on the left */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 admin-panel"
                />
              </div>
              
              {/* Filters on the right */}
              <div className="flex items-center gap-2">
                {/* Category Filter */}
                <Popover open={isCategoryFilterOpen} onOpenChange={setIsCategoryFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel transition-colors ${selectedCategories.length > 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''}`}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Categories
                      {selectedCategories.length > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-600 text-white flex items-center justify-center">
                          {selectedCategories.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg admin-panel" align="end" data-admin-panel>
                    <div className="space-y-4">
                      <h4 className="admin-font-medium text-gray-900 dark:text-white admin-text-base">Filter by Category</h4>
                      <div className="space-y-2">
                        {mockCategories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryToggle(category.id)}
                            />
                            <Label 
                              htmlFor={category.id}
                              className="admin-text-sm text-gray-700 dark:text-gray-300 cursor-pointer admin-font-normal"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedCategories.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedCategories([])}
                          className="w-full admin-panel"
                        >
                          Clear Categories
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Date Filter */}
                <Popover open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline"
                      className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel transition-colors ${(dateRange.from || dateRange.to) ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600' : ''}`}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Date Range
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg admin-panel" align="end" data-admin-panel>
                    <div className="p-3 space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">Select Date Range</h4>
                      <Calendar
                        mode="range"
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => {
                          if (range) {
                            handleDateRangeSelect({ from: range.from, to: range.to })
                          }
                        }}
                        numberOfMonths={1}
                        className="bg-white dark:bg-gray-800 admin-panel"
                      />
                      {(dateRange.from || dateRange.to) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setDateRange({ from: undefined, to: undefined })}
                          className="w-full admin-panel text-xs h-7"
                        >
                          Clear Date Range
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Active Filters Section - Always Reserved Space */}
            <div className="min-h-[2.5rem] flex items-center">
              {hasActiveFilters ? (
                <div className="flex items-center gap-2 flex-wrap w-full">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">Active filters:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {searchQuery && (
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 admin-panel admin-font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer group"
                        onClick={() => setSearchQuery('')}
                      >
                        <span className="text-xs">Search: {searchQuery}</span>
                        <X className="ml-1 h-3 w-3 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors" />
                      </Badge>
                    )}
                    {selectedCategories.map(categoryId => {
                      const category = mockCategories.find(c => c.id === categoryId)
                      return (
                        <Badge 
                          key={categoryId} 
                          variant="secondary" 
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 admin-panel admin-font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors cursor-pointer group"
                          onClick={() => handleCategoryToggle(categoryId)}
                        >
                          <span className="text-xs">{category?.name}</span>
                          <X className="ml-1 h-3 w-3 group-hover:text-green-900 dark:group-hover:text-green-100 transition-colors" />
                        </Badge>
                      )
                    })}
                    {(dateRange.from || dateRange.to) && (
                      <Badge 
                        variant="secondary" 
                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700 admin-panel admin-font-medium hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors cursor-pointer group"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                      >
                        <span className="text-xs">
                          Date: {dateRange.from ? format(dateRange.from, 'MMM dd') : '...'} - {dateRange.to ? format(dateRange.to, 'MMM dd') : '...'}
                        </span>
                        <X className="ml-1 h-3 w-3 group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors" />
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 admin-panel font-medium text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ml-auto"
                  >
                    Clear all
                  </Button>
                </div>
              ) : (
                <div className="w-full h-10 flex items-center">
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-normal italic">No active filters</span>
                </div>
              )}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-6">Title</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4">Published Date</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4">Status</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4">Views</TableHead>
                <TableHead className="text-gray-900 dark:text-white font-bold py-4 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNews.map((article) => (
                <TableRow key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <TableCell className="font-medium py-4 px-6">
                    <div className="max-w-md">
                      <h4 className="text-gray-900 dark:text-white font-semibold truncate">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm truncate mt-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-4">
                    {formatDate(article.published_at)}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    {getStatusBadge(article.status)}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-4">
                    {article.view_count || 0}
                  </TableCell>
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
                          onClick={() => handleView(article)}
                        >
                          <Eye className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm">View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel cursor-pointer transition-colors font-medium"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                        <DropdownMenuItem 
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 admin-panel cursor-pointer transition-colors font-medium"
                          onClick={() => handleDelete(article)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredNews.length)} of {filteredNews.length} results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Show pagination info even when only one page */}
          {totalPages === 1 && filteredNews.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredNews.length} of {filteredNews.length} results
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No news articles found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first news article.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">
              View Article
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Full details of the selected news article.
            </DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-6 admin-panel">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Title</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedArticle.title}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excerpt</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedArticle.excerpt || 'No excerpt available.'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedArticle.content}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Status</h3>
                  <div>{getStatusBadge(selectedArticle.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Views</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedArticle.view_count || 0}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Published Date</h3>
                  <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedArticle.published_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Last Updated</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedArticle.updated_at ? formatDate(selectedArticle.updated_at) : 'Never'}
                  </p>
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
            {selectedArticle && (
              <Button 
                onClick={() => {
                  setViewModalOpen(false)
                  handleEdit(selectedArticle)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white admin-panel"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Article
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">
              Edit Article
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Make changes to the article. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 admin-panel">
            <div>
              <Label htmlFor="edit-title" className="text-sm font-medium text-gray-900 dark:text-white">
                Title
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 admin-panel"
                placeholder="Enter article title..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-excerpt" className="text-sm font-medium text-gray-900 dark:text-white">
                Excerpt
              </Label>
              <Textarea
                id="edit-excerpt"
                value={editForm.excerpt}
                onChange={(e) => setEditForm(prev => ({ ...prev, excerpt: e.target.value }))}
                className="mt-1 admin-panel"
                placeholder="Enter article excerpt..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-content" className="text-sm font-medium text-gray-900 dark:text-white">
                Content
              </Label>
              <Textarea
                id="edit-content"
                value={editForm.content}
                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                className="mt-1 admin-panel"
                placeholder="Enter article content..."
                rows={10}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-status" className="text-sm font-medium text-gray-900 dark:text-white">
                Status
              </Label>
              <select
                id="edit-status"
                value={editForm.status}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white admin-panel"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEditModalOpen(false)}
              className="admin-panel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-green-600 hover:bg-green-700 text-white admin-panel"
            >
              <Edit className="h-4 w-4 mr-2" />
              Save Changes
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
              Delete Article
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              Are you sure you want to delete this article? This action cannot be undone.
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
              Delete Article
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}