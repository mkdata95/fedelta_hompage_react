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
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 rounded-xl py-16 flex flex-col justify-center" style={{ background: '#393E46' }}>
          <h1 className="text-4xl font-bold mb-4 pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>자료다운로드</h1>
          <p className="text-xl pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>페델타의 제품 및 서비스 관련 자료를 다운로드하실 수 있습니다</p>
        </div>
      </section>

      {/* Downloads Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-12">
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-6 py-2 rounded-full hover:bg-[#948979] hover:text-[#222831] ${
                    selectedCategory === '전체' 
                      ? 'bg-[#222831] text-[#DFD0B8]' 
                      : 'bg-[#DFD0B8] text-[#393E46]'
                  }`}
                  onClick={() => setSelectedCategory('전체')}
                >
                  전체
                </button>
                
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    {isLoggedIn && editingCategoryId === category.id ? (
                      <div className="flex items-center bg-white rounded-full overflow-hidden shadow">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="px-3 py-1 focus:outline-none"
                        />
                        <button 
                          onClick={() => handleEditCategorySave(category)}
                          className="p-2 text-green-600 hover:text-green-800"
                        >
                          <FiCheck size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          className={`px-6 py-2 rounded-full hover:bg-[#948979] hover:text-[#222831] ${
                            selectedCategory === category.name 
                              ? 'bg-[#222831] text-[#DFD0B8]' 
                              : 'bg-[#DFD0B8] text-[#393E46]'
                          }`}
                          onClick={() => setSelectedCategory(category.name)}
                        >
                          {category.name}
                        </button>
                        
                        {isLoggedIn && (
                          <div className="flex ml-1">
                            <button 
                              onClick={() => handleEditCategoryStart(category)}
                              disabled={isSubmitting}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(category)}
                              disabled={isSubmitting}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              {isLoggedIn && (
                <div>
                  {showAddCategoryForm ? (
                    <div className="flex items-center bg-white rounded-full overflow-hidden shadow">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="새 카테고리 이름"
                        className="px-4 py-2 focus:outline-none"
                      />
                      <button 
                        onClick={handleAddCategory}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#222831] text-[#DFD0B8] hover:bg-[#948979]"
                      >
                        추가
                      </button>
                      <button 
                        onClick={() => setShowAddCategoryForm(false)}
                        disabled={isSubmitting}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddCategoryForm(true)}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] hover:bg-[#948979]"
                    >
                      <FiPlus /> 카테고리 추가
                    </button>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">자료를 불러오는 중입니다...</p>
              </div>
            ) : filteredDownloads.length > 0 ? (
              <div className="space-y-6">
                {filteredDownloads.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-[#222831] font-medium">{item.category}</span>
                        <h3 className="text-xl font-semibold mt-2 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      <div className="flex items-center">
                        <a
                          href={item.file_url}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                          download
                        >
                          <span>다운로드</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        
                        {isLoggedIn && (
                          <div className="flex ml-4">
                            <Link 
                              href={`/admin/downloads/edit/${item.id}`}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <FiEdit2 size={18} />
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
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
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
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">추가 자료가 필요하신가요?</h2>
            <p className="text-gray-600 mb-8">
              필요한 자료가 없으시다면 언제든지 문의해 주세요. 빠른 시일 내에 답변 드리겠습니다.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#222831] text-[#DFD0B8] px-8 py-3 rounded-lg font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
} 