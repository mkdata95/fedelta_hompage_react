"use client"

import { siteContent as initialSiteContent } from './data/siteContent'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const ICON_LIST = [
  {
    name: '별',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
  },
  {
    name: '체크',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5 1.41-1.41L9 13.38l7.09-7.09 1.41 1.41z"/></svg>'
  },
  {
    name: '사람',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z"/></svg>'
  },
  {
    name: '톱니바퀴',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.007 7.007 0 00-1.63-.94l-.36-2.53A.488.488 0 0014 2h-4a.488.488 0 00-.5.42l-.36 2.53c-.59.22-1.14.52-1.63.94l-2.39-.96a.5.5 0 00-.61.22l-1.92 3.32a.5.5 0 00.12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32c.14.24.44.32.68.22l2.39-.96c.5.42 1.05.77 1.63.94l.36 2.53c.05.28.27.42.5.42h4c.23 0 .45-.14.5-.42l.36-2.53c.59-.22 1.14-.52 1.63-.94l2.39.96c.24.1.54.02.68-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/></svg>'
  },
  {
    name: '구름',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 18H6a4 4 0 010-8c.29 0 .57.02.85.07A6.002 6.002 0 0117 9a5 5 0 012 9z"/></svg>'
  },
  {
    name: '모바일',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>'
  },
  {
    name: '데이터',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/></svg>'
  },
  {
    name: '디자인',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="M21 15l-5-5L5 21"/></svg>'
  },
  {
    name: '보안',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5.25-3.5 10-7 10s-7-4.75-7-10V6l7-4z"/></svg>'
  },
  {
    name: 'AI',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
  },
  {
    name: '웹',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>'
  },
  {
    name: '차트',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="13" width="4" height="8"/><rect x="9" y="9" width="4" height="12"/><rect x="15" y="5" width="4" height="16"/></svg>'
  },
  {
    name: '지도',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>'
  },
  {
    name: '메일',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>'
  },
  {
    name: '달력',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
  },
  {
    name: '카메라',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="13" r="4"/><path d="M21 19V7a2 2 0 00-2-2h-3.17a2 2 0 01-1.41-.59l-.83-.83a2 2 0 00-1.41-.59H9.83a2 2 0 00-1.41.59l-.83.83A2 2 0 016.17 5H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2z"/></svg>'
  },
  {
    name: '로켓',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 16l6-6 4 4 8-8"/><path d="M14 2l6 6M2 22l4-4"/></svg>'
  },
  {
    name: '하트',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
  },
  {
    name: '불꽃',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.07 6.13 7 9.39 7 13a5 5 0 0010 0c0-3.61-3.07-6.87-5-11z"/></svg>'
  },
  {
    name: '알람',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="13" r="7"/><path d="M5 4l2.29 2.29M19 4l-2.29 2.29"/></svg>'
  },
  {
    name: '다운로드',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17h16"/></svg>'
  },
  {
    name: '업로드',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21V9m0 0l-4 4m4-4l4 4M4 7h16"/></svg>'
  },
  {
    name: '링크',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 000-7.07 5 5 0 00-7.07 0L9 5.93"/><path d="M14 11a5 5 0 00-7.07 0l-1.41 1.41a5 5 0 000 7.07 5 5 0 007.07 0L15 18.07"/></svg>'
  },
  {
    name: '검색',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'
  },
  {
    name: '잠금',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>'
  },
  {
    name: '해제',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M17 11V7a5 5 0 00-10 0v4"/></svg>'
  },
  {
    name: '플레이',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>'
  },
  {
    name: '정지',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>'
  },
  {
    name: '일시정지',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>'
  },
  {
    name: '음악',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
  },
  {
    name: '마이크',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0014 0v-2"/><path d="M12 19v3m-4 0h8"/></svg>'
  },
  {
    name: '불릿',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>'
  },
  {
    name: '책',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/><path d="M22 6V4a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/></svg>'
  },
  {
    name: '코드',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
  },
  {
    name: '설정',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
  },
  { name: '서류', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M9 2v4h6V2"/></svg>' },
  { name: '폴더', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>' },
  { name: '계약서', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4"/></svg>' },
  { name: '도장', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="17" rx="7" ry="3"/><path d="M12 17V7a3 3 0 016 0v10"/></svg>' },
  { name: '성장', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h18v-2"/><path d="M7 17V9l4 4 4-8v12"/></svg>' },
  { name: '목표', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
  { name: '회의', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>' },
  { name: '사람 그룹', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><ellipse cx="12" cy="17" rx="9" ry="5"/></svg>' },
  { name: '고객', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z"/></svg>' },
  { name: '프레젠테이션', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/></svg>' },
  { name: '메모', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4M4 10h16"/></svg>' },
  { name: '전화', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92V21a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h4.09a2 2 0 012 1.72l.72 5.06a2 2 0 01-1.12 2.18l-2.2.88a16 16 0 006.29 6.29l.88-2.2a2 2 0 012.18-1.12l5.06.72A2 2 0 0121 18.91z"/></svg>' },
  { name: '이메일', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>' },
  { name: '지도', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>' },
  { name: '오피스', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="7" width="18" height="14" rx="2"/><rect x="7" y="2" width="10" height="5" rx="2"/></svg>' },
  { name: '달력', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
  { name: '계산기', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="7" width="8" height="3"/><rect x="8" y="12" width="3" height="3"/><rect x="13" y="12" width="3" height="3"/></svg>' },
  { name: '지갑', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="14" rx="2"/><circle cx="18" cy="14" r="2"/></svg>' },
  { name: '카드', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="20" height="12" rx="2"/><rect x="2" y="10" width="20" height="2"/></svg>' },
  { name: '쇼핑카트', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' },
  { name: '마케팅', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M16 3v4M8 3v4"/><circle cx="12" cy="12" r="2"/></svg>' },
  { name: '고객지원', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 16v2M8 20h8"/><path d="M9 9h6v2H9z"/></svg>' },
  { name: '브리핑', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/></svg>' },
  { name: '분석', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="13" width="4" height="8"/><rect x="9" y="9" width="4" height="12"/><rect x="15" y="5" width="4" height="16"/><path d="M4 4l16 16"/></svg>' },
];

interface PortfolioItem {
  id: string;
  title: string;
  period: string;
  overview: string;
  image: string;
  // 필요시 추가 필드
}

interface PhotoCard {
  id?: number;
  image: string;
  title: string;
  desc: string;
}

// InfoCard 타입 추가
interface InfoCard {
  id?: number;
  title: string;
  desc: string;
  bgColor: string;
  bgImage?: string;
}

export default function Home() {
  // 관리자 로그인 여부 확인
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [heroForm, setHeroForm] = useState({
    title: initialSiteContent.hero.title,
    titleHighlight: initialSiteContent.hero.titleHighlight,
    description: initialSiteContent.hero.description,
    bgImage: initialSiteContent.hero.bgImage || '/images/hero-default.jpg',
  })
  const [aboutEditMode, setAboutEditMode] = useState(false)
  const [aboutForm, setAboutForm] = useState({
    title: initialSiteContent.about.title,
    visionTitle: initialSiteContent.about.vision.title,
    visionContent: [...initialSiteContent.about.vision.content],
    valuesTitle: initialSiteContent.about.values.title,
    valuesItems: [...initialSiteContent.about.values.items],
  })
  const [servicesEditMode, setServicesEditMode] = useState(false)
  const [servicesForm, setServicesForm] = useState({
    title: initialSiteContent.services.title,
    desc: initialSiteContent.services.desc || '당사의 다양한 사업 영역을 소개합니다.',
    items: initialSiteContent.services.items.map(item => ({ ...item })),
  })
  const [saveMsg, setSaveMsg] = useState('')
  const [aboutSaveMsg, setAboutSaveMsg] = useState('')
  const [servicesSaveMsg, setServicesSaveMsg] = useState('')
  const [iconModalIdx, setIconModalIdx] = useState(-1)
  const [iconSearch, setIconSearch] = useState('')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  // 사진고 카드 인라인 수정 상태
  const [photoEditMode, setPhotoEditMode] = useState(false)
  const [photoCards, setPhotoCards] = useState<PhotoCard[]>([])
  const [photoCardsDraft, setPhotoCardsDraft] = useState<PhotoCard[]>([])
  const [photoSaveMsg, setPhotoSaveMsg] = useState('')
  // 사진고 섹션 제목/설명 인라인 수정 상태
  const [photoSectionEdit, setPhotoSectionEdit] = useState({
    title: initialSiteContent.photoSection?.title || '사진고',
    desc: initialSiteContent.photoSection?.desc || '다온테마의 다양한 사진을 소개합니다.'
  })
  const [photoSectionDraft, setPhotoSectionDraft] = useState({
    title: initialSiteContent.photoSection?.title || '사진고',
    desc: initialSiteContent.photoSection?.desc || '다온테마의 다양한 사진을 소개합니다.'
  })
  // PORTFOLIO 섹션 인라인 수정 상태 추가
  const [portfolioEditMode, setPortfolioEditMode] = useState(false)
  const [portfolioSectionEdit, setPortfolioSectionEdit] = useState({
    title: 'PORTFOLIO',
    desc: 'CSS기반 모든 기기 풀 반응형 기업테마',
  })
  const [portfolioSectionDraft, setPortfolioSectionDraft] = useState({
    title: 'PORTFOLIO',
    desc: 'CSS기반 모든 기기 풀 반응형 기업테마',
  })
  const [portfolioSaveMsg, setPortfolioSaveMsg] = useState('')
  // 공지사항 상태 추가
  const [mainNotices, setMainNotices] = useState<{id:number, title:string, date:string}[]>([]);
  // 하단 4개 카드 인라인 수정 상태
  const [cardEditIdx, setCardEditIdx] = useState(-1);
  const [cards, setCards] = useState([
    { title: '제품안내', desc: 'feteta의 최신의 제품을 소개한다.', link: '/products', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' },
    { title: 'FAQ', desc: '고객님들이 가장 궁금해 하시는 질문들이 여기에 있습니다.', link: '/faq', icon: '❓' },
    { title: '갤러리', desc: '다온테마만의 다양한 소식을 이미지로 만나보세요.', link: '/gallery', icon: '📷' },
    { title: '오시는길', desc: '다온테마의 위치와 오시는 길을 안내합니다.', link: '/location', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>' },
  ]);
  const [cardDraft, setCardDraft] = useState(cards);
  // 전화/오시는 길 카드 상태 추가
  const [infoCards, setInfoCards] = useState<InfoCard[]>([
    { title: '02.123.4567', desc: '평일 : 09:00 ~ 18:00\n토,일,공휴일 휴무', bgColor: '#2563eb', bgImage: '' },
    { title: '오시는 길', desc: '다온테마는 항상 열려 있습니다.\n오시는 길을 안내해드립니다.', bgColor: '#232b36', bgImage: '' },
  ]);
  const [infoCardsDraft, setInfoCardsDraft] = useState(infoCards);
  const [infoEditMode, setInfoEditMode] = useState(false);

  // 서버에서 동적으로 불러오기
  useEffect(() => {
    fetch('/api/save-content')
      .then(res => res.json())
      .then(data => {
        if (data && data.photoSection) {
          setPhotoSectionEdit({
            title: data.photoSection.title || '사진고',
            desc: data.photoSection.desc || '다온테마의 다양한 사진을 소개합니다.'
          })
          setPhotoSectionDraft({
            title: data.photoSection.title || '사진고',
            desc: data.photoSection.desc || '다온테마의 다양한 사진을 소개합니다.'
          })
        }
      })
  }, [])

  useEffect(() => {
    // 쿠키 체크 로직 개선
    const checkAdmin = () => {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const adminCookie = cookies.find(c => c.startsWith('admin_auth='))
      const isAdminValue = adminCookie ? adminCookie.split('=')[1] === '1' : false
      console.log('Admin Cookie:', adminCookie)
      console.log('Is Admin:', isAdminValue)
      setIsAdmin(isAdminValue)
    }
    
    checkAdmin()
    // 쿠키 변경 감지를 위한 이벤트 리스너 추가
    window.addEventListener('storage', checkAdmin)
    return () => window.removeEventListener('storage', checkAdmin)
  }, [])

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPortfolioItems(data);
      });
  }, [])

  // 사진고 카드 DB에서 불러오기
  useEffect(() => {
    fetch('/api/photo-cards')
      .then(res => res.json())
      .then(data => {
        setPhotoCards(data)
        setPhotoCardsDraft(data)
      })
  }, [])

  useEffect(() => {
    fetch('/api/notice')
      .then(res => res.json())
      .then(data => {
        setMainNotices(data.slice(0, 5));
      });
  }, []);

  // DB에서 카드 정보 불러오기
  useEffect(() => {
    fetch('/api/main-cards')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCards(data)
          setCardDraft(data)
        }
      })
  }, []);

  // DB에서 infoCards 불러오기
  useEffect(() => {
    fetch('/api/info-cards')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length === 2) {
          setInfoCards(data)
          setInfoCardsDraft(data)
        }
      })
  }, [])

  // 디버깅: infoCards, infoCardsDraft 상태 확인
  useEffect(() => {
    console.log('infoCards:', infoCards)
    console.log('infoCardsDraft:', infoCardsDraft)
  }, [infoCards, infoCardsDraft])

  const handleHeroSave = async () => {
    setSaveMsg('저장 중...')
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...initialSiteContent,
          hero: {
            ...initialSiteContent.hero,
            ...heroForm,
          },
        }),
      })
      if (response.ok) {
        setSaveMsg('저장되었습니다!')
        setEditMode(false)
      } else {
        setSaveMsg('저장 실패')
      }
    } catch {
      setSaveMsg('오류 발생')
    }
    setTimeout(() => setSaveMsg(''), 2000)
  }

  const handleAboutSave = async () => {
    setAboutSaveMsg('저장 중...')
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...initialSiteContent,
          about: {
            ...initialSiteContent.about,
            title: aboutForm.title,
            vision: {
              ...initialSiteContent.about.vision,
              title: aboutForm.visionTitle,
              content: aboutForm.visionContent,
            },
            values: {
              ...initialSiteContent.about.values,
              title: aboutForm.valuesTitle,
              items: aboutForm.valuesItems,
            },
          },
        }),
      })
      if (response.ok) {
        setAboutSaveMsg('저장되었습니다!')
        setAboutEditMode(false)
      } else {
        setAboutSaveMsg('저장 실패')
      }
    } catch {
      setAboutSaveMsg('오류 발생')
    }
    setTimeout(() => setAboutSaveMsg(''), 2000)
  }

  const handleServicesSave = async () => {
    setServicesSaveMsg('저장 중...')
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...initialSiteContent,
          services: {
            ...initialSiteContent.services,
            title: servicesForm.title,
            desc: servicesForm.desc,
            items: servicesForm.items,
          },
        }),
      })
      if (response.ok) {
        setServicesSaveMsg('저장되었습니다!')
        setServicesEditMode(false)
      } else {
        setServicesSaveMsg('저장 실패')
      }
    } catch {
      setServicesSaveMsg('오류 발생')
    }
    setTimeout(() => setServicesSaveMsg(''), 2000)
  }

  const handlePhotoSave = async () => {
    setPhotoSaveMsg('저장 중...')
    try {
      // 현재 DB에 있는 모든 카드를 가져와서 삭제된 카드를 확인
      const existingRes = await fetch('/api/photo-cards');
      const existingCards = await existingRes.json();
      
      // 삭제된 카드 찾기 (DB에는 있지만 현재 draft에는 없는 카드)
      const deletedCards = existingCards.filter(
        existingCard => !photoCardsDraft.some(
          draftCard => draftCard.id === existingCard.id
        )
      );
      
      // 삭제된 카드를 DB에서도 삭제
      for (const card of deletedCards) {
        if (card.id) {
          await fetch(`/api/photo-cards?id=${card.id}`, {
            method: 'DELETE'
          });
        }
      }

      // 남은 카드 저장 (수정 또는 새로 추가)
      for (const card of photoCardsDraft) {
        if (card.id) {
          await fetch('/api/photo-cards', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(card),
          });
        } else {
          await fetch('/api/photo-cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(card),
          });
        }
      }

      // 사진고 섹션 제목/설명 저장
      await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...initialSiteContent,
          photoSection: {
            title: photoSectionDraft.title,
            desc: photoSectionDraft.desc,
          },
        }),
      });

      // 저장 후 다시 불러오기
      const res = await fetch('/api/photo-cards');
      const data = await res.json();
      setPhotoCards(data);
      setPhotoCardsDraft(data);
      setPhotoSectionEdit(photoSectionDraft);
      setPhotoEditMode(false);
      setPhotoSaveMsg('저장되었습니다!');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      setPhotoSaveMsg('저장 실패');
    }
    setTimeout(() => setPhotoSaveMsg(''), 2000);
  }

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.fileUrl) {
        const next = [...photoCardsDraft];
        next[idx].image = data.fileUrl;
        setPhotoCardsDraft(next);
      }
    }
  }

  // infoCards 저장 함수
  const handleInfoSave = async () => {
    await fetch('/api/info-cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(infoCardsDraft),
    })
    setInfoCards(infoCardsDraft)
    setInfoEditMode(false)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600" style={{ backgroundImage: `url(${heroForm.bgImage || initialSiteContent.hero.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            {editMode ? (
              <>
                <input
                  className="text-5xl font-bold mb-4 w-full text-center text-black px-2 py-1 rounded"
                  value={heroForm.title}
                  onChange={e => setHeroForm(f => ({ ...f, title: e.target.value }))}
                />
                <input
                  className="text-3xl font-bold mb-4 w-full text-center text-blue-700 px-2 py-1 rounded"
                  value={heroForm.titleHighlight}
                  onChange={e => setHeroForm(f => ({ ...f, titleHighlight: e.target.value }))}
                />
                <textarea
                  className="text-xl mb-4 w-full text-black px-2 py-1 rounded"
                  value={heroForm.description}
                  onChange={e => setHeroForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
                {/* 배경 이미지 업로드 및 URL 입력 */}
                <div className="mb-4 flex flex-col items-center gap-2">
                  <label className="font-semibold">배경 이미지</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded border"
                    placeholder="이미지 URL 입력 또는 파일 업로드"
                    value={heroForm.bgImage}
                    onChange={e => setHeroForm(f => ({ ...f, bgImage: e.target.value }))}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        const data = await res.json();
                        if (data.fileUrl) {
                          setHeroForm(f => ({ ...f, bgImage: data.fileUrl }));
                        }
                      }
                    }}
                  />
                  {heroForm.bgImage && (
                    <img src={heroForm.bgImage} alt="미리보기" className="w-64 h-32 object-cover rounded border mt-2" />
                  )}
                </div>
                <div className="flex gap-2 justify-center mb-4">
                  <button onClick={handleHeroSave} className="bg-blue-600 text-white px-6 py-2 rounded">저장</button>
                  <button onClick={() => { setEditMode(false); setHeroForm({ title: initialSiteContent.hero.title, titleHighlight: initialSiteContent.hero.titleHighlight, description: initialSiteContent.hero.description, bgImage: initialSiteContent.hero.bgImage || '/images/hero-default.jpg' }) }} className="bg-gray-400 text-white px-6 py-2 rounded">취소</button>
                </div>
                {saveMsg && <div className="text-green-200 mb-2">{saveMsg}</div>}
              </>
            ) : (
              <>
                <h1 className="text-7xl font-bold mb-8 leading-tight">
                  {initialSiteContent.hero.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                  <span className="text-blue-300">{initialSiteContent.hero.titleHighlight}</span>
                </h1>
                <p className="text-2xl mb-12 text-gray-100">
                  {initialSiteContent.hero.description.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </p>
                {isAdmin && (
                  <button onClick={() => setEditMode(true)} className="bg-yellow-400 text-black px-6 py-2 rounded mb-4">수정</button>
                )}
                {saveMsg && <div className="text-green-200 mb-2">{saveMsg}</div>}
              </>
            )}
            <div className="flex gap-6 justify-center">
              <Link
                href="/portfolio"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                {initialSiteContent.hero.primaryButton.replace('서비스 살펴보기', '주요실적')}
              </Link>
              <a
                href="/contact"
                className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
              >
                {initialSiteContent.hero.secondaryButton}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 정보 요약/바로가기 섹션 (사진 참고) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            {/* 공지사항/문의하기 탭 */}
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-w-[320px]">
              <div className="flex border-b-2 border-gray-300 mb-4">
                <button className="flex-1 py-2 font-bold border-b-2 border-black text-black focus:outline-none bg-white" tabIndex={0}>공지사항</button>
                <button
                  className="flex-1 py-2 font-bold text-gray-700 hover:text-blue-700 border-b-2 border-transparent focus:outline-none bg-white transition-colors"
                  tabIndex={0}
                  onClick={() => window.location.href = '/contact'}
                >문의하기</button>
                <button className="ml-auto text-2xl text-gray-400 hover:text-black">+</button>
              </div>
              <ul>
                {mainNotices.length === 0 && (
                  <li className="text-gray-400 py-4 text-center">공지사항이 없습니다.</li>
                )}
                {mainNotices.map(notice => (
                  <li key={notice.id} className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-blue-50 transition">
                    <Link href={`/customer/notice/${notice.id}`} className="truncate text-blue-700 font-semibold hover:underline">
                      {notice.title}
                    </Link>
                    <span className="text-xs text-gray-500 font-medium">{notice.date?.slice(0, 10)}</span>
                  </li>
                ))}
                <li className="text-right pt-2">
                  <Link href="/customer/notice" className="text-xs text-blue-600 font-bold hover:underline">+ 전체보기</Link>
                </li>
              </ul>
            </div>
            {/* 전화/오시는 길 */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-w-[320px]">
              {infoEditMode ? (
                Array.isArray(infoCardsDraft) && infoCardsDraft.length > 0 ? infoCardsDraft.map((card, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-center p-8 min-w-[160px] rounded-xl relative" style={{ background: card.bgColor, overflow: 'hidden' }}>
                    {(card.bgImage !== undefined && card.bgImage !== '') && (
                      <img src={card.bgImage} alt="배경" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" style={{zIndex:0}} />
                    )}
                    <input
                      className="text-3xl font-bold mb-2 text-center bg-white/80 px-2 py-1 rounded relative z-10"
                      value={card.title}
                      onChange={e => setInfoCardsDraft(d => { const next = [...d]; next[idx].title = e.target.value; return next; })}
                    />
                    <textarea
                      className="text-sm text-center bg-white/80 px-2 py-1 rounded relative z-10"
                      value={card.desc}
                      onChange={e => setInfoCardsDraft(d => { const next = [...d]; next[idx].desc = e.target.value; return next; })}
                      rows={3}
                    />
                    <input
                      className="w-32 mt-2 text-xs text-center bg-white/80 px-2 py-1 rounded relative z-10"
                      value={card.bgColor}
                      onChange={e => setInfoCardsDraft(d => { const next = [...d]; next[idx].bgColor = e.target.value; return next; })}
                      placeholder="#2563eb"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full mt-2 text-xs text-center bg-white/80 px-2 py-1 rounded relative z-10"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.fileUrl) {
                            setInfoCardsDraft(d => {
                              const next = [...d];
                              next[idx].bgImage = data.fileUrl;
                              return next;
                            });
                          }
                        }
                      }}
                    />
                    <input
                      className="w-full mt-1 text-xs text-center bg-white/60 px-2 py-1 rounded relative z-10"
                      value={card.bgImage || ''}
                      readOnly
                      placeholder="배경 이미지 URL"
                    />
                    {card.bgImage && card.bgImage !== '' && (
                      <button
                        type="button"
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded relative z-10 hover:bg-red-600"
                        onClick={() => setInfoCardsDraft(d => { const next = [...d]; next[idx].bgImage = ''; return next; })}
                      >
                        배경 이미지 삭제
                      </button>
                    )}
                  </div>
                )) : null
              ) : (
                infoCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-xl flex flex-col items-center justify-center p-8 min-w-[160px] relative cursor-pointer"
                    style={{ background: card.bgColor, overflow: 'hidden' }}
                    onClick={() => idx === 1 ? window.location.href = '/location' : undefined}
                  >
                    {(card.bgImage !== undefined && card.bgImage !== '') && (
                      <img src={card.bgImage} alt="배경" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" style={{zIndex:0}} />
                    )}
                    <div className="text-3xl font-bold mb-2 text-white relative z-10">{card.title}</div>
                    <div className="text-sm text-white text-center whitespace-pre-line relative z-10">{card.desc}</div>
                  </div>
                ))
              )}
              {isAdmin && (
                <div className="flex flex-col justify-center ml-2">
                  {infoEditMode ? (
                    <>
                      <button onClick={handleInfoSave} className="bg-blue-600 text-white px-4 py-2 rounded mb-2">저장</button>
                      <button onClick={() => { setInfoEditMode(false); setInfoCardsDraft(infoCards); }} className="bg-gray-400 text-white px-4 py-2 rounded">취소</button>
                    </>
                  ) : (
                    <button onClick={() => setInfoEditMode(true)} className="bg-yellow-400 text-black px-4 py-2 rounded">수정</button>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* 하단 4개 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[180px] relative ${cardEditIdx === idx ? '' : 'cursor-pointer hover:shadow-xl hover:border-blue-400 border border-transparent transition'}`}
                onClick={() => cardEditIdx === -1 && (window.location.href = card.link)}
                tabIndex={0}
                role="button"
                aria-label={`${card.title} 바로가기`}
              >
                {/* 디버깅용 로그 */}
                {(() => {
                  console.log('Rendering card:', idx, 'isAdmin:', isAdmin, 'cardEditIdx:', cardEditIdx);
                  return null;
                })()}
                {isAdmin && cardEditIdx !== idx && (
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 z-50 bg-white rounded-full p-1 shadow-md"
                    onClick={e => { e.stopPropagation(); setCardEditIdx(idx); setCardDraft(cards); }}
                    aria-label="수정"
                  >
                    ✏️
                  </button>
                )}
                {cardEditIdx === idx ? (
                  <div className="flex flex-col gap-2">
                    <input
                      className="font-bold mb-2 border px-2 py-1 rounded"
                      value={cardDraft[idx].title}
                      onChange={e => setCardDraft(d => { const next = [...d]; next[idx].title = e.target.value; return next; })}
                    />
                    <textarea
                      className="text-gray-500 text-sm mb-2 border px-2 py-1 rounded"
                      value={cardDraft[idx].desc}
                      onChange={e => setCardDraft(d => { const next = [...d]; next[idx].desc = e.target.value; return next; })}
                    />
                    <input
                      className="text-xs text-blue-600 mb-2 border px-2 py-1 rounded"
                      value={cardDraft[idx].link}
                      onChange={e => setCardDraft(d => { const next = [...d]; next[idx].link = e.target.value; return next; })}
                    />
                    {/* 아이콘 입력란 추가 */}
                    <textarea
                      className="text-xs text-blue-600 mb-2 border px-2 py-1 rounded"
                      value={cardDraft[idx].icon}
                      onChange={e => setCardDraft(d => { const next = [...d]; next[idx].icon = e.target.value; return next; })}
                      placeholder="SVG 아이콘 또는 이모지 입력"
                      rows={2}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={async e => {
                          e.stopPropagation();
                          setCards(cardDraft);
                          setCardEditIdx(-1);
                          // DB에 저장
                          await fetch('/api/main-cards', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(cardDraft),
                          });
                        }}
                      >저장</button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={e => { e.stopPropagation(); setCardEditIdx(-1); setCardDraft(cards); }}
                      >취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="font-bold mb-2">{card.title}</div>
                      <div className="text-gray-500 text-sm mb-4">{card.desc}</div>
                    </div>
                    <div className="flex justify-end text-blue-400 text-3xl">
                      <span dangerouslySetInnerHTML={{ __html: card.icon }} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사진고 섹션 (OUR BUSINESS 카드와 동일 디자인) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">{photoSectionEdit.title}</h2>
            <p className="text-xl text-gray-500">{photoSectionEdit.desc}</p>
            
            {isAdmin && !photoEditMode && (
              <button
                onClick={() => setPhotoEditMode(true)}
                className="absolute top-0 right-0 bg-yellow-400 text-black px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-yellow-500 transition-all z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                수정
              </button>
            )}
            
            {photoEditMode && (
              <div className="absolute -top-12 right-0 flex gap-2">
                <input
                  className="border rounded px-3 py-1 w-64"
                  value={photoSectionDraft.title}
                  onChange={e => setPhotoSectionDraft({...photoSectionDraft, title: e.target.value})}
                  placeholder="섹션 제목"
                />
                <input
                  className="border rounded px-3 py-1 w-80"
                  value={photoSectionDraft.desc}
                  onChange={e => setPhotoSectionDraft({...photoSectionDraft, desc: e.target.value})}
                  placeholder="섹션 설명"
                />
                <button 
                  onClick={handlePhotoSave}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  저장
                </button>
                <button 
                  onClick={() => {
                    setPhotoEditMode(false);
                    setPhotoSectionDraft(photoSectionEdit);
                  }}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  취소
                </button>
              </div>
            )}
            {photoSaveMsg && <div className="text-green-500 mt-2">{photoSaveMsg}</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {photoCards.map((card, idx) => (
              <div
                key={idx}
                data-card-idx={idx}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col overflow-hidden relative"
                style={{ width: 350, height: 350, minWidth: 350, maxWidth: 350 }}
              >
                {/* 수정 모드일 때 카드 수정 UI */}
                {photoEditMode && (
                  <div className="absolute inset-0 bg-white z-20 p-4 flex flex-col">
                    <h4 className="font-bold mb-2">카드 수정</h4>
                    
                    <label className="mt-2 text-sm font-medium">이미지</label>
                    {photoCardsDraft[idx]?.image && (
                      <div className="relative w-full mb-2 flex items-center justify-center" style={{ width: 350, height: 240 }}>
                        <Image
                          src={photoCardsDraft[idx].image}
                          alt="미리보기"
                          width={350}
                          height={240}
                          style={{ objectFit: 'cover', width: 350, height: 240 }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="mb-2 text-sm"
                      onChange={(e) => handlePhotoFileChange(e, idx)}
                    />
                    
                    <label className="text-sm font-medium">제목</label>
                    <input
                      className="border rounded px-2 py-1 mb-2"
                      value={photoCardsDraft[idx]?.title || ''}
                      onChange={e => {
                        const next = [...photoCardsDraft];
                        next[idx] = {...next[idx], title: e.target.value};
                        setPhotoCardsDraft(next);
                      }}
                    />
                    
                    <label className="text-sm font-medium">설명</label>
                    <textarea
                      className="border rounded px-2 py-1 mb-2"
                      rows={3}
                      value={photoCardsDraft[idx]?.desc || ''}
                      onChange={e => {
                        const next = [...photoCardsDraft];
                        next[idx] = {...next[idx], desc: e.target.value};
                        setPhotoCardsDraft(next);
                      }}
                    />
                    
                    {/* 카드 삭제 버튼 */}
                    <button
                      className="mt-auto bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors w-full mt-4"
                      onClick={async () => {
                        if (confirm('이 카드를 삭제하시겠습니까?')) {
                          // 1. 로컬 상태에서 제거
                          const updatedCards = photoCardsDraft.filter((_, index) => index !== idx);
                          setPhotoCardsDraft(updatedCards);
                          
                          // 2. 이미 데이터베이스에 저장된 카드(id가 있는 경우)면 바로 삭제 요청
                          const cardToDelete = photoCardsDraft[idx];
                          if (cardToDelete?.id) {
                            try {
                              // 즉시 삭제 요청
                              const response = await fetch(`/api/photo-cards?id=${cardToDelete.id}`, {
                                method: 'DELETE'
                              });
                              
                              if (response.ok) {
                                // 삭제 성공하면 UI를 업데이트합니다
                                setPhotoCards(prev => prev.filter(card => card.id !== cardToDelete.id));
                                setPhotoSaveMsg('카드가 삭제되었습니다.');
                                setTimeout(() => setPhotoSaveMsg(''), 2000);
                              } else {
                                // 삭제 실패 시 다시 추가
                                console.error('카드 삭제 실패');
                                setPhotoCardsDraft(prev => [...prev, cardToDelete]);
                                setPhotoSaveMsg('카드 삭제 실패');
                                setTimeout(() => setPhotoSaveMsg(''), 2000);
                              }
                            } catch (error) {
                              console.error('카드 삭제 중 오류:', error);
                              // 오류 발생 시 다시 추가
                              setPhotoCardsDraft(prev => [...prev, cardToDelete]);
                            }
                          }
                        }
                      }}
                    >
                      삭제
                    </button>
                  </div>
                )}
                
                {/* 카드 내용 (수정 모드가 아닐 때만 표시) */}
                {!photoEditMode && (
                  <>
                {/* 이미지 영역: 고정 비율, 높이 240px */}
                    <div className="relative w-full flex items-center justify-center" style={{ width: 350, height: 240 }}>
                  <Image
                    src={card.image || '/images/placeholder.png'}
                    alt={card.title}
                        width={350}
                        height={240}
                        style={{ objectFit: 'cover', width: 350, height: 240 }}
                  />
                </div>
                {/* 텍스트 영역: 고정 높이, 내부 내용도 줄수 제한 */}
                    <div className="flex-1 flex flex-col justify-between p-8" style={{ height: 110 }}>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 truncate">{card.title}</h3>
                    <p className="text-gray-600 text-base mb-4 line-clamp-2" style={{ minHeight: 48 }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
                  </>
                )}
              </div>
            ))}
            
            {/* 수정 모드일 때 새 카드 추가 버튼 */}
            {photoEditMode && (
              <div
                className="bg-white rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                style={{ height: 480, minWidth: 340, maxWidth: 400 }}
                onClick={() => {
                  setPhotoCardsDraft([...photoCardsDraft, {
                    image: '/images/placeholder.png',
                    title: '새 카드 제목',
                    desc: '새 카드 설명을 입력하세요.'
                  }]);
                }}
              >
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-blue-600 font-medium">새 카드 추가</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gray-50">
        <div className="container mx-auto px-4 relative">
          {isAdmin && !servicesEditMode && (
            <button
              onClick={() => setServicesEditMode(true)}
              className="fixed top-4 right-4 bg-yellow-400 text-black px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-yellow-500 transition-all z-[100]"
              style={{ position: 'fixed' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              수정
            </button>
          )}
          
          {servicesEditMode ? (
            <>
              <input
                className="text-3xl font-bold text-center mb-10 w-full text-black px-2 py-1 rounded"
                value={servicesForm.title}
                onChange={e => setServicesForm(f => ({ ...f, title: e.target.value }))}
              />
              <textarea
                className="text-center text-gray-400 mb-6 text-xl w-full px-2 py-1 rounded border"
                value={servicesForm.desc || ''}
                onChange={e => setServicesForm(f => ({ ...f, desc: e.target.value }))}
                rows={2}
                placeholder="당사의 다양한 사업 영역을 소개합니다."
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
                {servicesForm.items.map((service, i) => (
                  <div key={i} className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex flex-col items-center justify-center mb-8">
                      <div className="mb-2 text-xs text-gray-500">미리보기</div>
                      <div className="w-10 h-10 text-blue-600 flex items-center justify-center">
                        {/* 실제 SVG 미리보기 */}
                        {service.icon ? (
                          <span dangerouslySetInnerHTML={{ __html: service.icon }} />
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="border px-2 py-1 rounded text-xs hover:bg-blue-100 mb-2"
                      onClick={() => setIconModalIdx(i)}
                    >
                      아이콘 선택
                    </button>
                    {/* 아이콘 선택 모달 */}
                    {iconModalIdx === i && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg p-6 shadow-xl w-96 max-h-[80vh] flex flex-col">
                          <div className="mb-4 text-lg font-bold">아이콘 선택</div>
                          <input
                            type="text"
                            placeholder="아이콘 이름 검색..."
                            className="mb-4 px-3 py-2 border rounded"
                            value={iconSearch || ''}
                            onChange={e => setIconSearch(e.target.value)}
                          />
                          <div className="grid grid-cols-6 gap-3 overflow-y-auto" style={{ maxHeight: '40vh' }}>
                            {ICON_LIST.filter(icon => !iconSearch || icon.name.includes(iconSearch)).map(icon => (
                              <button
                                key={icon.name}
                                className="flex flex-col items-center p-2 border rounded hover:bg-blue-50"
                                onClick={() => {
                                  const newItems = [...servicesForm.items]
                                  newItems[i].icon = icon.svg
                                  setServicesForm(f => ({ ...f, items: newItems }))
                                  setIconModalIdx(-1)
                                }}
                                type="button"
                              >
                                <span dangerouslySetInnerHTML={{ __html: icon.svg }} className="w-8 h-8 mb-1" />
                                <span className="text-xs">{icon.name}</span>
                              </button>
                            ))}
                          </div>
                          <button className="w-full py-2 bg-gray-200 rounded mt-4" onClick={() => setIconModalIdx(-1)}>닫기</button>
                        </div>
                      </div>
                    )}
                    <label className="block text-xs text-gray-500 mb-1">SVG 코드</label>
                    <textarea
                      className="w-full text-xs text-black px-2 py-1 rounded border mb-4"
                      value={service.icon || ''}
                      onChange={e => {
                        const newItems = [...servicesForm.items]
                        newItems[i].icon = e.target.value
                        setServicesForm(f => ({ ...f, items: newItems }))
                      }}
                      rows={3}
                      placeholder="<svg ...>...</svg>"
                    />
                    <input
                      className="text-2xl font-semibold mb-6 text-gray-900 w-full text-black px-2 py-1 rounded"
                      value={service.title}
                      onChange={e => {
                        const newItems = [...servicesForm.items]
                        newItems[i].title = e.target.value
                        setServicesForm(f => ({ ...f, items: newItems }))
                      }}
                    />
                    <textarea
                      className="text-gray-600 text-lg leading-relaxed w-full text-black px-2 py-1 rounded"
                      value={service.description}
                      onChange={e => {
                        const newItems = [...servicesForm.items]
                        newItems[i].description = e.target.value
                        setServicesForm(f => ({ ...f, items: newItems }))
                      }}
                      rows={3}
                    />
                    <div className="text-xs text-gray-400 mt-2">※ SVG 태그 전체를 붙여넣으세요. ex: &lt;svg ...&gt;...&lt;/svg&gt;</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-center mt-8">
                <button onClick={handleServicesSave} className="bg-blue-600 text-white px-6 py-2 rounded">저장</button>
                <button onClick={() => { setServicesEditMode(false); setServicesForm({ title: initialSiteContent.services.title, desc: initialSiteContent.services.desc || '당사의 다양한 사업 영역을 소개합니다.', items: initialSiteContent.services.items.map(item => ({ ...item })) }) }} className="bg-gray-400 text-white px-6 py-2 rounded">취소</button>
              </div>
              {servicesSaveMsg && <div className="text-green-600 mb-2">{servicesSaveMsg}</div>}
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold text-center mb-6 text-gray-900">{servicesForm.title || initialSiteContent.services.title}</h2>
              <p className="text-center text-gray-400 mb-6 text-xl">{servicesForm.desc || '당사의 다양한 사업 영역을 소개합니다.'}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
                {initialSiteContent.services.items.map((service, i) => (
                  <div key={i} className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                      <div className="w-10 h-10 text-blue-600">
                        <div dangerouslySetInnerHTML={{ __html: service.icon || '' }} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <button onClick={() => setServicesEditMode(true)} className="bg-yellow-400 text-black px-6 py-2 rounded mt-8">수정</button>
              )}
              {servicesSaveMsg && <div className="text-green-600 mb-2">{servicesSaveMsg}</div>}
            </>
          )}
        </div>
      </section>

      {/* 주요 실적 미리보기 (4개 + 더보기) */}
      {/* 주요 실적 미리보기(4개 + 더보기) 섹션 전체 삭제 */}

      {/* 포트폴리오 갤러리 섹션 (이미지 참고 스타일) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 relative">
            {portfolioEditMode ? (
              <>
                <input
                  className="text-4xl font-bold mb-4 text-gray-900 w-full border rounded px-2 py-1 text-center"
                  value={portfolioSectionDraft.title}
                  onChange={e => setPortfolioSectionDraft({...portfolioSectionDraft, title: e.target.value})}
                />
                <input
                  className="text-xl text-gray-600 w-full border rounded px-2 py-1 text-center"
                  value={portfolioSectionDraft.desc}
                  onChange={e => setPortfolioSectionDraft({...portfolioSectionDraft, desc: e.target.value})}
                />
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-center mb-2">{portfolioSectionEdit.title}</h2>
                <p className="text-center text-gray-500 mb-10">{portfolioSectionEdit.desc}</p>
              </>
            )}
            {isAdmin && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                {portfolioEditMode ? (
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      setPortfolioSectionEdit(portfolioSectionDraft);
                      setPortfolioEditMode(false);
                      setPortfolioSaveMsg('저장되었습니다!');
                      setTimeout(() => setPortfolioSaveMsg(''), 2000);
                    }} className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 transition-all">
                      저장
                    </button>
                    <button onClick={() => { setPortfolioEditMode(false); setPortfolioSectionDraft(portfolioSectionEdit) }} className="bg-gray-500 text-white px-4 py-2 rounded shadow-lg hover:bg-gray-600 transition-all">
                      취소
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setPortfolioEditMode(true)} 
                    className="bg-yellow-400 text-black px-4 py-2 rounded shadow-lg hover:bg-yellow-500 transition-all"
                  >
                    수정
                  </button>
                )}
              </div>
            )}
            {portfolioSaveMsg && <div className="text-green-500 mt-2">{portfolioSaveMsg}</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portfolioItems.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="bg-white shadow-lg overflow-hidden hover:shadow-2xl transition" style={{ width: 350, height: 350, minWidth: 350, minHeight: 350, maxWidth: 350, maxHeight: 350 }}>
                <div className="relative" style={{ width: 350, height: 240 }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={350}
                    height={240}
                    style={{ objectFit: 'cover', width: 350, height: 240, display: 'block' }}
                  />
                  {idx === 0 && (
                    <span className="absolute top-4 right-4 bg-gray-700 text-white text-xs px-3 py-1 rounded">NEW</span>
                  )}
                </div>
                <div className="p-6 text-center" style={{ height: 110 }}>
                  <h3 className="text-xl font-semibold mb-2">{item.title} {idx === 0 && <span className="text-red-500">❤</span>}</h3>
                  <p className="text-gray-500 text-sm">{item.overview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/*
      <section id="contact" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-20 text-gray-900">{siteContent.contact.title}</h2>
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                      {siteContent.contact.form.name.label}
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={siteContent.contact.form.name.placeholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                      {siteContent.contact.form.email.label}
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={siteContent.contact.form.email.placeholder}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-3">
                    {siteContent.contact.form.message.label}
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder={siteContent.contact.form.message.placeholder}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg shadow-lg"
                >
                  {siteContent.contact.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      */}
    </main>
  )
} 