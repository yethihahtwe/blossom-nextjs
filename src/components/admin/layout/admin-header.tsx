'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, ExternalLink, X, Check } from 'lucide-react'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth'
import { DarkModeToggle } from '@/components/admin/dark-mode-toggle'
import { SearchResults } from '@/components/admin/search-results'
import { useAdminSearch } from '@/hooks/useAdminSearch'
import { notificationsService } from '@/lib/services/notifications.service'
import type { Notification } from '@/lib/types/notification'

export function AdminHeader() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Search functionality
  const {
    searchQuery,
    searchResults,
    isOpen,
    loading,
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

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [])

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
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
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
                      className={`p-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                      }`}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3 w-full">
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
                        {notification.priority === 'urgent' && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                              Urgent
                            </span>
                          </div>
                        )}
                        {notification.priority === 'important' && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                              Important
                            </span>
                          </div>
                        )}
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
                  variant="ghost" 
                  size="icon"
                  disabled={isLoggingOut}
                  title="Sign out"
                >
                  {isLoggingOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400"></div>
                  ) : (
                    <LogOut className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
    </header>
  )
}