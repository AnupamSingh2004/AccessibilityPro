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
    <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
      {/* Copy feedback notification */}
      {copyFeedback && (
        <div className="mb-3 p-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm rounded-md text-center">
          {copyFeedback}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => onCopy(JSON.stringify(issue, null, 2), "Issue data")}
            className="px-4 w-full sm:w-auto"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Issue Data
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {currentStatus !== 'resolved' && (
            <Button
              onClick={onMarkAsResolved}
              className="px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 w-full sm:w-auto"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Mark as Resolved
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}