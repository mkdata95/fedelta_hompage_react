"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  pageKey: 'about' | 'products' | 'portfolio' | 'downloads' | 'customer'
}

export default function PageHeader({ title, subtitle, backgroundImage, pageKey }: PageHeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editSubtitle, setEditSubtitle] = useState(subtitle || '')
  const [editBgImage, setEditBgImage] = useState(backgroundImage || '/images/hero-default.jpg')
  const [saveMessage, setSaveMessage] = useState('')

  // 관리자 체크
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const adminCookie = cookies.find(c => c.startsWith('admin_auth='))
    setIsAdmin(adminCookie ? adminCookie.split('=')[1] === '1' : false)
  }, [])

  // 페이지 설정 로드
  useEffect(() => {
    fetch(`/api/page-settings?page=${pageKey}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.title) {
          setEditTitle(data.title)
          setEditSubtitle(data.subtitle || '')
          setEditBgImage(data.backgroundImage || '/images/hero-default.jpg')
        }
      })
      .catch(err => console.error('페이지 설정 로드 오류:', err))
  }, [pageKey])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/page-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pageKey,
          title: editTitle,
          subtitle: editSubtitle,
          backgroundImage: editBgImage
        })
      })

      if (response.ok) {
        setSaveMessage('저장되었습니다!')
        setIsEditing(false)
        setTimeout(() => setSaveMessage(''), 2000)
      } else {
        setSaveMessage('저장 실패')
        setTimeout(() => setSaveMessage(''), 2000)
      }
    } catch (error) {
      console.error('헤더 저장 오류:', error)
      setSaveMessage('오류가 발생했습니다')
      setTimeout(() => setSaveMessage(''), 2000)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.fileUrl) {
        setEditBgImage(data.fileUrl)
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
    }
  }

  return (
    <div 
      className="relative w-full h-64 md:h-80 flex items-center justify-center" 
      style={{ 
        backgroundColor: '#181617', 
        backgroundImage: `url(${editBgImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        marginTop: '48px'  
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
      
      {/* 수정 버튼 */}
      {isAdmin && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 z-50 shadow-lg hover:bg-yellow-500 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          수정
        </button>
      )}
      
      {/* 편집 모드 */}
      {isAdmin && isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4">헤더 섹션 수정</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">타이틀</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">부제목</label>
              <input
                type="text"
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">배경 이미지</label>
              {editBgImage && (
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={editBgImage}
                    alt="배경 미리보기"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                취소
              </button>
            </div>
            
            {saveMessage && (
              <div className="mt-2 text-center text-green-600">{saveMessage}</div>
            )}
          </div>
        </div>
      )}
      
      <div className="relative z-10 text-center w-full pt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{isEditing ? editTitle : editTitle}</h1>
        {(isEditing ? editSubtitle : subtitle) && (
          <p className="text-lg text-gray-200">{isEditing ? editSubtitle : subtitle}</p>
        )}
      </div>
    </div>
  )
} 