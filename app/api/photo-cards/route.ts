import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 전체 카드 조회
export async function GET() {
  const cards = await prisma.photoCard.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(cards);
}

// POST: 카드 생성
export async function POST(req: NextRequest) {
  const data = await req.json();
  const card = await prisma.photoCard.create({ data });
  return NextResponse.json(card);
}

// PUT: 카드 수정 (id 필요)
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, ...rest } = data;
  const card = await prisma.photoCard.update({ where: { id }, data: rest });
  return NextResponse.json(card);
}

// DELETE: 카드 삭제 (id 필요)
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id } = data;
  await prisma.photoCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
} 