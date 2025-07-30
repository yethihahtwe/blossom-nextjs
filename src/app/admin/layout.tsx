'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar'
import { AdminHeader } from '@/components/admin/layout/admin-header'
import { AdminThemeProvider } from '@/components/admin/theme-provider'
import { supabase } from '@/lib/supabase'
import { montserrat } from './font'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const router = useRouter()

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/admin-login')
      }
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
          // Use replace to prevent back navigation to admin
          router.replace('/admin-login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <AdminThemeProvider>
        <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 admin-panel ${montserrat.className}`} data-admin-panel>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </AdminThemeProvider>
    )
  }

  // If no user, show loading while redirecting to login
  if (!user) {
    return (
      <AdminThemeProvider>
        <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 admin-panel ${montserrat.className}`} data-admin-panel>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
          </div>
        </div>
      </AdminThemeProvider>
    )
  }

  return (
    <AdminThemeProvider>
      <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 admin-panel ${montserrat.className}`} data-admin-panel>
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
            {children}
          </main>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#10b981',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
        }}
      />
    </AdminThemeProvider>
  )
}