"use client"

import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProfilePage } from "@/components/pages/ProfilePage"

export default function Profile() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
