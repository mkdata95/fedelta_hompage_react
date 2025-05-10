import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// 데이터베이스 연결 함수
export async function openDb() {
  return open({
    filename: './portfolio.db',
    driver: sqlite3.Database
  })
}

// 테이블 생성 함수
export async function ensureTable() {
  const db = await openDb()
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      period TEXT,
      overview TEXT,
      image TEXT,
      category TEXT,
      details TEXT,
      gallery TEXT
    )
  `)
  
  await db.close()
} 