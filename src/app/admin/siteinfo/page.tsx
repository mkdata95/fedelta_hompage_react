"use client"

import { useState } from 'react'
// import { siteContent } from '../../data/siteContent'

// 임시 데이터
const defaultSiteInfo = {
  siteName: '임시 사이트명',
  companyName: '임시 회사명',
  businessNumber: '000-00-00000',
  ceoName: '홍길동',
  phone: '010-0000-0000',
  address: '서울특별시',
  email: 'test@example.com'
};

export default function SiteInfoPage() {
  // const [info, setInfo] = useState(siteContent.siteInfo)
  const [info, setInfo] = useState(defaultSiteInfo)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleChange = (field: string, value: string) => {
    setInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('저장 중...')
    // 임시 newContent
    const newContent = {
      siteInfo: info
    }
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
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
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-8">사이트 정보</h1>
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">사이트명</label>
          <input type="text" value={info.siteName} onChange={e => handleChange('siteName', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">회사명</label>
          <input type="text" value={info.companyName} onChange={e => handleChange('companyName', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">사업자번호</label>
          <input type="text" value={info.businessNumber} onChange={e => handleChange('businessNumber', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">대표이름</label>
          <input type="text" value={info.ceoName} onChange={e => handleChange('ceoName', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">전화번호</label>
          <input type="text" value={info.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">주소</label>
          <input type="text" value={info.address} onChange={e => handleChange('address', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input type="email" value={info.email} onChange={e => handleChange('email', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>
      </div>
      <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">{isSaving ? '저장 중...' : '저장하기'}</button>
      {saveMessage && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">{saveMessage}</div>}
    </div>
  )
} 