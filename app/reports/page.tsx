"use client"

import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { ReportsPage } from "@/components/pages/ReportsPage"

export default function Reports() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <ReportsPage />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
