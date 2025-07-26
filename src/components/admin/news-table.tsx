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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
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
  ChevronDown
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

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Search: {searchQuery}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </Badge>
          )}
          {selectedCategories.map(categoryId => {
            const category = mockCategories.find(c => c.id === categoryId)
            return (
              <Badge key={categoryId} variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                {category?.name}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleCategoryToggle(categoryId)} />
              </Badge>
            )
          })}
          {(dateRange.from || dateRange.to) && (
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              Date: {dateRange.from ? format(dateRange.from, 'MMM dd') : '...'} - {dateRange.to ? format(dateRange.to, 'MMM dd') : '...'}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setDateRange({ from: undefined, to: undefined })} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Clear all
          </Button>
        </div>
      )}

      {/* News Table with Integrated Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {/* Integrated Search and Filter Row */}
              <TableRow className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <TableHead colSpan={5} className="py-4 px-6">
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
                        className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    
                    {/* Filters on the right */}
                    <div className="flex items-center gap-2">
                      {/* Category Filter */}
                      <Popover open={isCategoryFilterOpen} onOpenChange={setIsCategoryFilterOpen}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedCategories.length > 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''}`}
                          >
                            <Filter className="h-4 w-4 mr-2" />
                            Categories
                            {selectedCategories.length > 0 && (
                              <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-600 text-white">
                                {selectedCategories.length}
                              </Badge>
                            )}
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" align="end">
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">Filter by Category</h4>
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
                                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
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
                                className="w-full"
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
                            className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${(dateRange.from || dateRange.to) ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600' : ''}`}
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Date Range
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" align="end">
                          <div className="p-4 space-y-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">Select Date Range</h4>
                            <Calendar
                              mode="range"
                              selected={{ from: dateRange.from, to: dateRange.to }}
                              onSelect={(range) => {
                                if (range) {
                                  handleDateRangeSelect({ from: range.from, to: range.to })
                                }
                              }}
                              numberOfMonths={1}
                              className="bg-white dark:bg-gray-800"
                            />
                            {(dateRange.from || dateRange.to) && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setDateRange({ from: undefined, to: undefined })}
                                className="w-full"
                              >
                                Clear Date Range
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </TableHead>
              </TableRow>
              
              {/* Column Headers */}
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
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 admin-panel"
                      >
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 admin-panel">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 admin-panel">
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
    </div>
  )
}