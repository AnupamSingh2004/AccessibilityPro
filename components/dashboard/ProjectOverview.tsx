"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { FolderOpen, Globe, Calendar, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function ProjectOverview() {
  const { projects, currentProject, setCurrentProject } = useAccessibility()
  const router = useRouter()

  const handleViewAllProjects = () => {
    router.push("/projects")
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-900/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-green-600" />
            Projects
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAllProjects}
            className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            View all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 animate-fade-in cursor-pointer ${
                currentProject?.id === project.id
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                  : "bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:shadow-md"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setCurrentProject(project)}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      project.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                  <Badge variant="outline" className="text-xs">
                    {project.issueCount} issues
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span className="truncate">{project.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Last scan {formatDistanceToNow(new Date(project.lastScan), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
