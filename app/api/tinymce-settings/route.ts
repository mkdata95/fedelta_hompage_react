import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'tinymce-settings.json');
const DATA_DIR = path.join(process.cwd(), 'data');

// 데이터 디렉토리가 없으면 생성
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('데이터 디렉토리 생성됨:', DATA_DIR);
  } catch (err) {
    console.error('데이터 디렉토리 생성 오류:', err);
  }
}

// GET: TinyMCE 설정 조회
export async function GET() {
  try {
    // 파일이 없으면 기본값 반환
    if (!fs.existsSync(SETTINGS_FILE)) {
      return NextResponse.json({ apiKey: '' });
    }
    
    // 설정 파일 읽기
    const fileContent = fs.readFileSync(SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(fileContent);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('TinyMCE 설정 조회 오류:', error);
    return NextResponse.json({ apiKey: '' }); // 오류 시에도 빈 값 반환
  }
}

// POST: TinyMCE 설정 저장
export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    
    // 설정 저장
    const settings = { apiKey: apiKey || '' };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('TinyMCE 설정 저장 오류:', error);
    return NextResponse.json({ error: '설정 저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 