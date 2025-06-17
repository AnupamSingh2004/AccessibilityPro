"use client"

import { Card, CardContent } from "@/components/ui/card"

interface IssueDetectionCardProps {
  lastDetected: string
  formatDate: (dateString: string) => string
}

export function IssueDetectionCard({ lastDetected, formatDate }: IssueDetectionCardProps) {
  return (
    <Card className="border border-orange-200/50 dark:border-orange-800/50 bg-orange-50/50 dark:bg-orange-900/10">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400">⏰</div>
          <h3 className="font-semibold text-sm sm:text-base text-orange-900 dark:text-orange-100">Last Detected</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-orange-800 dark:text-orange-200 font-medium">
            {formatDate(lastDetected)}
          </p>
          <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
            Issue was first detected and logged in the system
          </p>
        </div>
      </CardContent>
    </Card>
  )
}