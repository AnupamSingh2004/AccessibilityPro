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
    <CardHeader className="flex-shrink-0 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
            <div className="w-6 h-6 text-white">⚠️</div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Issue Details
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Last detected: {formatDate(lastDetected)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  )
}