"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccessibility } from "@/contexts/AccessibilityContext"
import type { SeverityLevel } from "@/types/accessibility"

export function AddIssuePage() {
  const router = useRouter()
  const { addNewIssue, projects, currentProject } = useAccessibility()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as SeverityLevel,
    type: "",
    element: "",
    location: "",
    wcagGuideline: "",
    howToFix: "",
    projectId: currentProject?.id || projects[0]?.id || "1",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.title || !formData.description || !formData.type || !formData.location) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      // Add the new issue
      addNewIssue({
        ...formData,
        lastDetected: new Date().toISOString(),
        status: "new",
      })

      // Show success notification
      const notification = document.createElement("div")
      notification.className = "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      notification.textContent = "Issue added successfully!"
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)

      // Redirect to issues page
      router.push("/issues")
    } catch (error) {
      console.error("Error adding issue:", error)
      alert("Failed to add issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const issueTypes = [
    "Images",
    "Forms",
    "Color Contrast",
    "Keyboard",
    "Structure",
    "Links",
    "Focus",
    "Media",
    "Navigation",
    "Content",
  ]

  const wcagGuidelines = [
    "WCAG 2.1 - 1.1.1 Non-text Content",
    "WCAG 2.1 - 1.3.1 Info and Relationships",
    "WCAG 2.1 - 1.4.3 Contrast (Minimum)",
    "WCAG 2.1 - 2.1.1 Keyboard",
    "WCAG 2.1 - 2.4.4 Link Purpose",
    "WCAG 2.1 - 2.4.7 Focus Visible",
    "WCAG 2.1 - 1.4.2 Audio Control",
    "WCAG 2.1 - 3.2.2 On Input",
  ]

  return (
    <div className="space-y-6 mobile-responsive">
      {/* Header */}
      <div className="animate-slide-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Add New Issue
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Report a new accessibility issue for manual tracking</p>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            Issue Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief description of the issue"
                    required
                    className="transition-all focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Issue Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value: SeverityLevel) => handleInputChange("severity", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="critical">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Critical
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select value={formData.projectId} onValueChange={(value) => handleInputChange("projectId", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Page Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="/page-url or page identifier"
                    required
                    className="transition-all focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="element">HTML Element</Label>
                  <Input
                    id="element"
                    value={formData.element}
                    onChange={(e) => handleInputChange("element", e.target.value)}
                    placeholder='<button class="submit-btn">'
                    className="font-mono text-sm transition-all focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wcag">WCAG Guideline</Label>
                  <Select
                    value={formData.wcagGuideline}
                    onValueChange={(value) => handleInputChange("wcagGuideline", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select WCAG guideline" />
                    </SelectTrigger>
                    <SelectContent>
                      {wcagGuidelines.map((guideline) => (
                        <SelectItem key={guideline} value={guideline}>
                          {guideline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Issue Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Detailed description of the accessibility issue..."
                rows={4}
                required
                className="transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* How to Fix */}
            <div className="space-y-2">
              <Label htmlFor="howToFix">How to Fix</Label>
              <Textarea
                id="howToFix"
                value={formData.howToFix}
                onChange={(e) => handleInputChange("howToFix", e.target.value)}
                placeholder="Steps to resolve this accessibility issue..."
                rows={3}
                className="transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="mobile-button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 mobile-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Issue
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
