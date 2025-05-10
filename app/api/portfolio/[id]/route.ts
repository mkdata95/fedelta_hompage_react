import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching portfolio with ID:', params.id)
    
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id }
    })

    if (!portfolio) {
      return NextResponse.json({ error: '포트폴리오를 찾을 수 없습니다.' }, { status: 404 })
    }

    console.log('Portfolio found, processing data')
    
    // details가 HTML 문자열인 경우 그대로 반환
    return NextResponse.json({
      ...portfolio,
      details: portfolio.details
    })
  } catch (error) {
    console.error('포트폴리오 조회 실패:', error)
    return NextResponse.json({ error: '포트폴리오 조회 실패' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, overview, details, image, category, client, size, role } = body

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: params.id },
      data: {
        title,
        overview,
        details, // HTML 문자열을 그대로 저장
        image,
        category,
        client,
        size,
        role
      }
    })

    return NextResponse.json(updatedPortfolio)
  } catch (error) {
    console.error('포트폴리오 업데이트 실패:', error)
    return NextResponse.json({ error: '포트폴리오 업데이트 실패' }, { status: 500 })
  }
} 