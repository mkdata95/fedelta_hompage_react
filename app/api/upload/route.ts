import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`

    // 디렉토리 생성 (없는 경우)
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error('디렉토리 생성 오류:', error)
    }

    // 파일 저장
    const filePath = join(uploadsDir, filename)
    await writeFile(filePath, buffer)

    // 프론트엔드에서 접근 가능한 URL 경로 반환
    const fileUrl = `/uploads/${filename}`
    
    return NextResponse.json({ 
      fileUrl,
      url: fileUrl,
      fileName: file.name,
      size: file.size
    })
  } catch (error) {
    console.error('파일 업로드 오류:', error)
    return NextResponse.json(
      { error: '파일 업로드 실패' },
      { status: 500 }
    )
  }
} 