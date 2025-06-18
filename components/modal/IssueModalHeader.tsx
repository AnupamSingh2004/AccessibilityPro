"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"

interface IssueModalHeaderProps {
  title: string
  lastDetected: string
  onClose: () => void
  formatDate: (dateString: string) => string
}

export function IssueModalHeader({ title, lastDetected, onClose, formatDate }: IssueModalHeaderProps) {
  return (
    <CardHeader className="flex-shrink-0 spacing-fluid-xs sm:spacing-fluid-sm border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-responsive flex-shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white">⚠️</div>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-fluid-lg sm:text-fluid-xl lg:text-fluid-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">
              Issue Details
            </CardTitle>
            <p className="text-fluid-xs sm:text-fluid-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              Last detected: {formatDate(lastDetected)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 touch-target-responsive flex-shrink-0"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </CardHeader>
  )
}