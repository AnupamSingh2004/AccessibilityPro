"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent } from "@/components/ui/card"
import { IssueModal } from "@/components/IssueModal"
import { IssuesHeader } from "@/components/issues/IssuesHeader"
import { IssuesStats } from "@/components/issues/IssuesStats"
import { IssuesFilters } from "@/components/issues/IssuesFilters"
import { IssuesGrid } from "@/components/issues/IssuesGrid"
import { IssuesListTable } from "@/components/issues/IssuesListTable"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { useIssuesData } from "@/hooks/useIssuesData"
import { useIssuesExport } from "@/hooks/useIssuesExport"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useTheme } from "@/contexts/ThemeContext"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { IssuesPageSkeleton } from "@/components/loading/PageLoadingSkeleton"
import type { AccessibilityIssue } from "@/types/accessibility"
import { AlertTriangle } from "lucide-react"

export function IssuesPage() {
  const { issues, currentProject, projects } = useAccessibility()
  const { mounted: themeMounted } = useTheme()
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null)
  const [contentLoaded, setContentLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Use custom hooks for cleaner state management
  const {
    mounted: localStorageMounted,
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
    viewMode,
    setViewMode,
    showAllProjects,
    setShowAllProjects
  } = useLocalStorage()

  const { stats, processedIssues } = useIssuesData({
    issues,
    currentProject,
    showAllProjects,
    searchQuery,
    severityFilter,
    statusFilter,
    sortBy,
    sortOrder
  })

  const { exportToCSV, exportToJSON } = useIssuesExport()

  // Check if component is mounted (for portal)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Enhanced loading sequence
  useEffect(() => {
    if (localStorageMounted && themeMounted) {
      const timer = setTimeout(() => setContentLoaded(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [localStorageMounted, themeMounted])

  useEffect(() => {
    const handleOpenIssueModal = (event: CustomEvent) => {
      setSelectedIssue(event.detail.issue)
    }

    window.addEventListener("openIssueModal", handleOpenIssueModal as EventListener)
    return () => {
      window.removeEventListener("openIssueModal", handleOpenIssueModal as EventListener)
    }
  }, [])

  const handleExportCSV = () => {
    exportToCSV(processedIssues, projects, currentProject, showAllProjects)
  }

  const handleExportJSON = () => {
    exportToJSON(processedIssues, projects, currentProject, showAllProjects)
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "from-red-500 to-red-600",
      high: "from-orange-500 to-orange-600",
      medium: "from-yellow-500 to-yellow-600",
      low: "from-blue-500 to-blue-600"
    }
    return colors[severity as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  const getSeverityBadgeColor = (severity: string) => {
    const colors = {
      critical: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
    }
    return colors[severity as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
  }

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      resolved: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      "in-progress": "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      new: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
  }

  const pageContent = (
    <div className="flex flex-col h-[calc(100vh-2rem)] animate-stagger-fast">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-4 pb-4">
        <div className="animate-slide-down">
          <IssuesHeader
            showAllProjects={showAllProjects}
            setShowAllProjects={setShowAllProjects}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        <div className="animate-fade-in-delayed">
          <IssuesStats stats={stats} />
        </div>

        <div className="animate-fade-in-delayed">
          <IssuesFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            processedIssuesLength={processedIssues.length}
            showAllProjects={showAllProjects}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
          />
        </div>
      </div>

      {/* Scrollable Issues Container */}
      <div className="flex-1 min-h-0">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl h-full flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            {/* Container Header */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    Issues {viewMode === "grid" ? "Grid" : "List"}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    ({processedIssues.length} {processedIssues.length === 1 ? 'issue' : 'issues'})
                  </span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Scroll to view more
                </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar touch-auto sm:px-6"
              style={{ 
                minHeight: '200px',
                maxHeight: 'calc(100vh - 30rem)', // Adjust for header and padding
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                overflowX: 'hidden'
              }}
            >
              {processedIssues.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px] sm:min-h-[300px]">
                  <div className="text-center animate-fade-in">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl w-fit mx-auto mb-4 sm:p-4 sm:mb-6">
                      <AlertTriangle className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:text-2xl sm:mb-3">No issues found</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[90%] mx-auto sm:text-base sm:max-w-md">
                      Try adjusting your search criteria or filters to find issues.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="content-reveal-fast">
                  {viewMode === "grid" ? (
                    <IssuesGrid
                      issues={processedIssues}
                      projects={projects}
                      showAllProjects={showAllProjects}
                      onIssueClick={setSelectedIssue}
                      getSeverityColor={getSeverityColor}
                      getSeverityBadgeColor={getSeverityBadgeColor}
                      getStatusBadgeColor={getStatusBadgeColor}
                    />
                  ) : (
                    <div className="overflow-hidden rounded-lg">
                      <IssuesListTable
                        issues={processedIssues}
                        projects={projects}
                        showAllProjects={showAllProjects}
                        onIssueClick={setSelectedIssue}
                        getSeverityBadgeColor={getSeverityBadgeColor}
                        getStatusBadgeColor={getStatusBadgeColor}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Render modal using portal */}
      {mounted && selectedIssue && createPortal(
        <IssueModal 
          issue={selectedIssue} 
          isOpen={!!selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
        />,
        document.body
      )}
    </div>
  )

  return (
    <PageWrapper 
      skeleton={<IssuesPageSkeleton />}
      className="h-screen overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8"
    >
      {(!localStorageMounted || !themeMounted || !contentLoaded) ? (
        <IssuesPageSkeleton />
      ) : (
        pageContent
      )}
    </PageWrapper>
  )
}