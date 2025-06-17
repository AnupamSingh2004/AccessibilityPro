"use client"

import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { AddIssuePage } from "@/components/pages/AddIssuePage"

export default function AddIssue() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <AddIssuePage />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
