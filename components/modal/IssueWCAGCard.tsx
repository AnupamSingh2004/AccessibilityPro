"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface IssueWCAGCardProps {
  wcagGuideline: string
}

export function IssueWCAGCard({ wcagGuideline }: IssueWCAGCardProps) {
  return (
    <Card className="border border-green-200/50 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400">📋</div>
          <h3 className="font-semibold text-sm sm:text-base text-green-900 dark:text-green-100">WCAG Guideline</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base text-green-800 dark:text-green-200 font-medium break-words">
            {wcagGuideline}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-green-600 dark:text-green-400 flex-shrink-0"
            onClick={() => window.open(`https://www.w3.org/WAI/WCAG21/quickref/#${wcagGuideline?.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}