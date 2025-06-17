"use client"

import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { SettingsPage } from "@/components/pages/SettingsPage"

export default function Settings() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
