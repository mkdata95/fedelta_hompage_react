"use client"

import { useState, useEffect, useRef, FormEvent } from 'react'
import { FiTrash2, FiEdit2, FiCheck, FiPlus, FiUpload, FiX, FiFile } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'

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

interface FileItem {
  id: string
  name: string
  url: string
}

export default function DownloadsManagePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'list' | 'categories'>(tabParam === 'categories' ? 'categories' : 'list')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 다운로드 항목 관리 상태
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // 카테고리 관리 상태
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 인라인 등록 폼 관련 상태
  const [showAddForm, setShowAddForm] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newFiles, setNewFiles] = useState<FileItem[]>([])
  const [tempFileCounter, setTempFileCounter] = useState(0)

  // 카테고리 및 다운로드 항목 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // 카테고리 불러오기
        const catResponse = await fetch('/api/download-categories')
        if (catResponse.ok) {
          const catData = await catResponse.json()
          setCategories(catData)
          if (catData.length > 0) {
            setNewCategory(catData[0].name)
          }
        }
        
        // 다운로드 항목 불러오기
        const dlResponse = await fetch('/api/downloads')
        if (dlResponse.ok) {
          const dlData = await dlResponse.json()
          setDownloads(dlData)
        }
      } catch (error) {
        console.error('데이터 불러오기 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

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

  // 카테고리 이름 수정 시작
  const handleEditStart = (category: Category, idx: number) => {
    setEditingIdx(idx)
    setEditingValue(category.name)
  }

  // 카테고리 이름 수정 저장
  const handleEditSave = async (category: Category) => {
    if (!editingValue.trim() || categories.some(cat => cat.name === editingValue.trim() && cat.id !== category.id)) {
      alert('이미 존재하거나 유효하지 않은 카테고리명입니다.')
      return
    }
    
    // 이 카테고리를 사용하는 다운로드 항목이 있는지 확인
    const usedItems = downloads.filter(item => item.category === category.name)
    
    setIsSubmitting(true)
    try {
      // 먼저 카테고리 이름 삭제 후 새 이름으로 추가
      const deleteResponse = await fetch('/api/download-categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category.name }),
      })
      
      if (deleteResponse.ok) {
        const addResponse = await fetch('/api/download-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editingValue.trim() }),
        })
        
        if (addResponse.ok) {
          const newCat = await addResponse.json()
          
          // 카테고리 목록 업데이트
          setCategories(categories.map(cat => 
            cat.id === category.id ? newCat : cat
          ))
          
          // 관련 다운로드 항목들의 카테고리 이름도 변경
          if (usedItems.length > 0) {
            const updatePromises = usedItems.map(item => 
              fetch('/api/downloads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...item,
                  category: editingValue.trim()
                }),
              })
            )
            
            await Promise.all(updatePromises)
            
            // 다운로드 항목 목록도 업데이트
            setDownloads(downloads.map(item => 
              item.category === category.name 
                ? { ...item, category: editingValue.trim() } 
                : item
            ))
          }
          
          setSaveMessage('카테고리가 수정되었습니다!')
        } else {
          // 삭제 후 추가에 실패한 경우, 원래 카테고리 복원
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
      setEditingIdx(null)
      setEditingValue('')
      setIsSubmitting(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // 다운로드 항목 삭제
  const handleDeleteDownload = async (item: DownloadItem) => {
    if (!window.confirm(`"${item.title}" 자료를 삭제하시겠습니까?`)) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/downloads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
      
      if (response.ok) {
        setDownloads(downloads.filter(d => d.id !== item.id))
        setSaveMessage('자료가 삭제되었습니다!')
      } else {
        setSaveMessage('자료 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('다운로드 항목 삭제 오류:', error)
      setSaveMessage('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // 파일 선택 핸들러 수정: 실제 파일 업로드 기능 추가
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsSubmitting(true); // 업로드 중 상태 설정
      
      try {
        const newFileItems: FileItem[] = [];
        
        // 각 파일을 서버에 업로드
        for (const file of Array.from(e.target.files)) {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const result = await response.json();
            newFileItems.push({
              id: `file-${tempFileCounter + newFileItems.length}`,
              name: result.fileName,
              url: result.fileUrl
            });
          } else {
            throw new Error('파일 업로드 실패');
          }
        }
        
        setTempFileCounter(prev => prev + newFileItems.length);
        setNewFiles([...newFiles, ...newFileItems]);
        setSaveMessage('파일 업로드 완료!');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        console.error('파일 업로드 오류:', error);
        alert('파일 업로드에 실패했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    }
    
    // 파일 입력 필드 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 파일 제거
  const handleRemoveFile = (id: string) => {
    setNewFiles(newFiles.filter(file => file.id !== id));
  };

  // 자료 등록 폼 제출 수정: URL 대신 업로드된 파일 사용
  const handleSubmitNewDownload = async (e: FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDescription.trim() || !newCategory || newFiles.length === 0) {
      alert('모든 필드를 입력하고 최소 하나의 파일을 추가해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 각 파일별로 다운로드 항목 생성
      const uploadPromises = newFiles.map(async (file) => {
        const response = await fetch('/api/downloads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle.trim(),
            description: newDescription.trim(),
            category: newCategory,
            file_url: file.url
          }),
        });
        
        if (!response.ok) {
          throw new Error('자료 등록 실패');
        }
        
        return await response.json();
      });
      
      const results = await Promise.all(uploadPromises);
      
      // 새 다운로드 항목 생성
      const newItems = results.map((result, index) => ({
        id: result.id,
        title: `${newTitle.trim()}${newFiles.length > 1 ? ` (${index + 1}/${newFiles.length})` : ''}`,
        description: newDescription.trim(),
        category: newCategory,
        file_url: newFiles[index].url,
        created_at: new Date().toISOString()
      }));
      
      // 목록에 새 항목 추가
      setDownloads([...newItems, ...downloads]);
      setSaveMessage('자료가 등록되었습니다!');
      
      // 폼 초기화
      setNewTitle('');
      setNewDescription('');
      if (categories.length > 0) {
        setNewCategory(categories[0].name);
      } else {
        setNewCategory('');
      }
      setNewFiles([]);
      setShowAddForm(false);
    } catch (error) {
      console.error('다운로드 항목 등록 오류:', error);
      setSaveMessage('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // 자료 등록 폼 취소
  const handleCancelNewDownload = () => {
    setShowAddForm(false);
    setNewTitle('');
    setNewDescription('');
    setNewFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">자료다운로드 관리</h1>
      
      {/* 탭 메뉴 */}
      <div className="flex space-x-4 border-b border-gray-200 mb-8">
        <button
          className={`py-3 px-6 font-medium ${activeTab === 'list' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('list')}
        >
          다운로드 목록
        </button>
        <button
          className={`py-3 px-6 font-medium ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('categories')}
        >
          카테고리 관리
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : activeTab === 'categories' ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">카테고리 관리</h2>
          
          {/* 새 카테고리 추가 폼 */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="새 카테고리 이름"
            />
            <button 
              onClick={handleAddCategory} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <FiPlus />추가
            </button>
          </div>
          
          {/* 카테고리 목록 */}
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">등록된 카테고리가 없습니다.</div>
          ) : (
            <ul className="space-y-2 mb-6">
              {categories.map((category, idx) => (
                <li key={category.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                  {editingIdx === idx ? (
                    <>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        onClick={() => handleEditSave(category)} 
                        className="text-green-600 hover:text-green-700 p-1"
                      >
                        <FiCheck size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 font-medium">{category.name}</span>
                      <button 
                        onClick={() => handleEditStart(category, idx)} 
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <FiEdit2 size={18} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDeleteCategory(category)} 
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          {saveMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {saveMessage}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">다운로드 자료 목록</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <FiUpload /> 자료 등록
            </button>
          </div>

          {/* 인라인 등록 폼 */}
          {showAddForm && (
            <div className="mb-8 border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">새 자료 등록</h3>
              <form onSubmit={handleSubmitNewDownload}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="newTitle">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="newTitle"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="자료 제목을 입력하세요"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="newDescription">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="newDescription"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="자료에 대한 설명을 입력하세요"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="newCategory">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  {categories.length === 0 ? (
                    <div className="text-red-500 mb-2">
                      등록된 카테고리가 없습니다. 먼저 카테고리를 추가해주세요.
                    </div>
                  ) : (
                    <select
                      id="newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={isSubmitting}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    파일 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '업로드 중...' : '파일 선택'}
                    </button>
                    <span className="text-gray-500 text-sm">다중 선택 가능</span>
                  </div>
                  
                  {/* 업로드 진행 중 표시 */}
                  {isSubmitting && (
                    <div className="mt-4 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                      <span className="text-blue-700">파일 업로드 중...</span>
                    </div>
                  )}
                  
                  {/* 선택한 파일 목록 */}
                  {newFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {newFiles.map((file) => (
                        <div key={file.id} className="flex justify-between items-center p-2 bg-white rounded border">
                          <div className="flex items-center gap-2">
                            <FiFile className="text-blue-500" />
                            <span className="text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-red-500 p-1 hover:text-red-700"
                            disabled={isSubmitting}
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelNewDownload}
                    className="px-4 py-2 text-gray-700 font-medium rounded-lg border hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FiUpload /> 등록하기
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* 다운로드 항목 목록 */}
          {downloads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">등록된 다운로드 항목이 없습니다.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {downloads.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm text-blue-600 font-medium">{item.category || '카테고리 없음'}</span>
                      <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      <a 
                        href={item.file_url} 
                        download
                        className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800 gap-1"
                      >
                        <FiFile /> 파일 다운로드
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => router.push(`/admin/downloads/edit/${item.id}`)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        disabled={isSubmitting}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-600 p-1"
                        onClick={() => handleDeleteDownload(item)}
                        disabled={isSubmitting}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
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