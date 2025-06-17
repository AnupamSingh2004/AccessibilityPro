"use client"

import { AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { cn } from "@/lib/utils"

export function StatsCards() {
  const { issues, currentProject } = useAccessibility()

  const projectIssues = currentProject ? issues.filter((issue) => issue.projectId === currentProject.id) : issues

  const stats = [
    {
      title: "Total Issues",
      value: projectIssues.length,
      change: "+12%",
      trend: "up",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Critical Issues",
      value: projectIssues.filter((issue) => issue.severity === "critical").length,
      change: "-8%",
      trend: "down",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "In Progress",
      value: projectIssues.filter((issue) => issue.status === "in-progress").length,
      change: "+24%",
      trend: "up",
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Resolved",
      value: projectIssues.filter((issue) => issue.status === "resolved").length,
      change: "+18%",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10",
      textColor: "text-green-600 dark:text-green-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={cn(
            "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in bg-gradient-to-br",
            stat.bgColor,
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  <div
                    className={cn(
                      "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                      stat.trend === "up"
                        ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
                        : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
                    )}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
              <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg", stat.color)}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Animated background gradient */}
            <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-r animate-gradient-x", stat.color)} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
