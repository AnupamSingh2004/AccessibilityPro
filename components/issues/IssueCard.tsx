"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Eye, Calendar, MapPin, MoreHorizontal, Globe } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { AccessibilityIssue, Project } from "@/types/accessibility"

interface IssueCardProps {
  issue: AccessibilityIssue
  project?: Project
  showAllProjects: boolean
  onIssueClick: (issue: AccessibilityIssue) => void
  getSeverityColor: (severity: string) => string
  getSeverityBadgeColor: (severity: string) => string
  getStatusBadgeColor: (status: string) => string
}

export function IssueCard({
  issue,
  project,
  showAllProjects,
  onIssueClick,
  getSeverityColor,
  getSeverityBadgeColor,
  getStatusBadgeColor
}: IssueCardProps) {
  return (
    <Card
      className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
      onClick={() => onIssueClick(issue)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {issue.title}
            </CardTitle>
            {showAllProjects && project && (
              <div className="flex items-center gap-2 mt-2">
                <Globe className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{project.name}</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getSeverityColor(issue.severity)}`}>
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={`${getSeverityBadgeColor(issue.severity)} border font-medium`}>
            {issue.severity}
          </Badge>
          <Badge className={`${getStatusBadgeColor(issue.status)} border`}>
            {issue.status.replace("-", " ")}
          </Badge>
          <Badge
            variant="outline"
            className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
          >
            {issue.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{issue.description}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono truncate">
              {issue.location}
            </code>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(issue.lastDetected), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              // Handle quick actions
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}