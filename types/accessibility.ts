export type SeverityLevel = "critical" | "high" | "medium" | "low"

export interface AccessibilityIssue {
  id: string
  title: string
  description: string
  severity: SeverityLevel
  type: string
  element: string
  location: string
  wcagGuideline: string
  howToFix: string
  lastDetected: string
  projectId: string
  status: "new" | "in-progress" | "resolved" | "ignored"
}

export interface Project {
  id: string
  name: string
  url: string
  lastScan: string
  issueCount: number
  status: "active" | "inactive"
}

export interface DashboardStats {
  totalIssues: number
  criticalIssues: number
  highIssues: number
  mediumIssues: number
  lowIssues: number
  resolvedIssues: number
  projectsScanned: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error"
  timestamp: string
  read: boolean
  issueId?: string
}
