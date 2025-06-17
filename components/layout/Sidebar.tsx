"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import {
  BarChart3,
  AlertTriangle,
  FileText,
  Settings,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { issues, projects, currentProject, setCurrentProject } = useAccessibility()
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true)

  const criticalIssues = issues.filter((issue) => issue.severity === "critical").length

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: BarChart3,
      current: pathname === "/",
    },
    {
      name: "Issues",
      href: "/issues",
      icon: AlertTriangle,
      current: pathname === "/issues",
      badge: criticalIssues > 0 ? criticalIssues : undefined,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
      current: pathname === "/reports",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project)
    onClose()
  }

  const handleAddProject = () => {
    router.push("/projects")
    onClose()
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AccessibilityPro
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">WCAG Compliance Platform</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden h-8 w-8 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "w-full justify-start gap-3 h-12 px-4 text-left font-medium transition-all duration-200",
                item.current
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge className="bg-red-500 text-white hover:bg-red-600 px-2 py-0.5 text-xs font-bold">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* Projects Section */}
        <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <Button
            variant="ghost"
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
            className="w-full justify-between h-10 px-3 mb-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium">Projects</span>
            </div>
            {isProjectsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {isProjectsExpanded && (
            <div className="space-y-1 ml-2">
              {projects.map((project) => {
                const projectIssues = issues.filter((issue) => issue.projectId === project.id).length
                const isActive = currentProject?.id === project.id

                return (
                  <Button
                    key={project.id}
                    variant="ghost"
                    onClick={() => handleProjectSelect(project)}
                    className={cn(
                      "w-full justify-start gap-2 h-10 px-3 text-sm transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/50"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white",
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          project.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400",
                        )}
                      />
                      <span className="truncate">{project.name}</span>
                    </div>
                    {projectIssues > 0 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {projectIssues}
                      </Badge>
                    )}
                  </Button>
                )
              })}

              <Button
                variant="ghost"
                onClick={handleAddProject}
                className="w-full justify-start gap-2 h-10 px-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
