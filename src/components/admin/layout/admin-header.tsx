'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut } from 'lucide-react'
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
import { signOut } from '@/lib/auth'
import { DarkModeToggle } from '@/components/admin/dark-mode-toggle'

export function AdminHeader() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()

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
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

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
                    <LogOut className="h-5 w-5" />
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