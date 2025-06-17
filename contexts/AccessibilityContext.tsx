"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AccessibilityIssue, Project, SeverityLevel } from "@/types/accessibility"
import { mockIssues, mockProjects } from "@/data/mockData"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: string
  read: boolean
  issueId?: string
}

interface AccessibilityContextType {
  issues: AccessibilityIssue[]
  projects: Project[]
  currentProject: Project | null
  filteredIssues: AccessibilityIssue[]
  searchTerm: string
  severityFilter: SeverityLevel | "all"
  typeFilter: string
  globalSearchTerm: string
  notifications: Notification[]
  setSearchTerm: (term: string) => void
  setSeverityFilter: (severity: SeverityLevel | "all") => void
  setTypeFilter: (type: string) => void
  setCurrentProject: (project: Project) => void
  setGlobalSearchTerm: (term: string) => void
  refreshIssues: () => void
  updateIssueStatus: (issueId: string, status: AccessibilityIssue["status"]) => void
  addNewIssue: (issue: Omit<AccessibilityIssue, "id">) => void
  addProject: (project: Project) => void
  markNotificationAsRead: (notificationId: string) => void
  clearAllNotifications: () => void
  isCompactMode: boolean
  setIsCompactMode: (value: boolean) => void
  areAnimationsEnabled: boolean
  setAreAnimationsEnabled: (value: boolean) => void
  settings?: {
    compactMode: boolean
    animations: boolean
  }
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

// Use localStorage to persist project selection and issue updates
const getStoredProject = (): Project | null => {
  if (typeof window === "undefined") return null

  const storedProjectId = localStorage.getItem("currentProjectId")
  if (!storedProjectId) return mockProjects[0]

  const project = mockProjects.find((p) => p.id === storedProjectId)
  return project || mockProjects[0]
}

const getStoredIssues = (): AccessibilityIssue[] => {
  if (typeof window === "undefined") return mockIssues

  const storedIssues = localStorage.getItem("accessibilityIssues")
  if (storedIssues) {
    try {
      return JSON.parse(storedIssues)
    } catch (error) {
      console.error("Error parsing stored issues:", error)
      return mockIssues
    }
  }
  return mockIssues
}

const saveIssuesToStorage = (issues: AccessibilityIssue[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessibilityIssues", JSON.stringify(issues))
  }
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [globalSearchTerm, setGlobalSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "all">("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCompactMode, setIsCompactMode] = useState(false)
  const [areAnimationsEnabled, setAreAnimationsEnabled] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Initialize issues and currentProject from localStorage on mount
  useEffect(() => {
    const storedIssues = getStoredIssues()
    const storedProject = getStoredProject()
    setIssues(storedIssues)
    setCurrentProjectState(storedProject)
  }, [])

  // Set current project and persist to localStorage
  const setCurrentProject = (project: Project) => {
    setCurrentProjectState(project)
    if (typeof window !== "undefined") {
      localStorage.setItem("currentProjectId", project.id)
    }
  }

  // Add new project
  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project])
  }

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompactMode = localStorage.getItem("compactMode")
      const storedAnimations = localStorage.getItem("animationsEnabled")

