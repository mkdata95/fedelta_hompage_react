import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: 회사소개 정보 조회 (id=1)
export async function GET() {
  let about = await prisma.about.findFirst({ where: { id: 1 } })
  if (!about) {
    // 최초 1회 기본값 생성
    about = await prisma.about.create({
      data: {
        title: '회사소개',
        visionTitle: 'Our Vision',
        visionContent: '비전 내용을 입력하세요.',
        valuesTitle: 'Core Values',
        valuesItems: '핵심가치1\n핵심가치2',
      },
    })
  }
  return NextResponse.json(about)
}

// PUT: 회사소개 정보 저장 (id=1)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const about = await prisma.about.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  })
  return NextResponse.json(about)
} 