'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiDownload } from 'react-icons/fi'

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

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  
  // 로그인 상태 확인
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])
  
  // 다운로드 항목 불러오기
  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await fetch('/api/downloads')
        if (response.ok) {
          const data = await response.json()
          setDownloads(data)
        }
      } catch (error) {
        console.error('다운로드 항목 불러오기 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDownloads()
  }, [])
  
  // 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/download-categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('카테고리 불러오기 오류:', error)
      }
    }
    
    fetchCategories()
  }, [])
  
  // 카테고리 필터링
  const filteredDownloads = selectedCategory === '전체'
    ? downloads
    : downloads.filter(item => item.category === selectedCategory)

  // 카테고리 추가
  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || categories.some(cat => cat.name === newCategoryName.trim())) {
      alert('이미 존재하거나 유효하지 않은 카테고리명입니다.')
      return
    }
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/download-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })
      
      if (response.ok) {
        const newCat = await response.json()
        setCategories([...categories, newCat])
        setNewCategoryName('')
        setSaveMessage('카테고리가 추가되었습니다!')
        setShowAddCategoryForm(false)
      } else {
        setSaveMessage('카테고리 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('카테고리 추가 오류:', error)
      setSaveMessage('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // 카테고리 삭제
  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?`)) return
    
    // 이 카테고리를 사용하는 다운로드 항목이 있는지 확인
    const usedItems = downloads.filter(item => item.category === category.name)
    if (usedItems.length > 0) {
      alert(`이 카테고리를 사용하는 다운로드 항목(${usedItems.length}개)이 있습니다. 먼저 해당 항목들의 카테고리를 변경해주세요.`)
      return
    }
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/download-categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category.name }),
      })
      
      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== category.id))
        setSaveMessage('카테고리가 삭제되었습니다!')
      } else {
        setSaveMessage('카테고리 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('카테고리 삭제 오류:', error)
      setSaveMessage('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // 카테고리 수정 시작
  const handleEditCategoryStart = (category: Category) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  // 카테고리 수정 저장
  const handleEditCategorySave = async (category: Category) => {
    if (!editingCategoryName.trim() || categories.some(cat => cat.name === editingCategoryName.trim() && cat.id !== category.id)) {
      alert('이미 존재하거나 유효하지 않은 카테고리명입니다.')
      return
    }
    
    setIsSubmitting(true)
    try {
      // 기존 카테고리 삭제
      const deleteResponse = await fetch('/api/download-categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category.name }),
      })
      
      if (deleteResponse.ok) {
        // 새 이름의 카테고리 추가
        const addResponse = await fetch('/api/download-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editingCategoryName.trim() }),
        })
        
        if (addResponse.ok) {
          const newCat = await addResponse.json()
          setCategories(categories.map(c => c.id === category.id ? newCat : c))
          setSaveMessage('카테고리가 수정되었습니다!')
        } else {
          // 실패 시 원래 이름으로 복원
          await fetch('/api/download-categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: category.name }),
          })
          setSaveMessage('카테고리 수정에 실패했습니다.')
        }
      } else {
        setSaveMessage('카테고리 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('카테고리 수정 오류:', error)
      setSaveMessage('오류가 발생했습니다.')
    } finally {
      setEditingCategoryId(null)
      setEditingCategoryName('')
      setIsSubmitting(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 상단 비주얼 */}
      <div className="relative w-full h-56 bg-black flex items-center justify-center mt-24">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">자료다운로드</h1>
      </div>
      
      {/* 탭 메뉴 */}
      <div className="bg-white border-b">
        <div className="flex justify-center gap-8 py-4">
          <button 
            className={`px-5 py-2 text-lg ${selectedCategory === '전체' ? 'font-bold border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setSelectedCategory('전체')}
          >
            전체
          </button>
          {categories.map((category) => (
            <button 
              key={category.id}
              className={`px-5 py-2 text-lg ${selectedCategory === category.name ? 'font-bold border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
          
          {isLoggedIn && showAddCategoryForm && (
            <div className="flex items-center">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="새 카테고리"
                className="border px-2 py-1 text-sm"
              />
              <button 
                onClick={handleAddCategory}
                disabled={isSubmitting}
                className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded"
              >
                추가
              </button>
              <button 
                onClick={() => setShowAddCategoryForm(false)}
                disabled={isSubmitting}
                className="ml-1 px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 다운로드 목록 */}
      <div className="container mx-auto py-8 px-2" style={{ maxWidth: '1100px' }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <div>전체 <span className="text-blue-600 font-bold">{filteredDownloads.length}</span>건</div>
          
          {isLoggedIn && (
            <div className="flex gap-2">
              {!showAddCategoryForm && (
                <button
                  onClick={() => setShowAddCategoryForm(true)}
                  disabled={isSubmitting}
                  className="bg-gray-600 text-white px-4 py-2 rounded font-bold text-sm"
                >
                  카테고리 추가
                </button>
              )}
              <Link 
                href="/admin/downloads/new"
                className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
              >
                자료 등록
              </Link>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">자료를 불러오는 중입니다...</p>
          </div>
        ) : filteredDownloads.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-none shadow border border-gray-300">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 font-bold text-gray-900 border-r border-gray-200">순번</th>
                  <th className="p-3 font-bold text-gray-900 border-r border-gray-200">카테고리</th>
                  <th className="p-3 font-bold text-gray-900 border-r border-gray-200">제목</th>
                  <th className="p-3 font-bold text-gray-900 border-r border-gray-200">다운로드</th>
                  <th className="p-3 font-bold text-gray-900 border-r border-gray-200">등록일</th>
                  {isLoggedIn && (
                    <th className="p-3 font-bold text-gray-900">관리</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {[...filteredDownloads]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((item, index, arr) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                    <td className="p-2 text-center font-medium text-gray-800 border-r border-gray-100">{arr.length - index}</td>
                    <td className="p-2 text-center font-medium text-gray-800 border-r border-gray-100">{item.category}</td>
                    <td className="p-2 text-left border-r border-gray-100">
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                    </td>
                    <td className="p-2 text-center border-r border-gray-100">
                      <a
                        href={item.file_url}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        download
                      >
                        <FiDownload className="mr-1" /> 다운로드
                      </a>
                    </td>
                    <td className="p-2 text-center text-gray-700 border-r border-gray-100">{item.created_at.slice(0, 10)}</td>
                    {isLoggedIn && (
                      <td className="p-2 flex gap-2 justify-center">
                        <Link 
                          href={`/admin/downloads/edit/${item.id}`} 
                          className="text-xs text-white bg-gray-800 rounded-none font-bold px-3 py-1 hover:bg-black transition"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`"${item.title}" 자료를 삭제하시겠습니까?`)) {
                              fetch('/api/downloads', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: item.id }),
                              })
                              .then(res => {
                                if (res.ok) {
                                  setDownloads(downloads.filter(d => d.id !== item.id))
                                } else {
                                  alert('삭제 실패')
                                }
                              })
                            }
                          }}
                          disabled={isSubmitting}
                          className="text-xs text-white bg-red-600 rounded-none font-bold px-3 py-1 hover:bg-red-700 transition"
                        >
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-gray-300 rounded-none shadow">
            <p className="text-gray-600">해당 카테고리에 자료가 없습니다.</p>
            
            {isLoggedIn && (
              <div className="mt-4">
                <Link
                  href="/admin/downloads/new"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiDownload /> 새 자료 등록하기
                </Link>
              </div>
            )}
          </div>
        )}
        
        {saveMessage && (
          <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 p-3 rounded-lg shadow-lg">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  )
} 