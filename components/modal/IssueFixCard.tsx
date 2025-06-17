"use client"

import { Card, CardContent } from "@/components/ui/card"

interface IssueFixCardProps {
  howToFix: string
}

export function IssueFixCard({ howToFix }: IssueFixCardProps) {
  return (
    <Card className="border border-emerald-200/50 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400">✅</div>
          <h3 className="font-semibold text-sm sm:text-base text-emerald-900 dark:text-emerald-100">How to Fix This Issue</h3>
        </div>
        <p className="text-sm sm:text-base text-emerald-800 dark:text-emerald-200 leading-relaxed">
          {howToFix}
        </p>
      </CardContent>
    </Card>
  )
}