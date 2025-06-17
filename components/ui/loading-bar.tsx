"use client"

import { useLoading } from "@/contexts/LoadingContext"
import { cn } from "@/lib/utils"

export function LoadingBar() {
  const { isPageLoading, loadingProgress } = useLoading()

  if (!isPageLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-200/50 dark:bg-gray-800/50">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-300 ease-out loading-shimmer"
        style={{ 
          width: `${loadingProgress}%`,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </div>
  )
}