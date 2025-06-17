"use client"

import { X, Home, AlertTriangle, BarChart3, Settings, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { projects, currentProject, setCurrentProject } = useAccessibility()

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: AlertTriangle, label: "Issues", active: false },
    { icon: BarChart3, label: "Reports", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2" role="navigation" aria-label="Main navigation">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start"
              aria-current={item.active ? "page" : undefined}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <FolderOpen className="mr-2 h-4 w-4" />
            Projects
          </h3>
          <div className="space-y-1">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant={currentProject?.id === project.id ? "secondary" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setCurrentProject(project)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{project.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.issueCount}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
