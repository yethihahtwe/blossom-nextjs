'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'News',
    href: '/admin/news',
    icon: FileText,
  },
  {
    name: 'Announcements',
    href: '/admin/announcements',
    icon: Megaphone,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [loadingHref, setLoadingHref] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Clear loading state when pathname changes
  useEffect(() => {
    setLoadingHref(null)
  }, [pathname])

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Blossom Admin
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isLoading = loadingHref === item.href
            
            const handleClick = (e: React.MouseEvent) => {
              if (isActive) return // Don't show loading for current page
              
              setLoadingHref(item.href)
              // Let Next.js handle the navigation
              setTimeout(() => {
                router.push(item.href)
              }, 0)
            }
            
            return (
              <button
                key={item.name}
                onClick={handleClick}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-r-2 border-red-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-5 w-5',
                    collapsed ? 'mr-0' : 'mr-3'
                  )}
                />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    {isLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">A</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@blossom.edu.mm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}