"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { useTheme } from "@/contexts/ThemeContext"
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  RefreshCw,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AccessibilityIssue } from "@/types/accessibility"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const {
    issues,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    currentProject,
    refreshIssues,
    globalSearchTerm,
    setGlobalSearchTerm,
  } = useAccessibility()

  const [searchResults, setSearchResults] = useState<AccessibilityIssue[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Enhanced fuzzy search with better algorithm
  const fuzzySearch = (query: string, text: string): number => {
    if (!query || !text) return 0

    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()

    // Exact match gets highest score
    if (textLower.includes(queryLower)) return 1

    // Character-by-character similarity
    let matches = 0
    let queryIndex = 0

    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        matches++
        queryIndex++
      }
    }

    return matches / queryLower.length
  }

  // Search functionality
  useEffect(() => {
    if (globalSearchTerm.trim()) {
      const filtered = issues
        .map((issue) => ({
          issue,
          score: Math.max(
            fuzzySearch(globalSearchTerm, issue.title),
            fuzzySearch(globalSearchTerm, issue.description),
            fuzzySearch(globalSearchTerm, issue.location),
            fuzzySearch(globalSearchTerm, issue.type),
          ),
        }))
        .filter(({ score }) => score > 0.3)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({ issue }) => issue)

      setSearchResults(filtered)
      setShowSearchResults(filtered.length > 0)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [globalSearchTerm, issues])

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleIssueClick = (issue: AccessibilityIssue) => {
    setGlobalSearchTerm("")
    setShowSearchResults(false)
    // Navigate to issues page and open modal
    router.push("/issues")
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("openIssueModal", { detail: { issue } }))
    }, 100)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    refreshIssues()
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
      case "high":
        return "border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400"
      case "medium":
        return "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
      case "low":
        return "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
      default:
        return "border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-400"
    }
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden h-9 w-9 rounded-lg">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                AccessibilityPro
              </h1>
            </div>
          </div>

          {/* Search */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search issues, projects, locations..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className="w-64 lg:w-80 pl-10 pr-10 h-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
              />
              {globalSearchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGlobalSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => handleIssueClick(issue)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {issue.title}
                            </span>
                            <Badge variant="outline" className={cn("text-xs", getSeverityColor(issue.severity))}>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{issue.location}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Current Project Indicator */}
          {currentProject && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">{currentProject.name}</span>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 rounded-lg"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-lg">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-9 w-9 rounded-lg relative"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white leading-none">{unreadNotifications}</span>
                </div>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{unreadNotifications} unread</p>
                  </div>
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="text-xs">
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={cn(
                          "p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                          !notification.read && "bg-blue-50/50 dark:bg-blue-900/10",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full mt-2",
                              notification.type === "error"
                                ? "bg-red-500"
                                : notification.type === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500",
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div ref={profileRef} className="relative">
            <Button variant="ghost" onClick={() => setShowProfile(!showProfile)} className="h-9 px-3 rounded-lg gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl z-50">
                <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">john@example.com</p>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-9"
                    onClick={() => {
                      setShowProfile(false)
                      router.push("/profile")
                    }}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-9"
                    onClick={() => {
                      setShowProfile(false)
                      router.push("/settings")
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setShowProfile(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
