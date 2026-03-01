"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  FileText,
  LogOut,
  Save,
  Loader2,
  Calculator,
  Phone,
  MapPin,
  Clock,
  Lock,
  Building,
} from "lucide-react"
import type { Settings as SettingsType } from "@/lib/db"

type Application = {
  id: number
  full_name: string
  passport: string
  address: string
  phone: string
  total_amount: number
  installment_term: number
  down_payment: number
  markup: number
  monthly_payment: number
  total_with_markup: number
  created_at: string
}

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [settings, setSettings] = useState<SettingsType>({})
  const [applications, setApplications] = useState<Application[]>([])
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [loadingApps, setLoadingApps] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [settingsRes, appsRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/applications"),
      ])
      if (settingsRes.ok) {
        const s = await settingsRes.json()
        setSettings(s)
      }
      if (appsRes.ok) {
        const a = await appsRes.json()
        setApplications(a)
      }
    } catch (err) {
      console.error("Failed to load data:", err)
    } finally {
      setLoadingApps(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage("")

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setSaveMessage("Настройки сохранены")
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage("Ошибка сохранения")
      }
    } catch {
      setSaveMessage("Ошибка сохранения")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Админ-панель</h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <Tabs defaultValue="settings">
          <TabsList className="mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Заявки ({applications.length})
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="flex flex-col gap-6">
              {/* Calculator settings */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calculator className="h-5 w-5 text-primary" />
                    Настройки калькулятора
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Мин. сумма (сум)</Label>
                    <Input
                      type="number"
                      value={settings.min_amount || ""}
                      onChange={(e) => updateSetting("min_amount", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Макс. сумма (сум)</Label>
                    <Input
                      type="number"
                      value={settings.max_amount || ""}
                      onChange={(e) => updateSetting("max_amount", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Мин. срок (мес)</Label>
                    <Input
                      type="number"
                      value={settings.min_term || ""}
                      onChange={(e) => updateSetting("min_term", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Макс. срок (мес)</Label>
                    <Input
                      type="number"
                      value={settings.max_term || ""}
                      onChange={(e) => updateSetting("max_term", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Наценка (%)</Label>
                    <Input
                      type="number"
                      value={settings.default_markup || ""}
                      onChange={(e) => updateSetting("default_markup", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Мин. первоначальный взнос (%)</Label>
                    <Input
                      type="number"
                      value={settings.min_down_payment || ""}
                      onChange={(e) => updateSetting("min_down_payment", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Макс. первоначальный взнос (%)</Label>
                    <Input
                      type="number"
                      value={settings.max_down_payment || ""}
                      onChange={(e) => updateSetting("max_down_payment", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact settings */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-5 w-5 text-primary" />
                    Контактная информация
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-muted-foreground" />
                      Название компании
                    </Label>
                    <Input
                      value={settings.company_name || ""}
                      onChange={(e) => updateSetting("company_name", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Телефон
                    </Label>
                    <Input
                      value={settings.phone || ""}
                      onChange={(e) => updateSetting("phone", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Адрес
                    </Label>
                    <Input
                      value={settings.address || ""}
                      onChange={(e) => updateSetting("address", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      График работы
                    </Label>
                    <Input
                      value={settings.work_hours || ""}
                      onChange={(e) => updateSetting("work_hours", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Password */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lock className="h-5 w-5 text-primary" />
                    Пароль администратора
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex max-w-sm flex-col gap-2">
                    <Label>Новый пароль</Label>
                    <Input
                      type="password"
                      value={settings.admin_password || ""}
                      onChange={(e) => updateSetting("admin_password", e.target.value)}
                      placeholder="Введите новый пароль"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Сохранить настройки
                </button>
                {saveMessage && (
                  <span className="text-sm font-medium text-accent">
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Поступившие заявки</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingApps ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : applications.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Заявок пока нет
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-lg border border-border p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">
                            {app.full_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(app.created_at).toLocaleString("ru-RU")}
                          </span>
                        </div>
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <div>
                            <span className="text-muted-foreground">Паспорт: </span>
                            <span className="text-foreground">{app.passport}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Телефон: </span>
                            <span className="text-foreground">{app.phone}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-muted-foreground">Адрес: </span>
                            <span className="text-foreground">{app.address}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Сумма: </span>
                            <span className="font-medium text-foreground">
                              {Number(app.total_amount).toLocaleString("ru-RU")} сум
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Срок: </span>
                            <span className="text-foreground">{app.installment_term} мес.</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ежемесячно: </span>
                            <span className="font-medium text-primary">
                              {Number(app.monthly_payment).toLocaleString("ru-RU")} сум
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Итого: </span>
                            <span className="font-medium text-foreground">
                              {Number(app.total_with_markup).toLocaleString("ru-RU")} сум
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
