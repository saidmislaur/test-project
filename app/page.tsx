"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { InstallmentCalculator } from "@/components/installment-calculator"
import { ApplicationForm } from "@/components/application-form"
import { SiteFooter } from "@/components/site-footer"
import type { Settings } from "@/lib/db"

type CalcData = {
  total_amount: number
  installment_term: number
  down_payment: number
  markup: number
  monthly_payment: number
  total_with_markup: number
}

export default function HomePage() {
  const [settings, setSettings] = useState<Settings>({})
  const [formOpen, setFormOpen] = useState(false)
  const [calcData, setCalcData] = useState<CalcData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleApply = (data: CalcData) => {
    setCalcData(data)
    setFormOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Hero settings={settings} />
      <InstallmentCalculator settings={settings} onApply={handleApply} />
      <ApplicationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        calcData={calcData}
      />
      <SiteFooter settings={settings} />
    </main>
  )
}
