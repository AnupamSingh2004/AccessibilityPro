"use client"

import { Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AccessibilityIssue } from "@/types/accessibility"

interface IssueModalFooterProps {
  issue: AccessibilityIssue
  currentStatus: string
  copyFeedback: string
  onClose: () => void
  onCopy: (text: string, label: string) => void
  onMarkAsResolved: () => void
}

export function IssueModalFooter({ 
  issue, 
  currentStatus, 
  copyFeedback, 
  onClose, 
  onCopy, 
  onMarkAsResolved 
}: IssueModalFooterProps) {
  return (
    <div className="flex-shrink-0 spacing-fluid-xs sm:spacing-fluid-sm border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 safe-area-bottom">
      {/* Copy feedback notification */}
      {copyFeedback && (
        <div className="mb-3 p-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm rounded-responsive text-center">
          {copyFeedback}
        </div>
      )}
      
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        {/* Primary actions */}
        <div className="flex flex-col xs:flex-row gap-2 order-2 sm:order-1">
          <Button
            variant="outline"
            onClick={onClose}
            className="touch-target-responsive"
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => onCopy(JSON.stringify(issue, null, 2), "Issue data")}
            className="touch-target-responsive"
          >
            <Copy className="w-3 h-3 mr-1" />
            <span className="hide-below-sm">Copy Issue Data</span>
            <span className="show-below-sm">Copy Data</span>
          </Button>
        </div>
        
        {/* Secondary actions */}
        <div className="flex flex-col xs:flex-row gap-2 order-1 sm:order-2">
          {currentStatus !== 'resolved' && (
            <Button
              onClick={onMarkAsResolved}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 touch-target-responsive"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              <span className="hide-below-sm">Mark as Resolved</span>
              <span className="show-below-sm">Resolve</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}