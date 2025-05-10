import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: 전체 카드 조회
export async function GET() {
  const cards = await prisma.infoCard.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(cards)
}

// PUT: 전체 카드 일괄 수정(배열)
export async function PUT(req: NextRequest) {
  const data = await req.json() // [{id, title, desc, bgColor}]
  if (!Array.isArray(data)) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  // 기존 카드 모두 삭제 후 새로 저장(간단 구현)
  await prisma.infoCard.deleteMany()
  await prisma.infoCard.createMany({ data })

  return NextResponse.json({ ok: true })
} 