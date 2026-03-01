"use client"

import { useState, useMemo } from "react"
import { Settings } from "@/lib/db"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, Clock, Percent, CreditCard } from "lucide-react"

function formatNumber(num: number): string {
  return Math.round(num).toLocaleString("ru-RU")
}

export function InstallmentCalculator({
  settings,
  onApply,
}: {
  settings: Settings
  onApply: (data: {
    total_amount: number
    installment_term: number
    down_payment: number
    markup: number
    monthly_payment: number
    total_with_markup: number
  }) => void
}) {
  const minAmount = Number(settings.min_amount) || 100000
  const maxAmount = Number(settings.max_amount) || 10000000
  const minTerm = Number(settings.min_term) || 3
  const maxTerm = Number(settings.max_term) || 24
  const defaultMarkup = Number(settings.default_markup) || 10
  const minDown = Number(settings.min_down_payment) || 0
  const maxDown = Number(settings.max_down_payment) || 50

  const [amount, setAmount] = useState(Math.round((minAmount + maxAmount) / 2))
  const [term, setTerm] = useState(Math.round((minTerm + maxTerm) / 2))
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    Math.round((minDown + maxDown) / 2)
  )

  const calc = useMemo(() => {
    const downPayment = (amount * downPaymentPercent) / 100
    const base = amount - downPayment
    const markupAmount = (base * defaultMarkup) / 100
    const totalWithMarkup = base + markupAmount
    const monthly = totalWithMarkup / term

    return {
      downPayment,
      totalWithMarkup: totalWithMarkup + downPayment,
      monthly,
      markupAmount,
    }
  }, [amount, term, downPaymentPercent, defaultMarkup])

  const handleApply = () => {
    onApply({
      total_amount: amount,
      installment_term: term,
      down_payment: calc.downPayment,
      markup: defaultMarkup,
      monthly_payment: calc.monthly,
      total_with_markup: calc.totalWithMarkup,
    })
  }

  return (
    <section id="calculator" className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Калькулятор рассрочки
        </h2>
        <p className="mt-3 text-muted-foreground">
          Настройте параметры и узнайте ежемесячный платёж
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Controls */}
        <Card className="border-border shadow-sm lg:col-span-3">
          <CardContent className="flex flex-col gap-8 p-6 md:p-8">
            {/* Amount */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Banknote className="h-4 w-4 text-primary" />
                  Сумма рассрочки
                </label>
                <span className="text-lg font-semibold text-primary">
                  {formatNumber(amount)} сум
                </span>
              </div>
              <Slider
                value={[amount]}
                onValueChange={([v]) => setAmount(v)}
                min={minAmount}
                max={maxAmount}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatNumber(minAmount)} сум</span>
                <span>{formatNumber(maxAmount)} сум</span>
              </div>
            </div>

            {/* Term */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Срок рассрочки
                </label>
                <span className="text-lg font-semibold text-primary">
                  {term} мес.
                </span>
              </div>
              <Slider
                value={[term]}
                onValueChange={([v]) => setTerm(v)}
                min={minTerm}
                max={maxTerm}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{minTerm} мес.</span>
                <span>{maxTerm} мес.</span>
              </div>
            </div>

            {/* Down payment */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Первоначальный взнос
                </label>
                <span className="text-lg font-semibold text-primary">
                  {downPaymentPercent}% ({formatNumber(calc.downPayment)} сум)
                </span>
              </div>
              <Slider
                value={[downPaymentPercent]}
                onValueChange={([v]) => setDownPaymentPercent(v)}
                min={minDown}
                max={maxDown}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{minDown}%</span>
                <span>{maxDown}%</span>
              </div>
            </div>

            {/* Markup info */}
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Наценка за товар: <strong className="text-foreground">{defaultMarkup}%</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="border-primary/20 bg-primary/5 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Итого
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 p-6 pt-0 md:p-8 md:pt-0">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Сумма товара</span>
                <span className="font-medium text-foreground">{formatNumber(amount)} сум</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Первоначальный взнос</span>
                <span className="font-medium text-foreground">{formatNumber(calc.downPayment)} сум</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Наценка ({defaultMarkup}%)</span>
                <span className="font-medium text-foreground">{formatNumber(calc.markupAmount)} сум</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Срок</span>
                <span className="font-medium text-foreground">{term} мес.</span>
              </div>
            </div>

            <div className="rounded-lg bg-primary p-4">
              <div className="mb-1 text-sm text-primary-foreground/80">
                Ежемесячный платёж
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {formatNumber(calc.monthly)} сум
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">
                Всего к оплате
              </div>
              <div className="text-xl font-bold text-foreground">
                {formatNumber(calc.totalWithMarkup)} сум
              </div>
            </div>

            <button
              onClick={handleApply}
              className="mt-2 w-full rounded-lg bg-accent py-3.5 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Оформить рассрочку
            </button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
