"use client"

import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface IssueLocationCardProps {
  location: string
  onCopy: (text: string, label: string) => void
  copyFeedback: string
}

export function IssueLocationCard({ location, onCopy, copyFeedback }: IssueLocationCardProps) {
  return (
    <Card className="border border-blue-200/50 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400">🌍</div>
          <h3 className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100">Location</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 border">
          <code className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
            {location}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(location, "Location")}
            className="ml-2 h-6 w-6 p-0 flex-shrink-0"
            title={copyFeedback || "Copy location"}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}