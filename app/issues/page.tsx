"use client"

import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { IssuesPage } from "@/components/pages/IssuesPage"

export default function Issues() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <IssuesPage />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
