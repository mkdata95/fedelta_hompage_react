import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, subject, message, to } = await req.json()

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to,
      subject: `[문의] ${subject}`,
      text: message,
      html: `<div>
        <b>이름:</b> ${name}<br/>
        <b>이메일:</b> ${email}<br/>
        <b>제목:</b> ${subject}<br/>
        <b>내용:</b><br/>${message.replace(/\n/g, '<br/>')}
      </div>`,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
} 