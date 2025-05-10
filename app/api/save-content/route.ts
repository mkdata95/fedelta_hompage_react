import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const content = await request.json()
    
    // siteContent.ts 파일 경로
    const filePath = path.join(process.cwd(), 'app', 'data', 'siteContent.ts')
    
    // 파일 내용 생성
    const fileContent = `export const siteContent = ${JSON.stringify(content, null, 2)}`
    
    // 파일 저장
    fs.writeFileSync(filePath, fileContent)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json({ success: false, error: 'Failed to save content' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'siteContent.ts')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    // 파일에서 export const siteContent = ... 부분만 추출
    const match = fileContent.match(/export const siteContent = (.*)$/s)
    if (!match) throw new Error('siteContent not found')
    const json = eval('(' + match[1] + ')')
    return NextResponse.json(json)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
} 