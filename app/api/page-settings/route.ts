import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const DATA_FILE = path.join(process.cwd(), 'data', 'page-settings.json');
const prisma = new PrismaClient();

// 파일이 없으면 기본 데이터로 생성
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

if (!fs.existsSync(DATA_FILE)) {
  const defaultData = {
    about: {
      title: '회사소개',
      subtitle: '고객을 가장 먼저 생각하는 기업, 고객이 먼저 자랑하는 기업이 되겠습니다.',
      backgroundImage: '/images/hero-default.jpg'
    },
    products: {
      title: '제품소개',
      subtitle: '보다 발전된 기술로 보다 참신한 제품을 생산합니다.',
      backgroundImage: '/images/hero-default.jpg'
    },
    portfolio: {
      title: '주요 실적',
      subtitle: '고객과 함께한 성공적인 프로젝트들을 소개합니다.',
      backgroundImage: '/images/hero-default.jpg'
    },
    downloads: {
      title: '자료다운로드',
      subtitle: '제품 및 서비스 관련 다양한 자료를 다운로드 받으실 수 있습니다.',
      backgroundImage: '/images/hero-default.jpg'
    }
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

// GET: 페이지 설정 조회
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page');

  if (!page) {
    return NextResponse.json({ error: '페이지 정보가 필요합니다' }, { status: 400 });
  }

  try {
    const settings = await prisma.pageSettings.findUnique({
      where: { page }
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('페이지 설정 조회 오류:', error);
    return NextResponse.json({ error: '페이지 설정을 불러오는데 실패했습니다' }, { status: 500 });
  }
}

// POST: 페이지 설정 저장
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { page, ...settings } = data;

    if (!page) {
      return NextResponse.json({ error: '페이지 정보가 필요합니다' }, { status: 400 });
    }

    const result = await prisma.pageSettings.upsert({
      where: { page },
      update: settings,
      create: { page, ...settings }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('페이지 설정 저장 오류:', error);
    return NextResponse.json({ error: '페이지 설정을 저장하는데 실패했습니다' }, { status: 500 });
  }
} 