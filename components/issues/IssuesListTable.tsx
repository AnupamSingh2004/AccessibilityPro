"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Calendar, MapPin, Globe, Eye, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { AccessibilityIssue, Project } from "@/types/accessibility"

interface IssuesListTableProps {
  issues: AccessibilityIssue[]
  projects: Project[]
  showAllProjects: boolean
  onIssueClick: (issue: AccessibilityIssue) => void
  getSeverityBadgeColor: (severity: string) => string
  getStatusBadgeColor: (status: string) => string
}

export function IssuesListTable({
  issues,
  projects,
  showAllProjects,
  onIssueClick,
  getSeverityBadgeColor,
  getStatusBadgeColor
}: IssuesListTableProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in">
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200/50 dark:border-gray-700/50">
                <TableHead className="pl-6">Issue</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                {showAllProjects && <TableHead>Project</TableHead>}
                <TableHead>Location</TableHead>
                <TableHead>Last Detected</TableHead>
                <TableHead className="pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => {
                const project = projects.find((p) => p.id === issue.projectId)
                return (
                  <TableRow
                    key={issue.id}
                    className="border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => onIssueClick(issue)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {issue.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                            {issue.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getSeverityBadgeColor(issue.severity)} border font-medium`}>
                        {issue.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(issue.status)} border`}>
                        {issue.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
                      >
                        {issue.type}
                      </Badge>
                    </TableCell>
                    {showAllProjects && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {project?.name || "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono max-w-[200px] truncate">
                          {issue.location}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDistanceToNow(new Date(issue.lastDetected), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          onIssueClick(issue)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Tablet View */}
        <div className="hidden md:block lg:hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200/50 dark:border-gray-700/50">
                <TableHead className="pl-4">Issue</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                {showAllProjects && <TableHead>Project</TableHead>}
                <TableHead>Last Detected</TableHead>
                <TableHead className="pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => {
                const project = projects.find((p) => p.id === issue.projectId)
                return (
                  <TableRow
                    key={issue.id}
                    className="border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => onIssueClick(issue)}
                  >
                    <TableCell className="pl-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white line-clamp-1 text-sm">
                            {issue.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                            {issue.description}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs"
                            >
                              {issue.type}
                            </Badge>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono max-w-[120px] truncate">
                              {issue.location}
                            </code>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getSeverityBadgeColor(issue.severity)} border font-medium text-xs`}>
                        {issue.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(issue.status)} border text-xs`}>
                        {issue.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    {showAllProjects && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80px]">
                            {project?.name || "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDistanceToNow(new Date(issue.lastDetected), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          onIssueClick(issue)
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          <div className="space-y-3 p-3">
            {issues.map((issue) => {
              const project = projects.find((p) => p.id === issue.projectId)
              return (
                <div
                  key={issue.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => onIssueClick(issue)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {issue.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={`${getSeverityBadgeColor(issue.severity)} border font-medium text-xs`}>
                      {issue.severity}
                    </Badge>
                    <Badge className={`${getStatusBadgeColor(issue.status)} border text-xs`}>
                      {issue.status.replace("-", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs"
                    >
                      {issue.type}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {showAllProjects && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {project?.name || "Unknown"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono flex-1 truncate">
                        {issue.location}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDistanceToNow(new Date(issue.lastDetected), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}