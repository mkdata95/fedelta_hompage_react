import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

interface PortfolioItem {
  id: string;
  title: string;
  period: string;
  role: string;
  overview: string;
  details: string; // DB에서는 항상 문자열로 저장됨
  client: string;
  image: string;
  category: string;
  gallery?: string; // 갤러리 데이터 (JSON 문자열로 저장)
  size: string;
  youtubeLink?: string; // YouTube 링크 추가
}

// SQLite 테이블 컬럼 정보 인터페이스
interface TableColumn {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

// DB 파일 경로
const dbPath = path.join(process.cwd(), 'portfolio.sqlite')

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// DB 테이블 생성 및 마이그레이션
async function ensureTable() {
  const db = await openDb()
  
  // 기본 테이블 생성
  await db.exec(`CREATE TABLE IF NOT EXISTS portfolio (
    id TEXT PRIMARY KEY,
    title TEXT,
    period TEXT,
    role TEXT,
    overview TEXT,
    details TEXT,
    client TEXT,
    image TEXT,
    category TEXT
  )`)
  
  // 테이블 구조 확인
  const tableInfo = await db.all(`PRAGMA table_info(portfolio)`) as TableColumn[]
  
  // gallery 컬럼 존재 여부 확인
  const hasGalleryColumn = tableInfo.some((column: TableColumn) => column.name === 'gallery')
  
  // gallery 컬럼이 없으면 추가
  if (!hasGalleryColumn) {
    console.log('Adding gallery column to portfolio table...')
    await db.exec(`ALTER TABLE portfolio ADD COLUMN gallery TEXT`)
  }
  
  // size 컬럼 존재 여부 확인
  const hasSizeColumn = tableInfo.some((column: TableColumn) => column.name === 'size')
  
  // size 컬럼이 없으면 추가
  if (!hasSizeColumn) {
    console.log('Adding size column to portfolio table...')
    await db.exec(`ALTER TABLE portfolio ADD COLUMN size TEXT`)
  }
  
  // youtubeLink 컬럼 존재 여부 확인
  const hasYoutubeLinkColumn = tableInfo.some((column: TableColumn) => column.name === 'youtubeLink')
  
  // youtubeLink 컬럼이 없으면 추가
  if (!hasYoutubeLinkColumn) {
    console.log('Adding youtubeLink column to portfolio table...')
    await db.exec(`ALTER TABLE portfolio ADD COLUMN youtubeLink TEXT`)
  }
  
  await db.close()
}

export async function GET() {
  await ensureTable()
  const db = await openDb()
  const items = await db.all('SELECT * FROM portfolio')
  await db.close()
  
  // 필드 파싱 처리
  const parsed = items.map((item: PortfolioItem) => {
    try {
      // 갤러리 데이터 파싱
      let parsedGallery = [];
      if (item.gallery) {
        try {
          parsedGallery = JSON.parse(item.gallery);
        } catch {
          parsedGallery = [];
        }
      }
      
      // details 데이터 파싱
      let parsedDetails;
      try {
        parsedDetails = JSON.parse(item.details || '[]');
      } catch {
        parsedDetails = item.details;
      }
      
      return {
        ...item,
        details: parsedDetails,
        gallery: parsedGallery
      };
    } catch {
      return item;
    }
  });
  
  return NextResponse.json(parsed)
}

export async function POST(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const body = await req.json()
  const id = uuidv4()
  
  // details 저장 전처리
  let detailsData = body.details;
  if (typeof detailsData !== 'string') {
    detailsData = JSON.stringify(detailsData || []);
  }
  
  // 갤러리 데이터 처리
  const galleryData = body.gallery ? JSON.stringify(body.gallery) : null;
  
  await db.run(
    'INSERT INTO portfolio (id, title, period, role, overview, details, client, image, category, gallery, size, youtubeLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id,
    body.title,
    body.period,
    body.role,
    body.overview,
    detailsData,
    body.client,
    body.image,
    body.category,
    galleryData,
    body.size,
    body.youtubeLink || null
  )
  await db.close()
  return NextResponse.json({ id })
}

export async function PUT(req: NextRequest) {
  try {
    await ensureTable()
    const db = await openDb()
    
    // 요청 본문 파싱
    let body;
    try {
      body = await req.json()
    } catch (error) {
      console.error('Request body parsing error:', error);
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
    }
    
    // details 저장 전처리
    let detailsData = body.details;
    if (typeof detailsData !== 'string') {
      detailsData = JSON.stringify(detailsData || []);
    }
    
    // 갤러리 데이터 처리
    const galleryData = body.gallery ? JSON.stringify(body.gallery) : null;
    
    try {
      await db.run(
        'UPDATE portfolio SET title=?, period=?, role=?, overview=?, details=?, client=?, image=?, category=?, gallery=?, size=?, youtubeLink=? WHERE id=?',
        body.title || '',
        body.period || '',
        body.role || '',
        body.overview || '',
        detailsData || '',
        body.client || '',
        body.image || '',
        body.category || '',
        galleryData,
        body.size || '',
        body.youtubeLink || '',
        body.id
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

export async function DELETE(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const { id } = await req.json()
  await db.run('DELETE FROM portfolio WHERE id=?', id)
  await db.close()
  return NextResponse.json({ ok: true })
} 