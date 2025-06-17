"use client"

import { Search, Download, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { useState } from "react"

export function FilterBar() {
  const {
    searchTerm,
    setSearchTerm,
    severityFilter,
    setSeverityFilter,
    typeFilter,
    setTypeFilter,
    filteredIssues,
    currentProject,
  } = useAccessibility()

  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = async () => {
    setIsExporting(true)

    const headers = ["Title", "Severity", "Type", "Location", "Status", "Last Detected", "WCAG Guideline", "How to Fix"]
    const csvContent = [
      headers.join(","),
      ...filteredIssues.map((issue) =>
        [
          `"${issue.title.replace(/"/g, '""')}"`,
          issue.severity,
          issue.type,
          `"${issue.location.replace(/"/g, '""')}"`,
          issue.status,
          new Date(issue.lastDetected).toLocaleDateString(),
          `"${issue.wcagGuideline.replace(/"/g, '""')}"`,
          `"${issue.howToFix.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    // Simulate processing time
    setTimeout(() => {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `accessibility-issues-${currentProject?.name || "all"}-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setIsExporting(false)

      // Show success message
      const notification = document.createElement("div")
      notification.className = "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      notification.textContent = `Exported ${filteredIssues.length} issues successfully!`
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)
    }, 1000)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSeverityFilter("all")
    setTypeFilter("all")
  }

  const hasActiveFilters = searchTerm || severityFilter !== "all" || typeFilter !== "all"

  return (
    <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/10">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search issues by title, description, element, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
            <SelectTrigger className="w-36 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Critical
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  High
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Low
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Images">Images</SelectItem>
              <SelectItem value="Forms">Forms</SelectItem>
              <SelectItem value="Color Contrast">Color Contrast</SelectItem>
              <SelectItem value="Keyboard">Keyboard</SelectItem>
              <SelectItem value="Structure">Structure</SelectItem>
              <SelectItem value="Links">Links</SelectItem>
              <SelectItem value="Focus">Focus</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}

          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={isExporting || filteredIssues.length === 0}
            className="hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-900/20 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export ({filteredIssues.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              Search: "{searchTerm}"
            </Badge>
          )}
          {severityFilter !== "all" && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
            >
              Severity: {severityFilter}
            </Badge>
          )}
          {typeFilter !== "all" && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
            >
              Type: {typeFilter}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
