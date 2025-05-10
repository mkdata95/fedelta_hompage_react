import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { 
    name, 
    company, 
    phone, 
    email, 
    requestType, 
    searchText, 
    content, 
    services,
    date,
    to 
  } = await req.json()

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
      from: `"${name}" <${email || process.env.SMTP_USER}>`,
      to,
      subject: `[견적요청] ${requestType || '견적요청'}`,
      text: content,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">견적 요청이 접수되었습니다</h2>
        <p><b>요청 구분:</b> ${requestType || '견적요청'}</p>
        <hr style="border: 1px solid #eee; margin: 15px 0;" />
        <h3 style="color: #555;">고객 정보</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; width: 120px;"><b>이름:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><b>회사명:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${company || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><b>연락처:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><b>이메일:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${email || '-'}</td>
          </tr>
        </table>
        
        <h3 style="color: #555; margin-top: 20px;">요청 세부사항</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; width: 120px;"><b>서비스 종류:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${services || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><b>분류:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${requestType || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><b>검색어:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${searchText || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><b>납품기한:</b></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${date || '-'}</td>
          </tr>
        </table>
        
        <h3 style="color: #555; margin-top: 20px;">상세 내용</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 10px;">${content ? content.replace(/\n/g, '<br/>') : '-'}</div>
      </div>`,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Error sending email:', e)
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
} 