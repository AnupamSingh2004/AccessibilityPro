"use client"


import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { Dashboard } from "@/components/pages/Dashboard"
import { AccessibilityProvider } from "@/contexts/AccessibilityContext"

export default function Home() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
