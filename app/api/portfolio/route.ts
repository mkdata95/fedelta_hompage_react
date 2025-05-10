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
    category TEXT,
    size TEXT
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
    'INSERT INTO portfolio (id, title, period, role, overview, details, client, image, category, gallery, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
    body.size
  )
  await db.close()
  return NextResponse.json({ id })
}

export async function PUT(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const body = await req.json()
  
  // details 저장 전처리
  let detailsData = body.details;
  if (typeof detailsData !== 'string') {
    detailsData = JSON.stringify(detailsData || []);
  }
  
  // 갤러리 데이터 처리
  const galleryData = body.gallery ? JSON.stringify(body.gallery) : null;
  
  await db.run(
    'UPDATE portfolio SET title=?, period=?, role=?, overview=?, details=?, client=?, image=?, category=?, gallery=?, size=? WHERE id=?',
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
    body.id
  )
  await db.close()
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const { id } = await req.json()
  await db.run('DELETE FROM portfolio WHERE id=?', id)
  await db.close()
  return NextResponse.json({ ok: true })
} 