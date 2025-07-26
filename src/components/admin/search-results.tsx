'use client'

import { useRouter } from 'next/navigation'
import { FileText, Megaphone, Clock, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type SearchResult } from '@/hooks/useAdminSearch'

interface SearchResultsProps {
  results: SearchResult[]
  isOpen: boolean
  onClose: () => void
  query: string
}

export function SearchResults({ results, isOpen, onClose, query }: SearchResultsProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleResultClick = (result: SearchResult) => {
    // For now, navigate to the respective management page since individual pages don't exist yet
    if (result.type === 'news') {
      router.push('/admin/news')
    } else {
      router.push('/admin/announcements')
    }
    onClose()
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      case 'important':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      default:
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'news' ? FileText : Megaphone
  }

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1">
      <Card className="max-h-96 overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Search Results for "{query}"
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <FileText className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try searching for news articles or announcements
                </p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result) => {
                  const Icon = getTypeIcon(result.type)
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {result.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {result.type}
                            </Badge>
                            {result.priority && (
                              <Badge className={`text-xs ${getPriorityColor(result.priority)}`}>
                                {result.priority}
                              </Badge>
                            )}
                          </div>
                          {result.excerpt && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                              {result.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(result.published_at).toLocaleDateString()}
                            </div>
                            <span className="capitalize">{result.status}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}