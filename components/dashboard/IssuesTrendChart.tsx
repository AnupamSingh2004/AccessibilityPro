"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Activity } from "lucide-react"
import { useState, useEffect } from "react"

export function IssuesTrendChart() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Mock data for the chart
  const data = [
    { date: "Jan", issues: 45, resolved: 12 },
    { date: "Feb", issues: 52, resolved: 18 },
    { date: "Mar", issues: 38, resolved: 25 },
    { date: "Apr", issues: 61, resolved: 32 },
    { date: "May", issues: 42, resolved: 28 },
    { date: "Jun", issues: 35, resolved: 35 },
  ]

  const maxValue = Math.max(...data.map((d) => Math.max(d.issues, d.resolved)))
  const minValue = 0
  const chartHeight = 240
  const chartWidth = 100 // percentage

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Helper function to calculate point position
  const getPointPosition = (value, index) => ({
    x: (index / (data.length - 1)) * chartWidth,
    y: chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight,
  })

  // Generate path string for SVG
  const generatePath = (dataKey) => {
    const points = data.map((item, index) => getPointPosition(item[dataKey], index))
    return points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`
      }
      const prevPoint = points[index - 1]
      const cpx1 = prevPoint.x + (point.x - prevPoint.x) * 0.4
      const cpx2 = point.x - (point.x - prevPoint.x) * 0.4
      return `${path} C ${cpx1} ${prevPoint.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`
    }, '')
  }

  return (
    <Card className="border border-gray-200/60 dark:border-gray-700/60 shadow-xl bg-gradient-to-br from-white via-gray-50/30 to-blue-50/40 dark:from-gray-900 dark:via-gray-800/50 dark:to-blue-900/20 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-transparent to-blue-50/30 dark:to-blue-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Issues Trend
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200/50 dark:border-green-700/50">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">+12%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Chart Container */}
          <div className="relative p-6 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-800/20 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
            <div className="relative h-64 w-full">
              {/* Grid Lines */}
              <div className="absolute inset-0">
                {[0.25, 0.5, 0.75, 1].map((ratio) => (
                  <div
                    key={ratio}
                    className="absolute w-full border-t border-gray-200/40 dark:border-gray-600/40 border-dashed"
                    style={{ top: `${(1 - ratio) * 100}%` }}
                  />
                ))}
                {/* Vertical grid lines */}
                {data.map((_, index) => (
                  <div
                    key={index}
                    className="absolute h-full border-l border-gray-200/30 dark:border-gray-600/30 border-dashed"
                    style={{ left: `${(index / (data.length - 1)) * 100}%` }}
                  />
                ))}
              </div>

              {/* Y-axis labels */}
              <div className="absolute -left-12 inset-y-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                {[maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), 0].map((value) => (
                  <span key={value} className="font-medium">{value}</span>
                ))}
              </div>

              {/* SVG Chart */}
              <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="issuesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="resolvedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Area fills */}
                {isVisible && (
                  <>
                    <path
                      d={`${generatePath('issues')} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                      fill="url(#issuesGradient)"
                      className="animate-in fade-in-0 duration-1000"
                      style={{ animationDelay: '200ms' }}
                    />
                    <path
                      d={`${generatePath('resolved')} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                      fill="url(#resolvedGradient)"
                      className="animate-in fade-in-0 duration-1000"
                      style={{ animationDelay: '400ms' }}
                    />
                  </>
                )}

                {/* Lines */}
                {isVisible && (
                  <>
                    <path
                      d={generatePath('issues')}
                      fill="none"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="3"
                      className="drop-shadow-sm animate-in fade-in-0 duration-1000"
                      style={{ 
                        animationDelay: '600ms',
                        strokeDasharray: '1000',
                        strokeDashoffset: isVisible ? '0' : '1000',
                        transition: 'stroke-dashoffset 2s ease-out'
                      }}
                    />
                    <path
                      d={generatePath('resolved')}
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="3"
                      className="drop-shadow-sm animate-in fade-in-0 duration-1000"
                      style={{ 
                        animationDelay: '800ms',
                        strokeDasharray: '1000',
                        strokeDashoffset: isVisible ? '0' : '1000',
                        transition: 'stroke-dashoffset 2s ease-out'
                      }}
                    />
                  </>
                )}
              </svg>

              {/* Interactive Points */}
              <div className="absolute inset-0">
                {data.map((item, index) => {
                  const issuesPos = getPointPosition(item.issues, index)
                  const resolvedPos = getPointPosition(item.resolved, index)
                  
                  return (
                    <div key={index}>
                      {/* Issues point */}
                      <div
                        className={`absolute w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full shadow-lg transform -translate-x-1.5 -translate-y-1.5 cursor-pointer transition-all duration-300 hover:scale-150 hover:shadow-xl ${
                          isVisible ? 'animate-in zoom-in-0' : 'scale-0'
                        }`}
                        style={{
                          left: `${issuesPos.x}%`,
                          top: `${issuesPos.y}px`,
                          animationDelay: `${1000 + index * 100}ms`,
                        }}
                        onMouseEnter={() => setHoveredPoint({ index, type: 'issues', value: item.issues, date: item.date })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      
                      {/* Resolved point */}
                      <div
                        className={`absolute w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-lg transform -translate-x-1.5 -translate-y-1.5 cursor-pointer transition-all duration-300 hover:scale-150 hover:shadow-xl ${
                          isVisible ? 'animate-in zoom-in-0' : 'scale-0'
                        }`}
                        style={{
                          left: `${resolvedPos.x}%`,
                          top: `${resolvedPos.y}px`,
                          animationDelay: `${1200 + index * 100}ms`,
                        }}
                        onMouseEnter={() => setHoveredPoint({ index, type: 'resolved', value: item.resolved, date: item.date })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Tooltip */}
              {hoveredPoint && (
                <div
                  className="absolute z-10 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in-0 zoom-in-95 duration-200"
                  style={{
                    left: `${(hoveredPoint.index / (data.length - 1)) * 100}%`,
                    top: '-50px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="text-center">
                    <div className="font-semibold">{hoveredPoint.date}</div>
                    <div className={hoveredPoint.type === 'issues' ? 'text-red-300 dark:text-red-600' : 'text-green-300 dark:text-green-600'}>
                      {hoveredPoint.type === 'issues' ? 'Issues' : 'Resolved'}: {hoveredPoint.value}
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                </div>
              )}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-4 px-2">
              {data.map((item, index) => (
                <span key={index} className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                  {item.date}
                </span>
              ))}
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-200/60 dark:border-gray-700/60">
            <div className="flex items-center gap-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200/50 dark:border-red-700/50">
              <div className="w-4 h-0.5 bg-red-500 rounded-full" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">New Issues</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
              <div className="w-4 h-0.5 bg-green-500 rounded-full" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Resolved</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.reduce((sum, item) => sum + item.issues, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Issues</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.reduce((sum, item) => sum + item.resolved, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Resolved</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round((data.reduce((sum, item) => sum + item.resolved, 0) / data.reduce((sum, item) => sum + item.issues, 0)) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}