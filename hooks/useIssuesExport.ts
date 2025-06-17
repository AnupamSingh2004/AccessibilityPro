"use client"

import type { AccessibilityIssue, Project } from "@/types/accessibility"

export function useIssuesExport() {
  const showNotification = (message: string) => {
    const notification = document.createElement("div")
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in"
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-medium">${message}</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 4000)
  }

  const exportToCSV = (
    issues: AccessibilityIssue[], 
    projects: Project[], 
    currentProject: Project | null, 
    showAllProjects: boolean
  ) => {
    const headers = ["Title", "Severity", "Type", "Status", "Location", "Project", "Last Detected", "WCAG Guideline"]
    const csvContent = [
      headers.join(","),
      ...issues.map((issue) => {
        const project = projects.find((p) => p.id === issue.projectId)
        return [
          `"${issue.title.replace(/"/g, '""')}"`,
          issue.severity,
          issue.type,
          issue.status,
          `"${issue.location.replace(/"/g, '""')}"`,
          `"${project?.name || "Unknown Project"}"`,
          new Date(issue.lastDetected).toLocaleDateString(),
          `"${issue.wcagGuideline.replace(/"/g, '""')}"`,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `accessibility-issues-${showAllProjects ? "all-projects" : currentProject?.name || "current"}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    showNotification("Issues exported to CSV successfully!")
  }

  const exportToJSON = (
    issues: AccessibilityIssue[], 
    projects: Project[], 
    currentProject: Project | null, 
    showAllProjects: boolean
  ) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      project: showAllProjects ? "All Projects" : currentProject?.name || "Current Project",
      totalIssues: issues.length,
      issues: issues.map((issue) => {
        const project = projects.find((p) => p.id === issue.projectId)
        return {
          ...issue,
          projectName: project?.name || "Unknown Project",
        }
      }),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `accessibility-issues-${showAllProjects ? "all-projects" : currentProject?.name || "current"}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    showNotification("Issues exported to JSON successfully!")
  }

  return { exportToCSV, exportToJSON }
}