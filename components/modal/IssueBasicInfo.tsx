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
      <h2 className="text-fluid-lg sm:text-fluid-xl lg:text-fluid-2xl font-bold text-gray-900 dark:text-white leading-tight">
        {issue.title}
      </h2>
      
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Badge className={`${getSeverityColor(issue.severity)} text-xs sm:text-sm`}>
          {issue.severity.toUpperCase()}
        </Badge>
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-xs sm:text-sm">
          {issue.type}
        </Badge>
        
        <IssueStatusDropdown
          currentStatus={currentStatus}
          onStatusChange={onStatusChange}
          getStatusColor={getStatusColor}
        />
      </div>

      <p className="text-fluid-sm sm:text-fluid-base text-gray-700 dark:text-gray-300 leading-relaxed">
        {issue.description}
      </p>
    </div>
  )
}