import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 전체 공지사항 목록
export async function GET() {
  const notices = await prisma.notice.findMany({
    orderBy: { id: 'desc' }
  })
  return NextResponse.json(notices)
}

// POST: 새 공지 등록
export async function POST(req: Request) {
  const { title, content, author } = await req.json()
  const newNotice = await prisma.notice.create({
    data: {
      title,
      content,
      author,
    },
  })
  return NextResponse.json(newNotice)
} 