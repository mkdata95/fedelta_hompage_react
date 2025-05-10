import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

// 다운로드 항목의 구조를 정의합니다.
// 실제 API 응답에서 이 형태로 데이터가 반환됩니다.
/* 
interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  created_at: string;
}
*/

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
  await db.exec(`CREATE TABLE IF NOT EXISTS downloads (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    category TEXT,
    file_url TEXT,
    created_at TEXT
  )`)
  
  await db.close()
}

export async function GET() {
  await ensureTable()
  const db = await openDb()
  const items = await db.all('SELECT * FROM downloads ORDER BY created_at DESC')
  await db.close()
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const body = await req.json()
  const id = uuidv4()
  const created_at = new Date().toISOString()
  
  await db.run(
    'INSERT INTO downloads (id, title, description, category, file_url, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    id,
    body.title,
    body.description,
    body.category,
    body.file_url,
    created_at
  )
  await db.close()
  return NextResponse.json({ id })
}

export async function PUT(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const body = await req.json()
  
  await db.run(
    'UPDATE downloads SET title=?, description=?, category=?, file_url=? WHERE id=?',
    body.title,
    body.description,
    body.category,
    body.file_url,
    body.id
  )
  await db.close()
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const { id } = await req.json()
  await db.run('DELETE FROM downloads WHERE id=?', id)
  await db.close()
  return NextResponse.json({ ok: true })
} 