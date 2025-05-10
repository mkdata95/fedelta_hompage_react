import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

// DB 파일 경로
const dbPath = path.join(process.cwd(), 'products.sqlite')

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// DB 테이블 생성 (최초 1회)
async function ensureTable() {
  const db = await openDb()
  await db.exec(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    detail TEXT,
    image TEXT,
    category TEXT
  )`)
  await db.close()
}

export async function GET() {
  try {
    await ensureTable()
    const db = await openDb()
    const items = await db.all('SELECT * FROM products')
    await db.close()
    return NextResponse.json(items)
  } catch (error) {
    console.error('제품 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '제품 목록을 불러오는 중 오류가 발생했습니다' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const db = await openDb()
    const body = await req.json()
    const id = uuidv4()
    await db.run(
      'INSERT INTO products (id, title, description, detail, image, category) VALUES (?, ?, ?, ?, ?, ?)',
      id,
      body.title,
      body.description,
      body.detail,
      body.image,
      body.category
    )
    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', id)
    await db.close()
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error('제품 추가 오류:', error);
    return NextResponse.json(
      { error: '제품 추가 실패' }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureTable()
    const db = await openDb()
    const body = await req.json()
    await db.run(
      'UPDATE products SET title=?, description=?, detail=?, image=?, category=? WHERE id=?',
      body.title,
      body.description,
      body.detail,
      body.image,
      body.category,
      body.id
    )
    await db.close()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('제품 수정 오류:', error);
    return NextResponse.json(
      { error: '제품 수정 실패' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable()
    const db = await openDb()
    const { id } = await req.json()
    await db.run('DELETE FROM products WHERE id=?', id)
    await db.close()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('제품 삭제 오류:', error);
    return NextResponse.json(
      { error: '제품 삭제 실패' }, 
      { status: 500 }
    );
  }
} 