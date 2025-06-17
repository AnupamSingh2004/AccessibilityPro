"use client"

import { useState, useEffect } from "react"

export function useLocalStorage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("lastDetected")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAllProjects, setShowAllProjects] = useState(false)

  // Load persisted preferences on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("issues-view-mode") as "grid" | "list"
    const savedShowAllProjects = localStorage.getItem("issues-show-all-projects") === "true"
    const savedSeverityFilter = localStorage.getItem("issues-severity-filter") || "all"
    const savedStatusFilter = localStorage.getItem("issues-status-filter") || "all"
    const savedSortBy = localStorage.getItem("issues-sort-by") || "lastDetected"
    const savedSortOrder = localStorage.getItem("issues-sort-order") as "asc" | "desc" || "desc"

    if (savedViewMode && (savedViewMode === "grid" || savedViewMode === "list")) {
      setViewMode(savedViewMode)
    }
    setShowAllProjects(savedShowAllProjects)
    setSeverityFilter(savedSeverityFilter)
    setStatusFilter(savedStatusFilter)
    setSortBy(savedSortBy)
    setSortOrder(savedSortOrder)
    setMounted(true)
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("issues-view-mode", viewMode)
    }
  }, [viewMode, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("issues-show-all-projects", showAllProjects.toString())
    }
  }, [showAllProjects, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("issues-severity-filter", severityFilter)
    }
  }, [severityFilter, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("issues-status-filter", statusFilter)
    }
  }, [statusFilter, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("issues-sort-by", sortBy)
    }
  }, [sortBy, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("issues-sort-order", sortOrder)
    }
  }, [sortOrder, mounted])

  return {
    mounted,
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
  }
}