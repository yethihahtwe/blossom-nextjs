'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { announcementsService } from '@/lib/services/announcements.service'
import { type Announcement } from '@/lib/supabase'
import { DateFormatter } from '@/lib/utils/date-formatter'
import { X, AlertTriangle, Info, Bell } from 'lucide-react'

export function AnnouncementBanner() {
  const [notifications, setNotifications] = useState<Announcement[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
    
    // Load dismissed announcements from localStorage
    const dismissedIds = localStorage.getItem('dismissed-announcements')
    if (dismissedIds) {
      setDismissed(JSON.parse(dismissedIds))
    }
  }, [])

  const loadNotifications = async () => {
    try {
      const notificationAnnouncements = await announcementsService.getNotificationAnnouncements()
      setNotifications(notificationAnnouncements)
    } catch (error) {
      console.error('Error loading announcement notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = (announcementId: string) => {
    const newDismissed = [...dismissed, announcementId]
    setDismissed(newDismissed)
    localStorage.setItem('dismissed-announcements', JSON.stringify(newDismissed))
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'important':
        return <Bell className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          link: 'text-red-900 hover:text-red-700',
          button: 'text-red-600 hover:text-red-800'
        }
      case 'important':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          link: 'text-yellow-900 hover:text-yellow-700',
          button: 'text-yellow-600 hover:text-yellow-800'
        }
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          link: 'text-blue-900 hover:text-blue-700',
          button: 'text-blue-600 hover:text-blue-800'
        }
    }
  }

  if (loading) {
    return null // Don't show anything while loading
  }

  // Filter out dismissed notifications
  const visibleNotifications = notifications.filter(
    notification => !dismissed.includes(notification.id)
  )

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {visibleNotifications.map((announcement) => {
        const styles = getPriorityStyles(announcement.priority)
        
        return (
          <div
            key={announcement.id}
            className={`border-l-4 p-4 ${styles.bg} border-l-current`}
            role="alert"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  {getPriorityIcon(announcement.priority)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
                      {announcement.priority} Announcement
                    </span>
                    {announcement.published_at && (
                      <span className={`text-xs ${styles.text} opacity-75`}>
                        {DateFormatter.formatDate(announcement.published_at)}
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`text-sm font-medium ${styles.text} mb-1`}>
                    {announcement.title}
                  </h3>
                  
                  <p className={`text-sm ${styles.text} opacity-90 mb-2 line-clamp-2`}>
                    {announcement.excerpt}
                  </p>
                  
                  <Link
                    href={`/announcements/${announcement.slug}`}
                    className={`text-sm font-medium underline ${styles.link} hover:no-underline`}
                  >
                    Read full announcement →
                  </Link>
                </div>
              </div>
              
              <button
                onClick={() => handleDismiss(announcement.id)}
                className={`flex-shrink-0 ml-4 p-1 rounded-md ${styles.button} hover:bg-white hover:bg-opacity-20 transition-colors`}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Compact version for header
export function CompactAnnouncementBanner() {
  const [urgentAnnouncements, setUrgentAnnouncements] = useState<Announcement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    loadUrgentAnnouncements()
    
    // Load dismissed announcements from localStorage
    const dismissedIds = localStorage.getItem('dismissed-urgent-announcements')
    if (dismissedIds) {
      setDismissed(JSON.parse(dismissedIds))
    }
  }, [])

  // Auto-rotate announcements
  useEffect(() => {
    if (urgentAnnouncements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % urgentAnnouncements.length)
      }, 8000) // Change every 8 seconds

      return () => clearInterval(interval)
    }
  }, [urgentAnnouncements.length])

  const loadUrgentAnnouncements = async () => {
    try {
      const urgent = await announcementsService.getUrgentAnnouncements()
      setUrgentAnnouncements(urgent)
    } catch (error) {
      console.error('Error loading urgent announcements:', error)
    }
  }

  const handleDismiss = (announcementId: string) => {
    const newDismissed = [...dismissed, announcementId]
    setDismissed(newDismissed)
    localStorage.setItem('dismissed-urgent-announcements', JSON.stringify(newDismissed))
  }

  // Filter out dismissed announcements
  const visibleAnnouncements = urgentAnnouncements.filter(
    announcement => !dismissed.includes(announcement.id)
  )

  if (visibleAnnouncements.length === 0) {
    return null
  }

  const currentAnnouncement = visibleAnnouncements[currentIndex % visibleAnnouncements.length]

  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                <span className="font-semibold">URGENT:</span> {currentAnnouncement.title}
              </p>
            </div>
            <Link
              href={`/announcements/${currentAnnouncement.slug}`}
              className="text-sm font-medium underline hover:no-underline whitespace-nowrap"
            >
              Read more
            </Link>
          </div>
          
          <button
            onClick={() => handleDismiss(currentAnnouncement.id)}
            className="flex-shrink-0 ml-4 p-1 rounded-md hover:bg-red-700 transition-colors"
            aria-label="Dismiss urgent notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}