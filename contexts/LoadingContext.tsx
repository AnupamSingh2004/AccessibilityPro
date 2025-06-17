"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface LoadingContextType {
  isPageLoading: boolean
  setIsPageLoading: (loading: boolean) => void
  isComponentLoading: (key: string) => boolean
  setComponentLoading: (key: string, loading: boolean) => void
  loadingProgress: number
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [componentLoading, setComponentLoadingState] = useState<Record<string, boolean>>({})
  const [loadingProgress, setLoadingProgress] = useState(0)
  const pathname = usePathname()

  // Enhanced loading sequence on route change
  useEffect(() => {
    setIsPageLoading(true)
    setLoadingProgress(0)

    // Simulate realistic loading progress
    const progressSteps = [
      { progress: 20, delay: 200 },
      { progress: 40, delay: 400 },
      { progress: 60, delay: 600 },
      { progress: 80, delay: 800 },
      { progress: 95, delay: 1000 },
      { progress: 100, delay: 1200 }
    ]

    progressSteps.forEach(({ progress, delay }) => {
      setTimeout(() => {
        setLoadingProgress(progress)
        if (progress === 100) {
          // Add extra delay before showing content for smooth transition
          setTimeout(() => {
            setIsPageLoading(false)
          }, 300)
        }
      }, delay)
    })

    return () => {
      // Cleanup any pending timeouts
      setLoadingProgress(0)
    }
  }, [pathname])

  const setComponentLoading = (key: string, loading: boolean) => {
    setComponentLoadingState(prev => ({ ...prev, [key]: loading }))
  }

  const isComponentLoading = (key: string) => {
    return componentLoading[key] || false
  }

  return (
    <LoadingContext.Provider value={{
      isPageLoading,
      setIsPageLoading,
      isComponentLoading,
      setComponentLoading,
      loadingProgress
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}