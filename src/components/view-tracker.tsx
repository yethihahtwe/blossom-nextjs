'use client'

import { useViewTracking } from '@/hooks/useViewTracking'

interface ViewTrackerProps {
  type: 'news' | 'announcement'
  id: string
  enabled?: boolean
  delay?: number
}

/**
 * Invisible component that tracks page views
 * Add this to any news or announcement page to track views
 */
export function ViewTracker({ type, id, enabled = true, delay = 2000 }: ViewTrackerProps) {
  useViewTracking({ type, id, enabled, delay })
  
  // This component renders nothing but tracks views
  return null
}

export default ViewTracker