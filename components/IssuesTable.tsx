"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import type { AccessibilityIssue } from "@/types/accessibility"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, Eye } from "lucide-react"

interface IssuesTableProps {
  onIssueSelect?: (issue: AccessibilityIssue) => void
}

export function IssuesTable({ onIssueSelect }: IssuesTableProps) {
  const { filteredIssues } = useAccessibility()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
      case "in-progress":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      case "resolved":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
      case "ignored":
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
    }
  }

  if (filteredIssues.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No issues found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          No accessibility issues match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Issue</th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Severity</th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Type</th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Location</th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Status</th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Last Detected</th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue, index) => (
              <tr
                key={issue.id}
                className="border-b border-gray-100/50 dark:border-gray-800/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4">
                  <div className="max-w-sm">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{issue.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{issue.description}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={`${getSeverityColor(issue.severity)} font-medium border`}>{issue.severity}</Badge>
                </td>
                <td className="p-4">
                  <span className="text-gray-900 dark:text-white font-medium">{issue.type}</span>
                </td>
                <td className="p-4">
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
                    {issue.location}
                  </code>
                </td>
                <td className="p-4">
                  <Badge className={`${getStatusColor(issue.status)} font-medium border`}>
                    {issue.status.replace("-", " ")}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDistanceToNow(new Date(issue.lastDetected), { addSuffix: true })}
                </td>
                <td className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onIssueSelect?.(issue)}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
