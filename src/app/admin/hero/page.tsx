'use client'

import { useState } from 'react'

// siteContent를 대체할 임시 데이터
const defaultContent = {
  hero: {
    title: '임시 타이틀',
    titleHighlight: '임시 강조',
    description: '임시 설명',
    primaryButton: '주요 버튼',
    secondaryButton: '보조 버튼'
  }
};

export default function HeroPage() {
  const [content, setContent] = useState(defaultContent)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('저장 중...')
    
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setSaveMessage('저장되었습니다!')
      } else {
        setSaveMessage('저장에 실패했습니다.')
      }
    } catch {
      setSaveMessage('오류가 발생했습니다.')
    }

    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hero 섹션 관리</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {saveMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <textarea
            value={content.hero.title}
            onChange={(e) => {
              setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))
            }}
            className="w-full px-4 py-2 border rounded-lg"
            rows={2}
            placeholder="줄바꿈은 \n으로 입력하세요"
          />
          <p className="mt-2 text-sm text-gray-500">미리보기:</p>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
            {content.hero.title.split('\n').map((line, i) => (
              <p key={i} className="text-xl font-bold">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* 강조 텍스트 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">강조 텍스트</label>
          <input
            type="text"
            value={content.hero.titleHighlight}
            onChange={(e) => {
              setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, titleHighlight: e.target.value }
              }))
            }}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
          <textarea
            value={content.hero.description}
            onChange={(e) => {
              setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, description: e.target.value }
              }))
            }}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            placeholder="줄바꿈은 \n으로 입력하세요"
          />
          <p className="mt-2 text-sm text-gray-500">미리보기:</p>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
            {content.hero.description.split('\n').map((line, i) => (
              <p key={i} className="text-lg text-gray-600">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* 버튼 텍스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">주요 버튼 텍스트</label>
            <input
              type="text"
              value={content.hero.primaryButton}
              onChange={(e) => {
                setContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, primaryButton: e.target.value }
                }))
              }}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">보조 버튼 텍스트</label>
            <input
              type="text"
              value={content.hero.secondaryButton}
              onChange={(e) => {
                setContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, secondaryButton: e.target.value }
                }))
              }}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">전체 미리보기</h3>
          <div className="relative h-[400px] bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 h-full flex items-center justify-center p-8">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">
                  {content.hero.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                  <span className="text-blue-300">{content.hero.titleHighlight}</span>
                </h1>
                <p className="text-xl mb-8">
                  {content.hero.description.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold">
                    {content.hero.primaryButton}
                  </button>
                  <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-semibold">
                    {content.hero.secondaryButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 