"use client"

import { Settings } from "@/lib/db"
import { Calculator } from "lucide-react"

export function Hero({ settings }: { settings: Settings }) {
  const companyName = settings.company_name || "РассрочкаПро"

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-32">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground" />
      </div>
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
        <div className="flex items-center gap-3 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2">
          <Calculator className="h-5 w-5 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">
            {companyName}
          </span>
        </div>
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl">
          Рассрочка на ваших условиях
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-primary-foreground/80 md:text-xl">
          Рассчитайте стоимость рассрочки и оформите заявку онлайн за пару минут.
          Прозрачные условия, без скрытых комиссий.
        </p>
        <button
          onClick={scrollToCalculator}
          className="mt-4 rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Рассчитать рассрочку
        </button>
      </div>
    </section>
  )
}
