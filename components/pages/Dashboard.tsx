"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { IssuesTrendChart } from "@/components/dashboard/IssuesTrendChart"
import { SeverityDistributionChart } from "@/components/dashboard/SeverityDistributionChart"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { ProjectOverview } from "@/components/dashboard/ProjectOverview"
import { RecentIssues } from "@/components/dashboard/RecentIssues"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { DashboardPageSkeleton } from "@/components/loading/PageLoadingSkeleton"
import { useTheme } from "@/contexts/ThemeContext"
import { Info, BookOpen, ExternalLink } from "lucide-react"

export function Dashboard() {
  const { mounted: themeMounted } = useTheme()
  const [contentLoaded, setContentLoaded] = useState(false)

  useEffect(() => {
    if (themeMounted) {
      const timer = setTimeout(() => setContentLoaded(true), 1800)
      return () => clearTimeout(timer)
    }
  }, [themeMounted])

  const pageContent = (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-down-slow">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Accessibility Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          Monitor and improve your website's accessibility compliance
        </p>
      </div>

      {/* WCAG Information Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 animate-fade-in-slow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">What is WCAG?</h3>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded">Learn More</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                <strong>WCAG (Web Content Accessibility Guidelines)</strong> is the international standard for making
                web content accessible to people with disabilities. It provides guidelines for creating websites that
                work for everyone, including users with visual, auditory, motor, and cognitive disabilities.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Level A</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Basic</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800">
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Level AA</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Standard</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800">
                  <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Level AAA</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Enhanced</span>
                </div>
                <a
                  href="https://www.w3.org/WAI/WCAG21/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm font-medium">Official Guidelines</span>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="animate-fade-in-delayed-slow">
        <StatsCards />
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 content-reveal">
        <div className="lg:col-span-2 space-y-8">
          <SeverityDistributionChart />
          <IssuesTrendChart />

        </div>
        <div className="space-y-8">
          <QuickActions />
          <ProjectOverview />
        </div>
      </div>

      {/* Recent Issues */}
      <div className="content-reveal">
        <RecentIssues />
      </div>
    </div>
  )

  return (
    <PageWrapper 
      skeleton={<DashboardPageSkeleton />}
      className="space-y-8"
    >
      {(!themeMounted || !contentLoaded) ? (
        <DashboardPageSkeleton />
      ) : (
        pageContent
      )}
    </PageWrapper>
  )
}
