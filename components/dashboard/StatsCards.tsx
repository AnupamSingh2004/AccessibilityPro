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
    <div className="grid-adaptive-stats gap-fluid-sm sm:gap-fluid-md">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={cn(
            "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in bg-gradient-to-br rounded-responsive-lg gpu-accelerated min-h-[120px] sm:min-h-[140px]",
            stat.bgColor,
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="spacing-fluid-xs sm:spacing-fluid-sm">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1 min-w-0">
                <p className="text-fluid-xs sm:text-fluid-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 truncate">
                  {stat.title}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <h3 className="text-fluid-2xl sm:text-fluid-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <div
                    className={cn(
                      "flex items-center text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full self-start sm:self-center flex-shrink-0",
                      stat.trend === "up"
                        ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
                        : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
                    )}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    )}
                    <span className="text-xs">{stat.change}</span>
                  </div>
                </div>
              </div>
              <div className={cn("p-2 sm:p-3 rounded-responsive bg-gradient-to-br shadow-lg flex-shrink-0 ml-2 sm:ml-3", stat.color)}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
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
