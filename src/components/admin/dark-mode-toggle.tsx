'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/components/admin/theme-provider'

export function DarkModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4 text-gray-400" />
        <Switch disabled />
        <Moon className="h-4 w-4 text-gray-400" />
      </div>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center space-x-2" title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <Sun className={`h-4 w-4 transition-colors ${isDark ? 'text-gray-400' : 'text-yellow-500'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label="Toggle dark mode"
      />
      <Moon className={`h-4 w-4 transition-colors ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
    </div>
  )
}