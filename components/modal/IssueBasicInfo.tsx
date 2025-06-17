"use client"

import { Badge } from "@/components/ui/badge"
import { IssueStatusDropdown } from "./IssueStatusDropdown"
import type { AccessibilityIssue } from "@/types/accessibility"

interface IssueBasicInfoProps {
  issue: AccessibilityIssue
  currentStatus: string
  onStatusChange: (status: string) => void
  getSeverityColor: (severity: string) => string
  getStatusColor: (status: string) => string
}

export function IssueBasicInfo({ 
  issue, 
  currentStatus, 
  onStatusChange, 
  getSeverityColor, 
  getStatusColor 
}: IssueBasicInfoProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
        {issue.title}
      </h2>
      
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Badge className={getSeverityColor(issue.severity)}>
          {issue.severity.toUpperCase()}
        </Badge>
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
          {issue.type}
        </Badge>
        
        <IssueStatusDropdown
          currentStatus={currentStatus}
          onStatusChange={onStatusChange}
          getStatusColor={getStatusColor}
        />
      </div>

      <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {issue.description}
      </p>
    </div>
  )
}