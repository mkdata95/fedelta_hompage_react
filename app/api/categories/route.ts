import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

const dbPath = path.join(process.cwd(), 'products.sqlite')

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// 카테고리 테이블 생성
async function ensureTable() {
  const db = await openDb()
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `)
  await db.close()
}

export async function GET() {
  try {
    await ensureTable()
    const db = await openDb()
    const categories = await db.all('SELECT * FROM categories')
    await db.close()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('카테고리 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '카테고리 목록을 불러오는 중 오류가 발생했습니다' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const db = await openDb()
    const { name } = await req.json()
    
    await db.run('INSERT INTO categories (name) VALUES (?)', name)
    const newCategory = await db.get('SELECT * FROM categories WHERE name = ?', name)
    await db.close()
    return NextResponse.json(newCategory)
  } catch (error) {
    console.error('카테고리 추가 오류:', error);
    await openDb().then(db => db.close()).catch(() => {});
    return NextResponse.json(
      { error: '카테고리 추가 실패 (중복된 이름일 수 있음)' }, 
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable()
    const db = await openDb()
    const { name } = await req.json()
    await db.run('DELETE FROM categories WHERE name = ?', name)
    await db.close()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('카테고리 삭제 오류:', error);
    return NextResponse.json(
      { error: '카테고리 삭제 실패' }, 
      { status: 500 }
    );
  }
} 