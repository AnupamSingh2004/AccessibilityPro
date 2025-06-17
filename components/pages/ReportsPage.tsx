"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import {
  FileText,
  Download,
  TrendingUp,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Award,
  Calendar,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function ReportsPage() {
  const { issues, projects, currentProject } = useAccessibility()
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [isGenerating, setIsGenerating] = useState(false)

  // Calculate comprehensive metrics
  const projectIssues = currentProject ? issues.filter((issue) => issue.projectId === currentProject.id) : issues

  const metrics = {
    totalIssues: projectIssues.length,
    resolvedIssues: projectIssues.filter((issue) => issue.status === "resolved").length,
    criticalIssues: projectIssues.filter((issue) => issue.severity === "critical").length,
    complianceScore: Math.round(
      (projectIssues.filter((issue) => issue.status === "resolved").length / Math.max(projectIssues.length, 1)) * 100,
    ),
    avgResolutionTime: "2.3 days",
    trendsUp: 12,
    trendsDown: 8,
    wcagLevel: "AA",
    accessibilityScore: 87,
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)

    // Create and download a sample report
    const reportData = {
      project: currentProject?.name || "All Projects",
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      metrics,
      issues: projectIssues.slice(0, 10), // Sample issues
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `accessibility-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const complianceData = [
    { level: "A", score: 95, color: "from-green-500 to-emerald-600" },
    { level: "AA", score: 87, color: "from-blue-500 to-blue-600" },
    { level: "AAA", score: 72, color: "from-purple-500 to-purple-600" },
  ]

  const severityBreakdown = [
    { severity: "Critical", count: metrics.criticalIssues, color: "from-red-500 to-red-600", percentage: 15 },
    { severity: "High", count: 23, color: "from-orange-500 to-orange-600", percentage: 35 },
    { severity: "Medium", count: 18, color: "from-yellow-500 to-yellow-600", percentage: 30 },
    { severity: "Low", count: 12, color: "from-blue-500 to-blue-600", percentage: 20 },
  ]

  // Recent Report Activity Data
  const recentReports = [
    {
      id: 1,
      title: "Monthly WCAG Compliance Report",
      type: "Compliance",
      size: "2.4 MB",
      format: "PDF",
      timestamp: "about 2 hours ago",
      status: "ready",
    },
    {
      id: 2,
      title: "Critical Issues Summary",
      type: "Issues",
      size: "1.8 MB",
      format: "CSV",
      timestamp: "about 6 hours ago",
      status: "ready",
    },
    {
      id: 3,
      title: "Accessibility Audit - E-commerce Site",
      type: "Audit",
      size: "5.2 MB",
      format: "PDF",
      timestamp: "1 day ago",
      status: "ready",
    },
    {
      id: 4,
      title: "Weekly Progress Report",
      type: "Progress",
      size: "3.1 MB",
      format: "PDF",
      timestamp: "3 days ago",
      status: "ready",
    },
  ]

  const handleDownloadReport = (report: any) => {
    // Simulate download
    const notification = document.createElement("div")
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in"
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-medium">${report.title} downloaded successfully!</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 4000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-down">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Accessibility Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Comprehensive accessibility compliance and performance analytics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              {["7d", "30d", "90d", "1y"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="h-10 px-4"
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 h-10 px-6 font-semibold shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.complianceScore}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+{metrics.trendsUp}%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues Resolved</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.resolvedIssues}</p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">of {metrics.totalIssues} total</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.criticalIssues}</p>
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Needs attention</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Resolution</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.avgResolutionTime}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">Improving</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Report Activity */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              Recent Report Activity
            </CardTitle>
            <Button
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-900/20"
            >
              View All Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReports.map((report, index) => (
            <div
              key={report.id}
              className="group flex items-center justify-between p-6 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-[1.02] animate-fade-in border border-gray-200/50 dark:border-gray-700/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{report.title}</h4>
                    <Badge
                      className={cn(
                        "font-medium",
                        report.type === "Compliance"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : report.type === "Issues"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : report.type === "Audit"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
                      )}
                    >
                      {report.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{report.timestamp}</span>
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
                  onClick={() => handleDownloadReport(report)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-2 font-semibold"
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
        </CardContent>
      </Card>

      {/* WCAG Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Award className="h-5 w-5 text-white" />
              </div>
              WCAG Compliance Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {complianceData.map((item) => (
              <div key={item.level} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color}`}>
                      <span className="text-white font-bold text-sm">WCAG {item.level}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Level {item.level}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              Issue Severity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {severityBreakdown.map((item) => (
              <div
                key={item.severity}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color}`} />
                  <span className="font-medium text-gray-900 dark:text-white">{item.severity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                  <Badge variant="outline" className="font-medium">
                    {item.count}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
