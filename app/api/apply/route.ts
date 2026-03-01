import { getDb } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

async function sendToTelegram(data: {
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
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.log("[v0] Telegram not configured, skipping notification")
    return
  }

  const message = `
*Новая заявка на рассрочку*

*ФИО:* ${data.full_name}
*Паспорт:* ${data.passport}
*Адрес:* ${data.address}
*Телефон:* ${data.phone}

*Сумма рассрочки:* ${data.total_amount.toLocaleString("ru-RU")} сум
*Срок:* ${data.installment_term} мес.
*Первоначальный взнос:* ${data.down_payment.toLocaleString("ru-RU")} сум
*Наценка:* ${data.markup}%
*Ежемесячный платёж:* ${data.monthly_payment.toLocaleString("ru-RU")} сум
*Итого к оплате:* ${data.total_with_markup.toLocaleString("ru-RU")} сум
  `.trim()

  try {
    await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    )
  } catch (err) {
    console.error("[v0] Telegram send error:", err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      full_name,
      passport,
      address,
      phone,
      total_amount,
      installment_term,
      down_payment,
      markup,
      monthly_payment,
      total_with_markup,
      consent,
    } = body

    if (!full_name || !passport || !address || !phone || !consent) {
      return NextResponse.json(
        { error: "Все поля обязательны для заполнения" },
        { status: 400 }
      )
    }

    const sql = getDb()

    await sql`
      INSERT INTO applications (
        full_name, passport, address, phone,
        total_amount, installment_term, down_payment, markup,
        monthly_payment, total_with_markup
      ) VALUES (
        ${full_name}, ${passport}, ${address}, ${phone},
        ${total_amount}, ${installment_term}, ${down_payment}, ${markup},
        ${monthly_payment}, ${total_with_markup}
      )
    `

    await sendToTelegram({
      full_name,
      passport,
      address,
      phone,
      total_amount,
      installment_term,
      down_payment,
      markup,
      monthly_payment,
      total_with_markup,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[v0] Application submit error:", err)
    return NextResponse.json(
      { error: "Ошибка при отправке заявки" },
      { status: 500 }
    )
  }
}
