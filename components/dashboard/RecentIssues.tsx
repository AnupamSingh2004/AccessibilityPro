"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, AlertCircle, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IssueModal } from "@/components/IssueModal"
import type { AccessibilityIssue } from "@/types/accessibility"

export function RecentIssues() {
  const { issues, currentProject } = useAccessibility()
  const router = useRouter()
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null)

  // Filter issues by current project
  const projectIssues = currentProject ? issues.filter((issue) => issue.projectId === currentProject.id) : issues

  const recentIssues = projectIssues
    .sort((a, b) => new Date(b.lastDetected).getTime() - new Date(a.lastDetected).getTime())
    .slice(0, 5)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const handleViewAllIssues = () => {
    router.push("/issues")
  }

  const handleViewIssue = (issue: AccessibilityIssue) => {
    setSelectedIssue(issue)
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Recent Issues {currentProject && `for ${currentProject.name}`}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAllIssues}
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentIssues.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No issues found for this project</p>
              <Button
                variant="outline"
                className="mt-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => router.push("/issues/new")}
              >
                Add New Issue
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentIssues.map((issue, index) => (
                <div
                  key={issue.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200 hover:scale-[1.02] animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleViewIssue(issue)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{issue.title}</h4>
                      <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{issue.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {issue.type}
                      </span>
                      <span>{formatDistanceToNow(new Date(issue.lastDetected), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewIssue(issue)
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issue Modal */}
      <IssueModal issue={selectedIssue} isOpen={!!selectedIssue} onClose={() => setSelectedIssue(null)} />
    </>
  )
}
