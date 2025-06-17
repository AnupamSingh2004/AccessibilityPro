"use client"

import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccessibility } from "@/contexts/AccessibilityContext"

export function StatsCards() {
  const { issues, currentProject } = useAccessibility()

  const projectIssues = currentProject ? issues.filter((issue) => issue.projectId === currentProject.id) : issues

  const stats = {
    total: projectIssues.length,
    critical: projectIssues.filter((issue) => issue.severity === "critical").length,
    high: projectIssues.filter((issue) => issue.severity === "high").length,
    resolved: projectIssues.filter((issue) => issue.status === "resolved").length,
  }

  const cards = [
    {
      title: "Total Issues",
      value: stats.total,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "Critical Issues",
      value: stats.critical,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "High Priority",
      value: stats.high,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
