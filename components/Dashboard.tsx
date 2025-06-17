"use client"

import { StatsCards } from "@/components/StatsCards"
import { IssuesTable } from "@/components/IssuesTable"
import { FilterBar } from "@/components/FilterBar"
import { useAccessibility } from "@/contexts/AccessibilityContext"

export function Dashboard() {
  const { filteredIssues } = useAccessibility()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accessibility Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor and manage accessibility issues across your projects
        </p>
      </div>

      <StatsCards />

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility Issues</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{filteredIssues.length} issues found</p>
        </div>

        <FilterBar />
        <IssuesTable />
      </div>
    </div>
  )
}
