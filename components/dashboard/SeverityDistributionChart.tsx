"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { useEffect, useState } from "react"

// Define proper types
interface SeverityConfig {
  key: "critical" | "high" | "medium" | "low"
  label: string
  shortLabel: string
  color: string
  colorEnd: string
  bgColor: string
  borderColor: string
}

interface SeverityDataItem extends SeverityConfig {
  count: number
}

export function SeverityDistributionChart() {
  const { issues } = useAccessibility()
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)

  const severityConfig: SeverityConfig[] = [
    {
      key: "critical",
      label: "Critical Issues",
      shortLabel: "Critical",
      color: "#ef4444",
      colorEnd: "#dc2626",
      bgColor: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgba(239, 68, 68, 0.2)",
    },
    {
      key: "high",
      label: "High Issues", 
      shortLabel: "High",
      color: "#f97316",
      colorEnd: "#ea580c",
      bgColor: "rgba(249, 115, 22, 0.1)",
      borderColor: "rgba(249, 115, 22, 0.2)",
    },
    {
      key: "medium",
      label: "Medium Issues",
      shortLabel: "Medium", 
      color: "#eab308",
      colorEnd: "#ca8a04",
      bgColor: "rgba(234, 179, 8, 0.1)",
      borderColor: "rgba(234, 179, 8, 0.2)",
    },
    {
      key: "low",
      label: "Low Issues",
      shortLabel: "Low",
      color: "#3b82f6",
      colorEnd: "#2563eb", 
      bgColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.2)",
    },
  ]

  const severityData: SeverityDataItem[] = severityConfig.map(config => ({
    ...config,
    count: issues.filter((i) => i.severity === config.key).length,
  }))

  const total = severityData.reduce((sum, item) => sum + item.count, 0)
  const radius = 70
  const strokeWidth = 16
  const circumference = 2 * Math.PI * radius
  
  const displayData = severityData.filter(item => item.count > 0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 400)

    const progressTimer = setTimeout(() => {
      let progress = 0
      const duration = 1200
      const steps = 60
      const increment = total / steps
      const stepDuration = duration / steps

      const progressInterval = setInterval(() => {
        progress += increment
        if (progress >= total) {
          progress = total
          clearInterval(progressInterval)
        }
        setAnimationProgress(Math.floor(progress))
      }, stepDuration)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearTimeout(progressTimer)
    }
  }, [total])

  const formatPercentage = (count: number): string => {
    if (total === 0) return '0%'
    return `${Math.round((count / total) * 100)}%`
  }

  // Helper function to safely get count by severity key
  const getCountBySeverity = (severityKey: SeverityConfig['key']): number => {
    return severityData.find(s => s.key === severityKey)?.count ?? 0
  }

  // Calculate priority counts safely
  const highPriorityCount = getCountBySeverity('critical') + getCountBySeverity('high')
  const mediumPriorityCount = getCountBySeverity('medium')
  const lowPriorityCount = getCountBySeverity('low')

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Severity Distribution</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Accessibility issues breakdown by severity level</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Total: {total} Issues</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Chart Section */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="relative w-80 h-80">
                  <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl" viewBox="0 0 160 160">
                    {/* Background circle with subtle glow */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="rgba(209, 213, 219, 0.3)"
                      strokeWidth={strokeWidth}
                      className="dark:stroke-gray-600/30"
                    />

                    {/* Outer glow ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius + 8}
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.1)"
                      strokeWidth="2"
                    />

                    {/* Data segments */}
                    {total > 0 && displayData.map((item, index) => {
                      const percentage = (item.count / total) * 100
                      const segmentLength = (percentage / 100) * circumference
                      
                      const previousSegments = displayData.slice(0, index)
                      const previousLength = previousSegments.reduce((sum, prevItem) => {
                        return sum + (prevItem.count / total) * circumference
                      }, 0)

                      return (
                        <g key={item.key}>
                          {/* Outer glow effect */}
                          <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={strokeWidth + 4}
                            strokeDasharray={`${segmentLength} ${circumference}`}
                            strokeDashoffset={-previousLength}
                            strokeLinecap="round"
                            opacity="0.4"
                            className="blur-sm"
                            style={{
                              strokeDasharray: isAnimating ? `${segmentLength} ${circumference}` : '0 440',
                              transition: `stroke-dasharray 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 300}ms`
                            }}
                          />
                          
                          {/* Main segment */}
                          <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            stroke={`url(#gradient-${index})`}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${segmentLength} ${circumference}`}
                            strokeDashoffset={-previousLength}
                            strokeLinecap="round"
                            style={{
                              strokeDasharray: isAnimating ? `${segmentLength} ${circumference}` : '0 440',
                              transition: `stroke-dasharray 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 300}ms`
                            }}
                          />
                        </g>
                      )
                    })}

                    {/* Gradient definitions */}
                    <defs>
                      {displayData.map((item, index) => (
                        <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={item.color} stopOpacity="0.9" />
                          <stop offset="100%" stopColor={item.colorEnd} stopOpacity="1" />
                        </linearGradient>
                      ))}
                    </defs>
                  </svg>

                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="text-center transform transition-all duration-1000 ease-out"
                      style={{
                        opacity: isAnimating ? 1 : 0,
                        transform: isAnimating ? 'scale(1)' : 'scale(0.7)',
                        transitionDelay: '1.5s'
                      }}
                    >
                      <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                        {animationProgress}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">
                        Total Issues
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Breakdown Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Issue Breakdown</h3>
                <div className="space-y-4">
                  {severityData.map((item, index) => (
                    <div
                      key={item.key}
                      className="group transition-all duration-300 hover:scale-[1.02]"
                      style={{ 
                        opacity: isAnimating ? 1 : 0,
                        transform: isAnimating ? 'translateX(0)' : 'translateX(30px)',
                        transitionDelay: `${index * 200 + 1800}ms`
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full shadow-lg"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                          <span className="text-gray-500 dark:text-gray-500 text-sm">{formatPercentage(item.count)} of total</span>
                        </div>
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: item.color }}
                        >
                          {item.count}
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            background: `linear-gradient(90deg, ${item.color}, ${item.colorEnd})`,
                            width: isAnimating ? `${(item.count / Math.max(total, 1)) * 100}%` : '0%',
                            transitionDelay: `${index * 200 + 2000}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Priority Summary */}
          <div 
            className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50"
            style={{ 
              opacity: isAnimating ? 1 : 0,
              transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '2.5s',
              transition: 'all 0.8s ease-out'
            }}
          >
            <div className="text-center p-4 rounded-xl bg-gray-100/30 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">High Priority</div>
              <div className="text-3xl font-bold text-red-500 dark:text-red-400">
                {highPriorityCount}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-100/30 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Medium Priority</div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {mediumPriorityCount}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-100/30 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Low Priority</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {lowPriorityCount}
              </div>
            </div>
          </div>

          {/* Empty state */}
          {total === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Issues Found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Great news! No accessibility issues have been detected. Start scanning your projects to monitor accessibility compliance.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}