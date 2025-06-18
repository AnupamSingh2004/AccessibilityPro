"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileJson, ArrowUpDown } from "lucide-react"

interface IssuesFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  severityFilter: string
  setSeverityFilter: (severity: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: string
  setSortOrder: (order: string) => void
  processedIssuesLength: number
  showAllProjects: boolean
  onExportCSV: () => void
  onExportJSON: () => void
}

export function IssuesFilters({
  searchQuery,
  setSearchQuery,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  processedIssuesLength,
  showAllProjects,
  onExportCSV,
  onExportJSON
}: IssuesFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar - Full width on mobile */}
      <div className="w-full">
        <Input
          placeholder="Search issues by title, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 sm:h-12 text-sm sm:text-base"
        />
      </div>

      {/* Filters Row - Stack on mobile, inline on desktop */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Filter Controls - 2 columns on mobile, inline on desktop */}
        <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 flex-1">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-10 text-xs sm:text-sm">
              <SelectValue placeholder="All Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 text-xs sm:text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 text-xs sm:text-sm col-span-2 sm:col-span-1">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastDetected">Last Detected</SelectItem>
              <SelectItem value="severity">Severity</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-10 col-span-2 sm:col-span-1 sm:w-auto"
          >
            <ArrowUpDown className="h-3 w-3 mr-2" />
            <span className="hidden sm:inline">
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </span>
            <span className="sm:hidden">
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </span>
          </Button>
        </div>

        {/* Export Buttons - Better mobile layout */}
        <div className="flex gap-2 sm:gap-3 sm:flex-shrink-0">
          <Button
            onClick={onExportCSV}
            size="sm"
            className="flex-1 sm:flex-none h-10 bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="h-3 w-3 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          
          <Button
            onClick={onExportJSON}
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none h-10 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <FileJson className="h-3 w-3 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export JSON</span>
            <span className="sm:hidden">JSON</span>
          </Button>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <span>
          <span className="font-medium text-gray-900 dark:text-white">{processedIssuesLength}</span> issues found
          {showAllProjects && <span className="ml-1">(across all projects)</span>}
        </span>
      </div>
    </div>
  )
}