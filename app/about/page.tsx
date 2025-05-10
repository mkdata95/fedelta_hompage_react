"use client"

import { useEffect, useState } from 'react'
import { siteContent } from '../data/siteContent'
import Image from 'next/image'

const timelineDefault = siteContent.about.timeline || [
  { year: '2003', event: '회사 설립\nDPC 법인설립' },
  { year: '2004', event: 'fedelta설립,\n광고대행사 이전' },
  { year: '2008', event: '상업전환\n법인화' },
  { year: '2014', event: '특허등록\n국내최초 홀로그램스크린' },
  { year: '2016', event: '해외진출\n홍콩 오션파크 설치\n홀로그램스크린 수출' },
  { year: '2018', event: '전시/설치 등\n국내 대기업 홀로그램스크린 설치' },
]

// 기본 로고 이미지 경로 수정
const defaultLogo = '/images/default-logo.png'

export default function AboutPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [about, setAbout] = useState({
    title: '',
    visionTitle: '',
    visionContent: '',
    valuesTitle: '',
    valuesItems: '',
    timeline: timelineDefault,
    logo: '',
    greetingsTitle: 'DAONTHEME GREETINGS',
    greetingsDesc: '함께 성장하고 서로 신뢰하는\n행복한 기업문화를 꿈꾸는 기업!',
    logoAlign: 'left',
  })
  const [aboutDraft, setAboutDraft] = useState(about)
  const [saveMsg, setSaveMsg] = useState('')

  // 관리자 여부 확인
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const adminCookie = cookies.find(c => c.startsWith('admin_auth='))
    setIsAdmin(adminCookie ? adminCookie.split('=')[1] === '1' : false)
  }, [])

  // 회사소개 데이터 불러오기
  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setAbout(data)
        setAboutDraft(data)
      })
  }, [])

  // 저장
  const handleSave = async () => {
    setSaveMsg('저장 중...')
    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aboutDraft),
    })
    if (res.ok) {
      setAbout(aboutDraft)
      setEditMode(false)
      setSaveMsg('저장되었습니다!')
    } else {
      setSaveMsg('저장 실패')
    }
    setTimeout(() => setSaveMsg(''), 2000)
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center" style={{ backgroundColor: '#181617', backgroundImage: 'url(/images/hero-default.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', marginTop: '48px' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center w-full pt-12">
          {editMode ? (
            <input className="text-4xl md:text-5xl font-bold text-white mb-2 bg-white/80 px-2 py-1 rounded" value={aboutDraft.title} onChange={e => setAboutDraft(d => ({ ...d, title: e.target.value }))} />
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{about.title}</h1>
          )}
          <p className="text-lg text-gray-200">고객을 가장 먼저 생각하는 기업, 고객이 먼저 자랑하는 기업이 되겠습니다.</p>
        </div>
      </div>
      {/* 인사말/소개 */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center gap-16">
          {/* 좌측 이미지+텍스트 */}
          <div className="md:w-1/2 w-full flex flex-col items-center md:items-start">
            {editMode ? (
              <>
                {/* 로고 이미지 업로드 */}
                <div className="mb-4 w-full flex flex-col items-center">
                  {aboutDraft.logo && (
                    <img src={aboutDraft.logo} alt="로고 미리보기" className="w-80 h-48 object-contain" style={{ display: 'block' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="mb-2"
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
                          setAboutDraft(d => ({ ...d, logo: data.fileUrl }));
                        }
                      }
                    }}
                  />
                  {aboutDraft.logo && (
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => setAboutDraft(d => ({ ...d, logo: '' }))}
                    >
                      로고 이미지 삭제
                    </button>
                  )}
                  {/* 로고 정렬 선택 */}
                  <div className="mt-2 flex gap-2 items-center">
                    <label className="text-sm font-semibold">로고 정렬:</label>
                    <select
                      className="px-2 py-1 rounded border"
                      value={aboutDraft.logoAlign}
                      onChange={e => setAboutDraft(d => ({ ...d, logoAlign: e.target.value }))}
                    >
                      <option value="left">좌측</option>
                      <option value="center">중앙</option>
                      <option value="right">우측</option>
                    </select>
                  </div>
                </div>
                {/* 인라인 수정: GREETINGS 타이틀/설명 */}
                <input
                  className="text-2xl font-bold mb-4 text-[#B85C38] w-full bg-white/80 px-2 py-1 rounded"
                  value={aboutDraft.greetingsTitle}
                  onChange={e => setAboutDraft(d => ({ ...d, greetingsTitle: e.target.value }))}
                />
                <textarea
                  className="text-lg font-bold mb-6 text-gray-800 w-full bg-white/80 px-2 py-1 rounded"
                  value={aboutDraft.greetingsDesc}
                  onChange={e => setAboutDraft(d => ({ ...d, greetingsDesc: e.target.value }))}
                  rows={2}
                  placeholder="함께 성장하고 서로 신뢰하는\n행복한 기업문화를 꿈꾸는 기업!"
                />
              </>
            ) : (
              <>
                {about.logo ? (
                  <img
                    src={about.logo}
                    alt="회사 로고"
                    className="w-80 h-48 object-contain"
                    style={{
                      display: 'block',
                      marginLeft: about.logoAlign === 'left' ? 0 : about.logoAlign === 'center' ? 'auto' : undefined,
                      marginRight: about.logoAlign === 'right' ? 0 : about.logoAlign === 'center' ? 'auto' : undefined,
                      float: about.logoAlign === 'right' ? 'right' : about.logoAlign === 'left' ? 'left' : undefined,
                    }}
                  />
                ) : (
                  <Image
                    src={defaultLogo}
                    alt="회사 로고"
                    width={320}
                    height={200}
                    className="w-80 h-48 object-contain"
                  />
                )}
                <div className="text-2xl font-bold mb-4 text-[#B85C38]">{about.greetingsTitle}</div>
                <div className="text-lg font-bold mb-6 text-gray-800 whitespace-pre-line">{about.greetingsDesc}</div>
              </>
            )}
          </div>
          {/* 우측 인사말/설명 */}
          <div className="md:w-1/2 w-full flex flex-col items-center md:items-start">
            {editMode ? (
              <>
                <input className="text-2xl font-bold mb-6 text-[#222831] w-full bg-white/80 px-2 py-1 rounded" value={aboutDraft.visionTitle} onChange={e => setAboutDraft(d => ({ ...d, visionTitle: e.target.value }))} />
                <textarea className="text-base leading-relaxed text-gray-700 mb-4 w-full bg-white/80 px-2 py-1 rounded" value={aboutDraft.visionContent} onChange={e => setAboutDraft(d => ({ ...d, visionContent: e.target.value }))} rows={4} />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold mb-6 text-[#222831]">{about.visionTitle}</div>
                <div className="text-base leading-relaxed text-gray-700 mb-4 whitespace-pre-line">{about.visionContent}</div>
              </>
            )}
          </div>
        </div>
      </section>
      {/* 핵심가치 */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {editMode ? (
            <>
              <textarea className="text-base leading-relaxed text-gray-700 mb-4 w-full bg-white/80 px-2 py-1 rounded" value={aboutDraft.valuesItems} onChange={e => setAboutDraft(d => ({ ...d, valuesItems: e.target.value }))} rows={3} placeholder="핵심가치를 줄바꿈(\n)으로 구분" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-[#B85C38]">{about.valuesTitle}</h2>
              <ul className="list-disc pl-5 text-gray-900 text-lg text-left w-full mb-2">
                {about.valuesItems?.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      {/* 걸어온 길(타임라인) - 하단 가로형 */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 text-[#B85C38] text-center">걸어온 길</h2>
          <div className="flex flex-row items-start justify-center gap-8 overflow-x-auto pb-4">
            {(about.timeline || timelineDefault).map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[160px]">
                <div className="w-14 h-14 rounded-full bg-[#222831] text-[#DFD0B8] flex items-center justify-center text-lg font-bold mb-2">{item.year}</div>
                <div className="text-gray-700 text-center whitespace-pre-line text-sm">{item.event}</div>
                {idx < (about.timeline || timelineDefault).length - 1 && (
                  <div className="w-16 h-1 bg-[#948979] my-4 mx-auto rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 관리자용 버튼 */}
      {isAdmin && (
        <div className="flex gap-2 justify-center my-8">
          {editMode ? (
            <>
              <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded">저장</button>
              <button onClick={() => { setEditMode(false); setAboutDraft(about) }} className="bg-gray-400 text-white px-6 py-2 rounded">취소</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-yellow-400 text-black px-6 py-2 rounded">수정</button>
          )}
        </div>
      )}
      {saveMsg && <div className="text-center text-green-600 mb-4">{saveMsg}</div>}
    </main>
  )
} 