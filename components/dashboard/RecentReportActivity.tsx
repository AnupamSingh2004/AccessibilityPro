"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, TrendingUp, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function RecentReportActivity() {
  const recentReports = [
    {
      id: "1",
      name: "Monthly WCAG Compliance Report",
      type: "Compliance",
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      size: "2.4 MB",
      format: "PDF",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: "2",
      name: "Critical Issues Summary",
      type: "Issues",
      generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      size: "1.8 MB",
      format: "CSV",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: "3",
      name: "Accessibility Audit - E-commerce Site",
      type: "Audit",
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      size: "5.2 MB",
      format: "PDF",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: "4",
      name: "Weekly Progress Report",
      type: "Progress",
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      size: "3.1 MB",
      format: "PDF",
      status: "completed",
      downloadUrl: "#",
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Compliance":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Issues":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Audit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const handleDownload = (report: (typeof recentReports)[0]) => {
    // Simulate download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `${report.name}.${report.format.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show success notification
    const notification = document.createElement("div")
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in flex items-center gap-2"
    notification.innerHTML = `
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Report downloaded successfully!
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Recent Report Activity
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View All Reports
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReports.map((report, index) => (
            <div
              key={report.id}
              className="group flex items-center justify-between p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-[1.02] animate-fade-in border border-gray-200/50 dark:border-gray-700/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{report.name}</h4>
                    <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(report.generatedAt, { addSuffix: true })}</span>
                    </div>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span className="font-medium">{report.format}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleDownload(report)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-4 py-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
