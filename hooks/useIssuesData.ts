"use client"

import { useMemo } from "react"
import type { AccessibilityIssue, Project } from "@/types/accessibility"

interface UseIssuesDataProps {
  issues: AccessibilityIssue[]
  currentProject: Project | null
  showAllProjects: boolean
  searchQuery: string
  severityFilter: string
  statusFilter: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export function useIssuesData({
  issues,
  currentProject,
  showAllProjects,
  searchQuery,
  severityFilter,
  statusFilter,
  sortBy,
  sortOrder
}: UseIssuesDataProps) {
  const processedIssues = useMemo(() => {
    let filtered = showAllProjects 
      ? issues 
      : issues.filter(issue => issue.projectId === currentProject?.id)

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query)
      )
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter(issue => issue.severity === severityFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(issue => issue.status === statusFilter)
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "severity":
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          comparison = severityOrder[a.severity as keyof typeof severityOrder] - 
                      severityOrder[b.severity as keyof typeof severityOrder]
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "lastDetected":
        default:
          comparison = new Date(a.lastDetected).getTime() - new Date(b.lastDetected).getTime()
          break
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })

    return sorted
  }, [issues, currentProject, showAllProjects, searchQuery, severityFilter, statusFilter, sortBy, sortOrder])

  const stats = useMemo(() => {
    const filteredIssues = showAllProjects 
      ? issues 
      : issues.filter(issue => issue.projectId === currentProject?.id)

    return {
      total: filteredIssues.length,
      critical: filteredIssues.filter(i => i.severity === "critical").length,
      high: filteredIssues.filter(i => i.severity === "high").length,
      medium: filteredIssues.filter(i => i.severity === "medium").length,
      low: filteredIssues.filter(i => i.severity === "low").length,
      resolved: filteredIssues.filter(i => i.status === "resolved").length,
      inProgress: filteredIssues.filter(i => i.status === "in-progress").length,
      new: filteredIssues.filter(i => i.status === "new").length
    }
  }, [issues, currentProject, showAllProjects])

  return { stats, processedIssues }
}