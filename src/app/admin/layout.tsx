'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar'
import { AdminHeader } from '@/components/admin/layout/admin-header'
import { AdminThemeProvider } from '@/components/admin/theme-provider'
import { supabase } from '@/lib/supabase'
import { montserrat } from './font'

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
          router.push('/admin-login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <AdminThemeProvider>
        <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 admin-panel ${montserrat.className}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </AdminThemeProvider>
    )
  }

  // If no user, the useEffect will redirect to login
  if (!user) {
    return null
  }

  return (
    <AdminThemeProvider>
      <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 admin-panel ${montserrat.className}`}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
            {children}
          </main>
        </div>
      </div>
    </AdminThemeProvider>
  )
}