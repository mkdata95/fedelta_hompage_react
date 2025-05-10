import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 공지사항 상세
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const notice = await prisma.notice.findUnique({ where: { id } })
  if (!notice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // 조회수 증가
  await prisma.notice.update({ where: { id }, data: { views: notice.views + 1 } })
  return NextResponse.json(notice)
}

// PUT: 공지사항 수정
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const { title, content } = await req.json()
  const updated = await prisma.notice.update({
    where: { id },
    data: { title, content },
  })
  return NextResponse.json(updated)
}

// DELETE: 공지사항 삭제
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.notice.delete({ where: { id } })
  return NextResponse.json({ ok: true })
} 