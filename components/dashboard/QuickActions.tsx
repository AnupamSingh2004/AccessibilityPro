"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { Scan, Plus, Download, Zap, RefreshCw, FileText, AlertTriangle } from "lucide-react"

export function QuickActions() {
  const router = useRouter()
  const { refreshIssues, currentProject } = useAccessibility()
  const [isScanning, setIsScanning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleQuickScan = async () => {
    setIsScanning(true)
    // Simulate scan
    await new Promise((resolve) => setTimeout(resolve, 2000))
    refreshIssues()
    setIsScanning(false)

    // Show success notification
    const notification = document.createElement("div")
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in"
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-medium">Quick scan completed!</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 4000)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    refreshIssues()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExportReport = () => {
    // Simulate report generation
    const notification = document.createElement("div")
    notification.className =
      "fixed top-20 right-4 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in"
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span class="font-medium">Report exported successfully!</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 4000)
  }

  const quickActions = [
    {
      title: "Quick Scan",
      description: "Run accessibility scan",
      icon: Scan,
      action: handleQuickScan,
      loading: isScanning,
      gradient: "from-blue-500 to-indigo-600",
      hoverGradient: "from-blue-600 to-indigo-700",
    },
    {
      title: "Add Issue",
      description: "Report new issue",
      icon: Plus,
      action: () => router.push("/issues/new"),
      loading: false,
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
    },
    {
      title: "Export Report",
      description: "Download full report",
      icon: Download,
      action: handleExportReport,
      loading: false,
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-600 to-pink-700",
    },
    {
      title: "Refresh Data",
      description: "Update all data",
      icon: RefreshCw,
      action: handleRefresh,
      loading: isRefreshing,
      gradient: "from-orange-500 to-red-600",
      hoverGradient: "from-orange-600 to-red-700",
    },
  ]

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentProject ? `For ${currentProject.name}` : "Common tasks"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Button
            key={action.title}
            onClick={action.action}
            disabled={action.loading}
            className={`w-full h-16 p-4 bg-gradient-to-r ${action.gradient} hover:${action.hoverGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="p-2 bg-white/20 rounded-lg">
                {action.loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <action.icon className="h-5 w-5" />}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{action.title}</div>
                <div className="text-sm opacity-90">{action.description}</div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </div>
          </Button>
        ))}

        {/* Additional Actions */}
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/reports")}
              className="h-12 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-900/20"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/issues")}
              className="h-12 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              All Issues
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
