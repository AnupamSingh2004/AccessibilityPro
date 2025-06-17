"use client"

import { Button } from "@/components/ui/button"
import { Globe, Grid3X3, List } from "lucide-react"

interface IssuesHeaderProps {
  showAllProjects: boolean
  setShowAllProjects: (value: boolean) => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

export function IssuesHeader({ 
  showAllProjects, 
  setShowAllProjects, 
  viewMode, 
  setViewMode 
}: IssuesHeaderProps) {
  return (
    <div className="animate-slide-down">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Accessibility Issues
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
            {showAllProjects ? "Monitor issues across all projects" : "Monitor and resolve accessibility issues"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={showAllProjects ? "default" : "outline"}
            onClick={() => setShowAllProjects(!showAllProjects)}
            className="h-12 px-6 font-semibold"
          >
            <Globe className="h-4 w-4 mr-2" />
            {showAllProjects ? "All Projects" : "Current Project"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-12 px-4"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-12 px-4"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}