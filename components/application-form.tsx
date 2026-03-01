"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CheckCircle2, User, FileText, MapPin, Phone } from "lucide-react"

type CalcData = {
  total_amount: number
  installment_term: number
  down_payment: number
  markup: number
  monthly_payment: number
  total_with_markup: number
}

export function ApplicationForm({
  open,
  onClose,
  calcData,
}: {
  open: boolean
  onClose: () => void
  calcData: CalcData | null
}) {
  const [fullName, setFullName] = useState("")
  const [passport, setPassport] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const resetForm = () => {
    setFullName("")
    setPassport("")
    setAddress("")
    setPhone("")
    setConsent(false)
    setError("")
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      setError("Необходимо согласие на обработку данных")
      return
    }
    if (!fullName || !passport || !address || !phone) {
      setError("Все поля обязательны для заполнения")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          passport,
          address,
          phone,
          consent,
          ...calcData,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Ошибка при отправке")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  if (!calcData) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl">Заявка отправлена</DialogTitle>
              <DialogDescription>
                Мы свяжемся с вами в ближайшее время для оформления рассрочки.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={handleClose}
              className="mt-4 rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Оформление рассрочки</DialogTitle>
              <DialogDescription>
                Заполните форму, и мы свяжемся с вами для оформления
              </DialogDescription>
            </DialogHeader>

            {/* Summary */}
            <div className="rounded-lg bg-secondary p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Сумма:</div>
                <div className="text-right font-medium text-foreground">
                  {Math.round(calcData.total_amount).toLocaleString("ru-RU")} сум
                </div>
                <div className="text-muted-foreground">Срок:</div>
                <div className="text-right font-medium text-foreground">
                  {calcData.installment_term} мес.
                </div>
                <div className="text-muted-foreground">Ежемесячно:</div>
                <div className="text-right font-semibold text-primary">
                  {Math.round(calcData.monthly_payment).toLocaleString("ru-RU")} сум
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  ФИО
                </Label>
                <Input
                  id="fullName"
                  placeholder="Иванов Иван Иванович"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="passport" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Паспорт (серия и номер)
                </Label>
                <Input
                  id="passport"
                  placeholder="AA 1234567"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Адрес
                </Label>
                <Input
                  id="address"
                  placeholder="г. Ташкент, ул. Навои, д. 10, кв. 5"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Номер телефона
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                  Я даю согласие на обработку моих персональных данных в
                  соответствии с политикой конфиденциальности
                </Label>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !consent}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить заявку"
                )}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
