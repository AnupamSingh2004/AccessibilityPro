"use client"

import type { AccessibilityIssue, Project } from "@/types/accessibility"
import { IssueCard } from "./IssueCard"

interface IssuesGridProps {
  issues: AccessibilityIssue[]
  projects: Project[]
  showAllProjects: boolean
  onIssueClick: (issue: AccessibilityIssue) => void
  getSeverityColor: (severity: string) => string
  getSeverityBadgeColor: (severity: string) => string
  getStatusBadgeColor: (status: string) => string
}

export function IssuesGrid({
  issues,
  projects,
  showAllProjects,
  onIssueClick,
  getSeverityColor,
  getSeverityBadgeColor,
  getStatusBadgeColor
}: IssuesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
      {issues.map((issue) => {
        const project = projects.find((p) => p.id === issue.projectId)
        return (
          <IssueCard
            key={issue.id}
            issue={issue}
            project={project}
            showAllProjects={showAllProjects}
            onIssueClick={onIssueClick}
            getSeverityColor={getSeverityColor}
            getSeverityBadgeColor={getSeverityBadgeColor}
            getStatusBadgeColor={getStatusBadgeColor}
          />
        )
      })}
    </div>
  )
}