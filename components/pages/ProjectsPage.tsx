"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import { Plus, Globe, Calendar, Activity, ExternalLink, Search, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function ProjectsPage() {
  const { projects, addProject, currentProject, setCurrentProject, issues } = useAccessibility()
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectUrl, setNewProjectUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddProject = () => {
    if (newProjectName.trim() && newProjectUrl.trim()) {
      const newProject = {
        id: `project-${Date.now()}`,
        name: newProjectName.trim(),
        url: newProjectUrl.trim(),
        lastScan: new Date().toISOString(),
        issueCount: Math.floor(Math.random() * 50) + 1,
        status: "active" as const,
      }

      addProject(newProject)
      setNewProjectName("")
      setNewProjectUrl("")
      setShowAddProject(false)

      // Show success notification
      const notification = document.createElement("div")
      notification.className =
        "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in"
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Project "${newProject.name}" added successfully!</span>
        </div>
      `
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 4000)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getProjectIssues = (projectId: string) => {
    return issues.filter((issue) => issue.projectId === projectId)
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-down">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Project Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Monitor and manage accessibility across all your projects
            </p>
          </div>
          <Button
            onClick={() => setShowAddProject(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-12 px-8 text-lg font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Project
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {projects.filter((p) => p.status === "active").length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Project Form */}
      {showAddProject && (
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl animate-scale-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              Add New Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Name</label>
                <Input
                  placeholder="e.g., E-commerce Website"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="h-12 text-lg bg-gray-50/50 dark:bg-gray-800/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Website URL</label>
                <Input
                  placeholder="https://example.com"
                  value={newProjectUrl}
                  onChange={(e) => setNewProjectUrl(e.target.value)}
                  className="h-12 text-lg bg-gray-50/50 dark:bg-gray-800/50"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddProject}
                disabled={!newProjectName.trim() || !newProjectUrl.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-12 px-8 font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Project
              </Button>
              <Button variant="outline" onClick={() => setShowAddProject(false)} className="h-12 px-8 font-semibold">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
        {filteredProjects.map((project, index) => {
          const projectIssues = getProjectIssues(project.id)
          const criticalIssues = projectIssues.filter((issue) => issue.severity === "critical").length
          const resolvedIssues = projectIssues.filter((issue) => issue.status === "resolved").length

          return (
            <Card
              key={project.id}
              className={cn(
                "border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group",
                currentProject?.id === project.id &&
                  "ring-2 ring-blue-500 shadow-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setCurrentProject(project)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{project.url}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Issue Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalIssues}</div>
                    <div className="text-xs font-medium text-red-600 dark:text-red-400">Critical</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{project.issueCount}</div>
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Total</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{resolvedIssues}</div>
                    <div className="text-xs font-medium text-green-600 dark:text-green-400">Resolved</div>
                  </div>
                </div>

                {/* Last Scan Info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last scan</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDistanceToNow(new Date(project.lastScan), { addSuffix: true })}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-10 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-900/20"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Site
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-900/20"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Scan Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardContent className="p-16 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl w-fit mx-auto mb-6">
              <Globe className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery ? "Try adjusting your search criteria." : "Get started by adding your first project."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddProject(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-12 px-8 font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
