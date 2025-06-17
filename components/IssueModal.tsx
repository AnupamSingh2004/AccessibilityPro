"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { IssueModalHeader } from "./modal/IssueModalHeader"
import { IssueBasicInfo } from "./modal/IssueBasicInfo"
import { IssueLocationCard } from "./modal/IssueLocationCard"
import { IssueWCAGCard } from "./modal/IssueWCAGCard"
import { IssueHTMLCard } from "./modal/IssueHTMLCard"
import { IssueDetectionCard } from "./modal/IssueDetectionCard"
import { IssueFixCard } from "./modal/IssueFixCard"
import { IssueModalFooter } from "./modal/IssueModalFooter"
import type { AccessibilityIssue } from "@/types/accessibility"

interface IssueModalProps {
  issue: AccessibilityIssue | null
  isOpen: boolean
  onClose: () => void
}

export function IssueModal({ issue, isOpen, onClose }: IssueModalProps) {
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [copyFeedback, setCopyFeedback] = useState<string>("")

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Set initial status when issue changes
  useEffect(() => {
    if (issue) {
      setCurrentStatus(issue.status)
    }
  }, [issue])

  if (!isOpen || !issue) return null

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
    }
    return colors[severity as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      resolved: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      "in-progress": "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      new: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      ignored: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const copyToClipboard = async (text: string, label: string = "Content") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(`${label} copied!`)
      setTimeout(() => setCopyFeedback(""), 2000)
    } catch (error) {
      setCopyFeedback("Copy failed")
      setTimeout(() => setCopyFeedback(""), 2000)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    console.log(`Status changed to: ${newStatus}`)
  }

  const handleMarkAsResolved = () => {
    handleStatusChange('resolved')
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] modal-backdrop"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {/* Backdrop click area */}
      <div 
        className="absolute inset-0 w-full h-full"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000] modal-container">
        <div 
          className="relative w-full max-w-4xl h-full max-h-[90vh] animate-scale-in"
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl flex flex-col h-full overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex-shrink-0">
              <IssueModalHeader
                title={issue.title}
                lastDetected={issue.lastDetected}
                onClose={onClose}
                formatDate={formatDate}
              />
            </div>

            {/* Scrollable Content with custom scrollbar */}
            <div 
              className="flex-1 overflow-y-auto custom-scrollbar scrollable-content"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(156, 163, 175, 0.6) rgba(243, 244, 246, 0.1)',
                minHeight: 0 // Important for flex child to allow shrinking
              }}
            >
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <IssueBasicInfo
                  issue={issue}
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                  getSeverityColor={getSeverityColor}
                  getStatusColor={getStatusColor}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <IssueLocationCard
                    location={issue.location}
                    onCopy={copyToClipboard}
                    copyFeedback={copyFeedback}
                  />
                  <IssueWCAGCard wcagGuideline={issue.wcagGuideline} />
                </div>

                <IssueHTMLCard
                  element={issue.element}
                  onCopy={copyToClipboard}
                  copyFeedback={copyFeedback}
                />

                <IssueDetectionCard
                  lastDetected={issue.lastDetected}
                  formatDate={formatDate}
                />

                <IssueFixCard howToFix={issue.howToFix} />
                
                {/* Add some bottom padding to ensure the last item is fully visible */}
                <div className="h-4"></div>
              </CardContent>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0">
              <IssueModalFooter
                issue={issue}
                currentStatus={currentStatus}
                copyFeedback={copyFeedback}
                onClose={onClose}
                onCopy={copyToClipboard}
                onMarkAsResolved={handleMarkAsResolved}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}