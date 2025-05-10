import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// DB 파일 경로
const dbPath = path.join(process.cwd(), 'portfolio.sqlite')

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching portfolio with ID:', params.id)
    
    const db = await openDb()
    
    // UUID 형식의 ID를 사용하여 데이터베이스에서 직접 조회
    const portfolio = await db.get('SELECT * FROM portfolio WHERE id = ?', params.id)
    
    await db.close()

    if (!portfolio) {
      return NextResponse.json({ error: '포트폴리오를 찾을 수 없습니다.' }, { status: 404 })
    }

    console.log('Portfolio found, processing data')
    
    // details 처리
    let parsedDetails
    try {
      parsedDetails = JSON.parse(portfolio.details || '[]')
    } catch {
      parsedDetails = portfolio.details
    }
    
    // gallery 처리
    let parsedGallery = []
    if (portfolio.gallery) {
      try {
        parsedGallery = JSON.parse(portfolio.gallery)
      } catch {
        parsedGallery = []
      }
    }
    
    return NextResponse.json({
      ...portfolio,
      details: parsedDetails,
      gallery: parsedGallery,
      youtubeLink: portfolio.youtubeLink
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
    let body;
    try {
      body = await request.json()
    } catch (error) {
      console.error('Request body parsing error:', error);
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
    }
    
    const { title, overview, details, image, category, client, size, role, gallery, youtubeLink } = body
    
    const db = await openDb()
    
    // details 저장 전처리
    let detailsData = details
    if (typeof detailsData !== 'string') {
      detailsData = JSON.stringify(detailsData || [])
    }
    
    // 갤러리 데이터 처리
    const galleryData = gallery ? JSON.stringify(gallery) : null
    
    try {
      // UUID 업데이트
      await db.run(
        'UPDATE portfolio SET title=?, overview=?, details=?, image=?, category=?, client=?, size=?, role=?, gallery=?, youtubeLink=? WHERE id=?',
        title || '',
        overview || '',
        detailsData || '',
        image || '',
        category || '',
        client || '',
        size || '',
        role || '',
        galleryData,
        youtubeLink || '',
        params.id
      )
      
      await db.close()
      
      // 간단한 성공 응답
      return NextResponse.json({ success: true })
    } catch (updateError) {
      console.error('Database update error:', updateError);
      await db.close()
      return NextResponse.json({ error: '데이터베이스 업데이트 오류' }, { status: 500 })
    }
  } catch (error) {
    console.error('포트폴리오 업데이트 실패:', error)
    return NextResponse.json({ error: '포트폴리오 업데이트 실패' }, { status: 500 })
  }
} 