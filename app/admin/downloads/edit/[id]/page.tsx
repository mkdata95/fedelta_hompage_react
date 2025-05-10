'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FiSave, FiArrowLeft } from 'react-icons/fi'

interface DownloadItem {
  id: string
  title: string
  description: string
  category: string
  file_url: string
  created_at: string
}

interface Category {
  id: number
  name: string
}

export default function EditDownloadPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [notFound, setNotFound] = useState(false)
  
  // 폼 데이터
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  
  // 다운로드 항목 및 카테고리 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // 카테고리 불러오기
        const catResponse = await fetch('/api/download-categories')
        if (catResponse.ok) {
          const catData = await catResponse.json()
          setCategories(catData)
        }
        
        // 다운로드 항목 불러오기
        const dlResponse = await fetch('/api/downloads')
        if (dlResponse.ok) {
          const dlData = await dlResponse.json()
          const item = dlData.find((item: DownloadItem) => item.id === id)
          
          if (item) {
            setTitle(item.title)
            setDescription(item.description)
            setCategory(item.category)
            setFileUrl(item.file_url)
          } else {
            setNotFound(true)
          }
        }
      } catch (error) {
        console.error('데이터 불러오기 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [id])
  
  // 폼 제출 처리
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !description.trim() || !fileUrl.trim() || !category) {
      alert('모든 필드를 채워주세요.')
      return
    }
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/downloads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: title.trim(),
          description: description.trim(),
          category,
          file_url: fileUrl.trim()
        }),
      })
      
      if (response.ok) {
        setSaveMessage('자료가 수정되었습니다!')
        setTimeout(() => {
          router.push('/admin/downloads')
        }, 1500)
      } else {
        setSaveMessage('자료 수정에 실패했습니다.')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('다운로드 항목 수정 오류:', error)
      setSaveMessage('오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 flex items-center">
        <button 
          onClick={() => router.push('/admin/downloads')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">자료 수정</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : notFound ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-500 mb-4">자료를 찾을 수 없습니다</h2>
          <p className="mb-4">요청하신 자료가 존재하지 않거나 삭제되었습니다.</p>
          <button
            onClick={() => router.push('/admin/downloads')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="자료 제목을 입력하세요"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="자료에 대한 설명을 입력하세요"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                카테고리 <span className="text-red-500">*</span>
              </label>
              {categories.length === 0 ? (
                <div className="text-red-500 mb-2">
                  등록된 카테고리가 없습니다. 먼저 카테고리를 추가해주세요.
                </div>
              ) : (
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
              <div className="mt-2">
                <button 
                  type="button"
                  onClick={() => router.push('/admin/downloads?tab=categories')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  카테고리 관리하기
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="fileUrl">
                파일 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fileUrl"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="파일의 URL을 입력하세요"
                required
              />
              <p className="text-gray-500 text-sm mt-1">
                다운로드 가능한 파일의 전체 URL을 입력하세요. (예: https://example.com/files/document.pdf)
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => router.push('/admin/downloads')}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg border hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || categories.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FiSave /> 저장하기
              </button>
            </div>
          </form>
          
          {saveMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {saveMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 