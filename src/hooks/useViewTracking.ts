'use client'

import { useEffect, useRef } from 'react'

interface UseViewTrackingProps {
  type: 'news' | 'announcement'
  id: string
  enabled?: boolean
  delay?: number // Delay before tracking (in milliseconds)
}

export function useViewTracking({ 
  type, 
  id, 
  enabled = true, 
  delay = 1000 
}: UseViewTrackingProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!enabled || !id || hasTracked.current) {
      return
    }

    // Track view after delay (to ensure user actually viewed the content)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            id
          })
        })

        if (response.ok) {
          const result = await response.json()
          console.log(`View tracked for ${type} ${id}:`, result.newViewCount)
          hasTracked.current = true
        } else {
          console.error('Failed to track view:', response.statusText)
        }
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [type, id, enabled, delay])

  return {
    hasTracked: hasTracked.current
  }
}