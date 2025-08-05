'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, ExternalLink, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { signOut } from '@/lib/auth'
import { DarkModeToggle } from '@/components/admin/dark-mode-toggle'
import { SearchResults } from '@/components/admin/search-results'
import { useAdminSearch } from '@/hooks/useAdminSearch'
// import { notificationsService } from '@/lib/services/notifications.service'
import type { Notification } from '@/lib/types/notification'
import { montserrat } from '@/app/admin/font'

export function AdminHeader() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showNotificationDetail, setShowNotificationDetail] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Search functionality
  const {
    searchQuery,
    searchResults,
    isOpen,
    // loading,
    handleSearch,
    clearSearch,
    setIsOpen
  } = useAdminSearch()

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsOpen])

  // Load notifications on component mount and set up polling
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      // Only poll if no modal is open and dropdown is closed to avoid disrupting user interactions
      if (!notificationsOpen && !showNotificationDetail) {
        loadUnreadCount()
        loadNotifications()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [notificationsOpen, showNotificationDetail])

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications?count=true')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications?markAllRead=true', {
        method: 'PATCH',
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
        setNotificationsOpen(false)
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        // Update unread count if the deleted notification was unread
        const deletedNotification = notifications.find(n => n.id === notificationId)
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        // Close detail modal if this notification was being viewed
        if (selectedNotification?.id === notificationId) {
          setShowNotificationDetail(false)
          setSelectedNotification(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const openNotificationDetail = async (notification: Notification) => {
    setSelectedNotification(notification)
    setShowNotificationDetail(true)
    setNotificationsOpen(false)
    
    // Mark as read when opening detail view
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowLogoutDialog(false)
    try {
      await signOut()
      // Small delay to ensure auth state change is processed
      setTimeout(() => {
        router.replace('/admin-login')
      }, 100)
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if signOut fails
      router.replace('/admin-login')
    } finally {
      // Keep loading state until redirect happens
      setTimeout(() => {
        setIsLoggingOut(false)
      }, 200)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center flex-1 max-w-md" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search news and announcements..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setIsOpen(true)}
              className="pl-10 pr-4 py-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <SearchResults
              results={searchResults}
              isOpen={isOpen}
              onClose={clearSearch}
              query={searchQuery}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Visit Website */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('/', '_blank')}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Notifications */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg ${montserrat.className}`}>
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs h-6 px-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              
              {loadingNotifications ? (
                <div className="p-4 text-center bg-white dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 dark:border-gray-400 mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto bg-white dark:bg-gray-800">
                  {notifications.slice(0, 10).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-0 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        openNotificationDetail(notification)
                      }}
                    >
                      <div className="flex items-start space-x-3 w-full p-3 relative">
                        <div className="flex-shrink-0 mt-1">
                          {!notification.is_read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatRelativeTime(notification.created_at)}
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          {notification.priority === 'urgent' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                              Urgent
                            </span>
                          )}
                          {notification.priority === 'high' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                              High
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {notifications.length > 10 && (
                    <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Showing latest 10 notifications
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile & Logout */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Welcome back, Admin</span>
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isLoggingOut}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white px-3 py-2"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400 mr-2"></div>
                      Signing out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to sign out? You will need to enter your credentials again to access the admin panel.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLogoutDialog(false)}
                    disabled={isLoggingOut}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing out...
                      </>
                    ) : (
                      'Sign out'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Notification Detail Modal */}
      <Dialog open={showNotificationDetail} onOpenChange={setShowNotificationDetail}>
        <DialogContent className={`sm:max-w-[600px] ${montserrat.className}`}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedNotification?.title}
            </DialogTitle>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedNotification && formatRelativeTime(selectedNotification.created_at)}
              </span>
              {selectedNotification?.priority === 'urgent' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  Urgent
                </span>
              )}
              {selectedNotification?.priority === 'high' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                  High
                </span>
              )}
            </div>
          </DialogHeader>
          
          <DialogDescription asChild>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Message</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedNotification?.message}
                </p>
              </div>
              
              {selectedNotification?.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Details</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                    {selectedNotification.type === 'contact_form' && selectedNotification.metadata && (
                      <>
                        {String((selectedNotification.metadata as Record<string, unknown>).contact_name || '') && (
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Name:</span>
                            <span className="text-xs text-gray-900 dark:text-white">{String((selectedNotification.metadata as Record<string, unknown>).contact_name || '')}</span>
                          </div>
                        )}
                        {String((selectedNotification.metadata as Record<string, unknown>).contact_email || '') && (
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="text-xs text-gray-900 dark:text-white">{String((selectedNotification.metadata as Record<string, unknown>).contact_email || '')}</span>
                          </div>
                        )}
                        {String((selectedNotification.metadata as Record<string, unknown>).contact_phone || '') && (
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                            <span className="text-xs text-gray-900 dark:text-white">{String((selectedNotification.metadata as Record<string, unknown>).contact_phone || '')}</span>
                          </div>
                        )}
                        {String((selectedNotification.metadata as Record<string, unknown>).grade_level || '') && (
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Grade Level:</span>
                            <span className="text-xs text-gray-900 dark:text-white">{String((selectedNotification.metadata as Record<string, unknown>).grade_level || '')}</span>
                          </div>
                        )}
                        {String((selectedNotification.metadata as Record<string, unknown>).message || '') && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Additional Message:</span>
                            <p className="text-xs text-gray-900 dark:text-white mt-1">{String((selectedNotification.metadata as Record<string, unknown>).message || '')}</p>
                          </div>
                        )}
                        {String((selectedNotification.metadata as Record<string, unknown>).submitted_at || '') && (
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Submitted:</span>
                            <span className="text-xs text-gray-900 dark:text-white">
                              {new Date(String((selectedNotification.metadata as Record<string, unknown>).submitted_at || '')).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNotificationDetail(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedNotification) {
                  deleteNotification(selectedNotification.id)
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}