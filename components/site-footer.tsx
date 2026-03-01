"use client"

import { Settings } from "@/lib/db"
import { Phone, MapPin, Clock, Calculator } from "lucide-react"

export function SiteFooter({ settings }: { settings: Settings }) {
  const companyName = settings.company_name || "РассрочкаПро"
  const phoneNum = settings.phone || "+998 90 123 45 67"
  const addr = settings.address || "г. Ташкент, ул. Навои, д. 10"
  const hours = settings.work_hours || "Пн-Пт: 9:00 - 18:00"

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">{companyName}</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Удобные условия рассрочки для покупки любых товаров. Быстрое
            оформление, прозрачные условия.
          </p>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Контакты
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={`tel:${phoneNum.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4 text-primary" />
              {phoneNum}
            </a>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {addr}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              {hours}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-4">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} {companyName}. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
