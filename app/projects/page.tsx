"use client"

import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProjectsPage } from "@/components/pages/ProjectsPage"

export default function Projects() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppLayout>
          <ProjectsPage />
        </AppLayout>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