      if (storedCompactMode) setIsCompactMode(storedCompactMode === "true")
      if (storedAnimations) setAreAnimationsEnabled(storedAnimations === "true")
    }
  }, [])

  // Save settings to localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("compactMode", String(isCompactMode))
      localStorage.setItem("animationsEnabled", String(areAnimationsEnabled))

      // Apply compact mode class to body
      if (isCompactMode) {
        document.body.classList.add("compact-mode")
      } else {
        document.body.classList.remove("compact-mode")
      }

      // Apply animations class to body
      if (areAnimationsEnabled) {
        document.body.classList.add("animations-enabled")
        document.body.classList.remove("animations-disabled")
      } else {
        document.body.classList.add("animations-disabled")
        document.body.classList.remove("animations-enabled")
      }
    }
  }, [isCompactMode, areAnimationsEnabled])

  // Generate notifications for critical issues
  useEffect(() => {
    const criticalIssues = issues.filter((issue) => issue.severity === "critical")
    const newNotifications: Notification[] = []

    criticalIssues.forEach((issue) => {
      const issueTime = new Date(issue.lastDetected).getTime()
      const now = Date.now()

      // Only create notifications for issues detected in the last 10 minutes
      if (now - issueTime < 10 * 60 * 1000) {
        newNotifications.push({
          id: `critical-${issue.id}`,
          title: "Critical Issue Detected",
          message: `${issue.title} requires immediate attention`,
          type: "error",
          timestamp: new Date(issue.lastDetected).toLocaleString(),
          read: false,
          issueId: issue.id,
        })
      }
    })

    // Add general notifications
    if (issues.length > 50) {
      newNotifications.push({
        id: "high-issue-count",
        title: "High Issue Count",
        message: `You have ${issues.length} accessibility issues. Consider prioritizing fixes.`,
        type: "warning",
        timestamp: new Date().toLocaleString(),
        read: false,
      })
    }

    setNotifications((prev) => {
      const existingIds = prev.map((n) => n.id)
      const uniqueNew = newNotifications.filter((n) => !existingIds.includes(n.id))
      return [...prev, ...uniqueNew].slice(0, 20) // Keep only latest 20 notifications
    })
  }, [issues])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIssues((prevIssues) => {
        const updatedIssues = [...prevIssues]

        // Randomly update existing issues
        if (Math.random() > 0.7) {
          const randomIndex = Math.floor(Math.random() * updatedIssues.length)
          updatedIssues[randomIndex] = {
            ...updatedIssues[randomIndex],
            lastDetected: new Date().toISOString(),
          }
        }

        // Occasionally add new issues
        if (Math.random() > 0.9) {
          const newIssue: AccessibilityIssue = {
            id: `new-${Date.now()}`,
            title: "New accessibility issue detected",
            description: "A new issue has been automatically detected during continuous monitoring",
            severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)] as SeverityLevel,
            type: ["Images", "Forms", "Color Contrast", "Keyboard"][Math.floor(Math.random() * 4)],
            element: `<div class="new-element-${Date.now()}">`,
            location: `/page-${Math.floor(Math.random() * 10)}`,
            wcagGuideline: "WCAG 2.1 - Auto-detected",
            howToFix: "This issue was automatically detected and needs manual review",
            lastDetected: new Date().toISOString(),
            projectId: currentProject?.id || "1",
            status: "new",
          }
          updatedIssues.unshift(newIssue)
        }

        // Save to localStorage
        saveIssuesToStorage(updatedIssues)
        return updatedIssues
      })
    }, 8000) // Update every 8 seconds

    return () => clearInterval(interval)
  }, [currentProject])

  // Filter issues based on search, filters, and current project
  const filteredIssues = issues.filter((issue) => {
    const searchTerms = [searchTerm, globalSearchTerm].filter(Boolean)
    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.some(
        (term) =>
          issue.title.toLowerCase().includes(term.toLowerCase()) ||
          issue.description.toLowerCase().includes(term.toLowerCase()) ||
          issue.element.toLowerCase().includes(term.toLowerCase()) ||
          issue.location.toLowerCase().includes(term.toLowerCase()) ||
          issue.type.toLowerCase().includes(term.toLowerCase()),
      )

    const matchesSeverity = severityFilter === "all" || issue.severity === severityFilter
    const matchesType = typeFilter === "all" || issue.type === typeFilter
    const matchesProject = !currentProject || issue.projectId === currentProject.id

    return matchesSearch && matchesSeverity && matchesType && matchesProject
  })

  const refreshIssues = () => {
    const freshIssues = [...mockIssues]
    setIssues(freshIssues)
    saveIssuesToStorage(freshIssues)
  }

  const updateIssueStatus = (issueId: string, status: AccessibilityIssue["status"]) => {
    setIssues((prev) => {
      const updatedIssues = prev.map((issue) => (issue.id === issueId ? { ...issue, status } : issue))
      // Save to localStorage for persistence
      saveIssuesToStorage(updatedIssues)
      return updatedIssues
    })
  }

  const addNewIssue = (newIssue: Omit<AccessibilityIssue, "id">) => {
    const issue: AccessibilityIssue = {
      ...newIssue,
      id: `issue-${Date.now()}`,
    }
    setIssues((prev) => {
      const updatedIssues = [issue, ...prev]
      saveIssuesToStorage(updatedIssues)
      return updatedIssues
    })
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <AccessibilityContext.Provider
      value={{
        issues,
        projects,
        currentProject,
        filteredIssues,
        searchTerm,
        severityFilter,
        typeFilter,
        globalSearchTerm,
        notifications,
        setSearchTerm,
        setSeverityFilter,
        setTypeFilter,
        setCurrentProject,
        setGlobalSearchTerm,
        refreshIssues,
        updateIssueStatus,
        addNewIssue,
        addProject,
        markNotificationAsRead,
        clearAllNotifications,
        isCompactMode,
        setIsCompactMode,
        areAnimationsEnabled,
        setAreAnimationsEnabled,
        settings: {
          compactMode: isCompactMode,
          animations: areAnimationsEnabled,
        },
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
