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
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
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
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false)
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
    setShowMobileSearch(false)
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

  // Search Results Component for reuse
  const SearchResults = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl z-50 max-h-80 overflow-y-auto custom-scrollbar",
      isMobile ? "w-full mt-2" : "absolute top-full mt-2 w-full"
    )}>
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
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Main Navbar */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Left section */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
            {/* Menu Button - Visible on smaller screens */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick} 
              className="xl:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex-shrink-0"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Logo - Responsive sizing */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">A</span>
              </div>
              <div className="hidden sm:block lg:block xl:block">
                <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                  <span className="hidden md:inline">AccessibilityPro</span>
                  <span className="md:hidden">AccessPro</span>
                </h1>
              </div>
            </div>

            {/* Desktop Search - Hidden on mobile and small tablets */}
            <div ref={searchRef} className="relative hidden lg:block flex-1 max-w-md xl:max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search issues, projects, locations..."
                  value={globalSearchTerm}
                  onChange={(e) => setGlobalSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 h-9 sm:h-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 text-sm"
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

              {/* Desktop Search Results */}
              {showSearchResults && <SearchResults />}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Current Project Indicator - Hidden on mobile */}
            {currentProject && (
              <div className="hidden md:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400 truncate max-w-24 lg:max-w-none">
                  {currentProject.name}
                </span>
              </div>
            )}

            {/* Mobile Search Button - Visible on tablets and mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
            >
              <RefreshCw className={cn("h-3 w-3 sm:h-4 sm:w-4", isRefreshing && "animate-spin")} />
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
            >
              {theme === "dark" ? 
                <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : 
                <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
              }
            </Button>

            {/* Notifications */}
            <div ref={notificationRef} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg relative"
              >
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white leading-none">
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </span>
                  </div>
                )}
              </Button>

              {/* Notifications Dropdown - Responsive width */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1rem)] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Notifications</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{unreadNotifications} unread</p>
                    </div>
                    {notifications.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllNotifications} 
                        className="text-xs sm:text-sm"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={cn(
                            "p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                            !notification.read && "bg-blue-50/50 dark:bg-blue-900/10",
                          )}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                                notification.type === "error"
                                  ? "bg-red-500"
                                  : notification.type === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500",
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                {notification.title}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 sm:p-8 text-center">
                        <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div ref={profileRef} className="relative">
              <Button 
                variant="ghost" 
                onClick={() => setShowProfile(!showProfile)} 
                className="h-8 w-8 sm:h-9 sm:w-9 px-0 sm:px-2 sm:w-auto rounded-lg gap-1 sm:gap-2"
              >
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                  U
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 hidden sm:block" />
              </Button>

              {/* Profile Dropdown - Responsive positioning */}
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl z-50">
                  <div className="p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">John Doe</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">john@example.com</p>
                  </div>
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-8 sm:h-9 text-sm"
                      onClick={() => {
                        setShowProfile(false)
                        router.push("/profile")
                      }}
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-8 sm:h-9 text-sm"
                      onClick={() => {
                        setShowProfile(false)
                        router.push("/settings")
                      }}
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-8 sm:h-9 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setShowProfile(false)}
                    >
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="lg:hidden fixed inset-x-0 top-14 sm:top-16 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4">
          <div ref={mobileSearchRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search issues, projects, locations..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 h-10 sm:h-11 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGlobalSearchTerm("")
                  setShowMobileSearch(false)
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Search Results */}
            {showSearchResults && <SearchResults isMobile />}
          </div>
        </div>
      )}
    </>
  )
}
