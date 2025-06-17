"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Palette, Globe, Save, Check, User } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useAccessibility } from "@/contexts/AccessibilityContext"

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { isCompactMode, setIsCompactMode, areAnimationsEnabled, setAreAnimationsEnabled } = useAccessibility()

  const [settings, setSettings] = useState({
    companyName: "Acme Corp",
    email: "john@company.com",
    timezone: "utc",
    emailNotifications: true,
    criticalAlerts: true,
    weeklyReports: false,
    twoFactor: false,
    autoLogout: true,
    scanFrequency: "daily",
    wcagLevel: "aa",
    autoScan: true,
    deepScan: false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setSaved(true)

      // Show success notification
      const notification = document.createElement("div")
      notification.className = "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      notification.textContent = "Settings saved successfully!"
      document.body.appendChild(notification)

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
        setSaved(false)
      }, 3000)
    }, 1000)
  }

  const handleChangePassword = () => {
    const currentPassword = prompt("Enter current password:")
    if (currentPassword) {
      const newPassword = prompt("Enter new password:")
      if (newPassword) {
        const confirmPassword = prompt("Confirm new password:")
        if (newPassword === confirmPassword) {
          alert("Password changed successfully!")
        } else {
          alert("Passwords don't match!")
        }
      }
    }
  }

  const handleExportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      user: "john.doe@company.com",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `accessibility-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Configure your accessibility monitoring preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={settings.companyName}
                onChange={(e) => handleSettingChange("companyName", e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange("email", e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time</SelectItem>
                  <SelectItem value="pst">Pacific Time</SelectItem>
                  <SelectItem value="cst">Central Time</SelectItem>
                  <SelectItem value="mst">Mountain Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card
          className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-900/10 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive email alerts for new issues</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="critical-alerts">Critical Issue Alerts</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Immediate alerts for critical issues</p>
              </div>
              <Switch
                id="critical-alerts"
                checked={settings.criticalAlerts}
                onCheckedChange={(checked) => handleSettingChange("criticalAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports">Weekly Reports</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly summary reports</p>
              </div>
              <Switch
                id="weekly-reports"
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card
          className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/10 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
              </div>
              <Switch
                id="two-factor"
                checked={settings.twoFactor}
                onCheckedChange={(checked) => handleSettingChange("twoFactor", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session-timeout">Auto Logout</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically logout after inactivity</p>
              </div>
              <Switch
                id="session-timeout"
                checked={settings.autoLogout}
                onCheckedChange={(checked) => handleSettingChange("autoLogout", checked)}
              />
            </div>

            <Button
              variant="outline"
              className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card
          className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50 dark:from-gray-900 dark:to-pink-900/10 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme Preference</Label>
              <Select value={theme} onValueChange={toggleTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations">Enable Animations</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smooth transitions and effects</p>
              </div>
              <Switch id="animations" checked={areAnimationsEnabled} onCheckedChange={setAreAnimationsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reduce spacing for more content</p>
              </div>
              <Switch id="compact-mode" checked={isCompactMode} onCheckedChange={setIsCompactMode} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanning Settings */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-900 dark:to-indigo-900/10 animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            Scanning Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scan-frequency">Scan Frequency</Label>
                <Select
                  value={settings.scanFrequency}
                  onValueChange={(value) => handleSettingChange("scanFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wcag-level">WCAG Compliance Level</Label>
                <Select value={settings.wcagLevel} onValueChange={(value) => handleSettingChange("wcagLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Level A</SelectItem>
                    <SelectItem value="aa">Level AA</SelectItem>
                    <SelectItem value="aaa">Level AAA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-scan">Auto Scan New Pages</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically scan newly discovered pages</p>
                </div>
                <Switch
                  id="auto-scan"
                  checked={settings.autoScan}
                  onCheckedChange={(checked) => handleSettingChange("autoScan", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="deep-scan">Deep Scanning</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">More thorough but slower scans</p>
                </div>
                <Switch
                  id="deep-scan"
                  checked={settings.deepScan}
                  onCheckedChange={(checked) => handleSettingChange("deepScan", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-900 dark:to-orange-900/10 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleExportData} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              Export Settings
            </Button>
            <Button
              variant="outline"
              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              onClick={() => {
                if (confirm("Are you sure you want to reset all settings to default?")) {
                  alert("Settings reset to default!")
                }
              }}
            >
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end animate-fade-in">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-8 disabled:opacity-70"
        >
          {saving ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
