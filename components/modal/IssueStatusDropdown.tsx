"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IssueStatusDropdownProps {
  currentStatus: string
  onStatusChange: (status: string) => void
  getStatusColor: (status: string) => string
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'text-red-600' },
  { value: 'in-progress', label: 'In Progress', color: 'text-yellow-600' },
  { value: 'resolved', label: 'Resolved', color: 'text-green-600' },
  { value: 'ignored', label: 'Ignored', color: 'text-gray-600' }
]

export function IssueStatusDropdown({ currentStatus, onStatusChange, getStatusColor }: IssueStatusDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus)
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className={`${getStatusColor(currentStatus)} hover:opacity-80 transition-opacity text-xs sm:text-sm`}
      >
        {currentStatus.replace('-', ' ').toUpperCase()}
        <ChevronDown className="ml-1 h-3 w-3" />
      </Button>
      
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${option.color} flex items-center justify-between`}
            >
              {option.label}
              {currentStatus === option.value && (
                <CheckCircle className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}