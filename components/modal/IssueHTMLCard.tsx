"use client"

import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface IssueHTMLCardProps {
  element: string
  onCopy: (text: string, label: string) => void
  copyFeedback: string
}

export function IssueHTMLCard({ element, onCopy, copyFeedback }: IssueHTMLCardProps) {
  return (
    <Card className="border border-purple-200/50 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/10">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400">🔧</div>
          <h3 className="font-semibold text-sm sm:text-base text-purple-900 dark:text-purple-100">HTML Element</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border">
          <pre className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-mono overflow-x-auto whitespace-pre-wrap break-all">
            <code>{element}</code>
          </pre>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(element, "HTML element")}
            className="mt-2 h-6 w-6 p-0"
            title={copyFeedback || "Copy HTML element"}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}