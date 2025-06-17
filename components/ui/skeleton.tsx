import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted loading-shimmer-enhanced",
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 animate-fade-in-slow", 
        className
      )} 
      {...props}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-14" />
        </div>
        {children}
      </div>
    </div>
  )
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 animate-fade-in-slow">
      <div className="space-y-4">
        {/* Table header */}
        <div className="flex space-x-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-6 flex-1" 
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4 items-center">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton 
                key={j} 
                className="h-8 flex-1" 
                style={{ animationDelay: `${(i * 6 + j) * 50}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in-slow">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-4"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 animate-fade-in-slow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center justify-center h-48">
          <Skeleton className="h-40 w-40 rounded-full animate-pulse-slow" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStats, SkeletonChart }
