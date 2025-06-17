"use client"

import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { HelpPage } from "@/components/pages/HelpPage"

export default function Help() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <HelpPage />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
