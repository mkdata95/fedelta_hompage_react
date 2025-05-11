import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: 전체 카드 조회
export async function GET() {
  const cards = await prisma.mainCard.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(cards)
}

// PUT: 전체 카드 일괄 수정(배열)
export async function PUT(req: NextRequest) {
  const data = await req.json() // [{id, title, desc, link, icon}]
  if (!Array.isArray(data)) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  // 기존 카드 모두 삭제 후 새로 저장(간단 구현)
  await prisma.mainCard.deleteMany()
  await prisma.mainCard.createMany({ data })

  return NextResponse.json({ ok: true })
} 

// POST: DB 초기화 (defaultCards로)
export async function POST() {
  await prisma.mainCard.deleteMany();
  await prisma.mainCard.createMany({ data: defaultCards });
  return NextResponse.json({ ok: true });
}

const defaultCards = [
  { title: '제품안내', desc: 'feteta의 최신의 제품을 소개한다.', link: '/products', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' },
  { title: 'FAQ', desc: '고객님들이 가장 궁금해 하시는 질문들이 여기에 있습니다.', link: '/faq', icon: '❓' },
  { title: '갤러리', desc: '다온테마만의 다양한 소식을 이미지로 만나보세요.', link: '/gallery', icon: '📷' },
  { title: '채용안내', desc: '창의적이고 도전적인 인재를 기다리고 있습니다.', link: '/recruit', icon: '💙' },
]; 