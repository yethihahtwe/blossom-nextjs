'use client'

import { useState, useEffect, useMemo } from 'react'
import { getPublishedNews, type News } from '@/lib/news'
import { getPublishedAnnouncements, type Announcement } from '@/lib/announcements'

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  type: 'news' | 'announcement'
  published_at: string
  status: string
  priority?: string
  url: string
}

export function useAdminSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allNews, setAllNews] = useState<News[]>([])
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([])

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [news, announcements] = await Promise.all([
          getPublishedNews(),
          getPublishedAnnouncements()
        ])
        setAllNews(news)
        setAllAnnouncements(announcements)
      } catch (error) {
        console.error('Error loading search data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Search results computation
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Search news articles
    allNews.forEach((article) => {
      if (
        article.title.toLowerCase().includes(query) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(query))
      ) {
        results.push({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt || '',
          type: 'news',
          published_at: article.published_at || '',
          status: article.status,
          url: `/admin/news/${article.id}`
        })
      }
    })

    // Search announcements
    allAnnouncements.forEach((announcement) => {
      if (
        announcement.title.toLowerCase().includes(query) ||
        (announcement.excerpt && announcement.excerpt.toLowerCase().includes(query))
      ) {
        results.push({
          id: announcement.id,
          title: announcement.title,
          excerpt: announcement.excerpt || '',
          type: 'announcement',
          published_at: announcement.published_at || '',
          status: announcement.status,
          priority: announcement.priority,
          url: `/admin/announcements/${announcement.id}`
        })
      }
    })

    // Sort by published date (newest first)
    return results.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  }, [searchQuery, allNews, allAnnouncements])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsOpen(query.length > 0)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsOpen(false)
  }

  return {
    searchQuery,
    searchResults,
    isOpen,
    loading,
    handleSearch,
    clearSearch,
    setIsOpen
  }
}