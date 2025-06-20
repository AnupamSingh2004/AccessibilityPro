
import { useState, useEffect } from 'react'

interface NotificationSettings {
  enableNotifications: boolean
  autoDeleteAfterDays: number
  maxNotifications: number
}

const defaultSettings: NotificationSettings = {
  enableNotifications: true,
  autoDeleteAfterDays: 30,
  maxNotifications: 50
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)

  useEffect(() => {
    const saved = localStorage.getItem('notification-settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch {
        setSettings(defaultSettings)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('notification-settings', JSON.stringify(updated))
  }

  return { settings, updateSettings }
}