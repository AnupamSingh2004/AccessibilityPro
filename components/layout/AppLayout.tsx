"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { LoadingProvider } from "@/contexts/LoadingContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AccessibilityProvider, useAccessibility } from "@/contexts/AccessibilityContext"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { settings } = useAccessibility()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <LoadingProvider>
      <ThemeProvider>
        <AccessibilityProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/50">
            {/* Mobile backdrop */}
            {sidebarOpen && isMobile && (
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="lg:pl-72">
              <Navbar onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto px-4 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AccessibilityProvider>
      </ThemeProvider>
    </LoadingProvider>
  )
}
