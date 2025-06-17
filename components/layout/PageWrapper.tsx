"use client"

import { useLoading } from "@/contexts/LoadingContext"
import { LoadingBar } from "@/components/ui/loading-bar"
import { cn } from "@/lib/utils"

interface PageWrapperProps {
  children: React.ReactNode
  skeleton?: React.ReactNode
  className?: string
}

export function PageWrapper({ children, skeleton, className }: PageWrapperProps) {
  const { isPageLoading } = useLoading()

  return (
    <>
      <LoadingBar />
      <div className={cn("min-h-screen", className)}>
        {isPageLoading ? (
          <div className="animate-fade-in-slow">
            {skeleton}
          </div>
        ) : (
          <div className="page-transition">
            {children}
          </div>
        )}
      </div>
    </>
  )
}