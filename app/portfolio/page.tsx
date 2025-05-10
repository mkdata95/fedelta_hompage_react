"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiTrash2, FiPlus, FiTag } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'

// 이미지 리사이징 및 최적화 함수 추가
function resizeAndOptimizeImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      // 원본 비율 유지
      let width = img.width;
      let height = img.height;
      
      // 최대 크기 제한
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      // Canvas에 이미지 그리기
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // 최적화된 이미지를 base64로 변환 (JPEG 포맷, 품질 조정)
        const optimizedImage = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedImage);
      } else {
        // Canvas context를 가져올 수 없는 경우 원본 이미지 URL을 반환
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    // 파일을 Data URL로 변환
    img.src = URL.createObjectURL(file);
  });
}

const ITEMS_PER_PAGE = 12

export interface PortfolioItem {
  id: string
  title: string
  period: string
  role: string
  overview: string
  details: string[] | string
  client: string
  image: string
  category: string
  gallery?: any[]
  size?: string
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newItem, setNewItem] = useState<PortfolioItem>({
    id: '',
    title: '',
    period: '',
    role: '',
    overview: '',
    details: [''],
    client: '',
    image: '/images/projects/science-museum.jpg',
    category: '',
    size: 'Desktop 1200 - Mobile 360',
  })
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // 로그인 상태 확인
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  // 포트폴리오 데이터 불러오기
  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setItems(data))
  }, [])
  
  // 카테고리 목록 로드
  useEffect(() => {
    fetch('/api/portfolio-categories')
      .then(res => {
        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCategories(data.map((cat: { id: number, name: string }) => cat.name));
      })
      .catch(error => {
        console.error('Failed to load portfolio categories:', error);
        // 카테고리 로드 실패 시 빈 배열로 설정
        setCategories([]);
      });
  }, []);

  // 카테고리 추가
  const handleAddCategory = async () => {
    const cat = newCategory.trim()
    if (!cat) return
    if (categories.includes(cat)) return alert('이미 존재하는 카테고리입니다.')
    
    try {
      const response = await fetch('/api/portfolio-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cat })
      })
      
      if (response.ok) {
        const newCat = await response.json()
        setCategories(prev => [...prev, newCat.name])
        setNewCategory('')
      } else {
        const error = await response.json()
        alert(error.error || '카테고리 추가 실패')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      alert('카테고리 추가 실패')
    }
  }

  // 카테고리 삭제
  const handleDeleteCategory = async (cat: string) => {
    try {
      const response = await fetch('/api/portfolio-categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cat })
      })
      
      if (response.ok) {
        setCategories(prev => prev.filter(c => c !== cat))
        if (selectedCategory === cat) {
          setSelectedCategory('전체')
        }
      } else {
        alert('카테고리 삭제 실패')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('카테고리 삭제 실패')
    }
  }

  // 카테고리/페이지네이션
  const availableCategories = useMemo(() => {
    return ['전체', ...categories];
  }, [categories]);
  
  const filtered = selectedCategory === '전체' ? items : items.filter(p => p.category === selectedCategory)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // 추가
  const handleAdd = async () => {
    if (!newItem.title.trim()) return alert('프로젝트명을 입력하세요!')
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, id: uuidv4() })
    })
    const { id } = await res.json()
    setItems(prev => [...prev, { ...newItem, id }])
    setNewItem({ id: '', title: '', period: '', role: '', overview: '', details: [''], client: '', image: '/images/projects/science-museum.jpg', category: '', size: 'Desktop 1200 - Mobile 360' })
    setIsAdding(false)
  }

  // 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    await fetch('/api/portfolio', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section
        className="relative h-64 w-full flex items-center justify-center mb-8"
        style={{ background: '#111', minHeight: '16rem', width: '100%', zIndex: 1 }}
      >
        <h1 className="text-4xl font-bold text-white">주요 실적</h1>
      </section>

      {/* 네비게이션 */}
      <nav className="w-full flex justify-start mb-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ol className="flex items-center space-x-2 text-gray-500 text-sm">
          <li><Link href="/">홈</Link></li>
          <li>&gt;</li>
          <li>주요 실적</li>
        </ol>
      </nav>

      {/* 카테고리 버튼 */}
      <div className="w-full flex justify-center mb-8 mt-12" style={{ maxWidth: '1200px', margin: '3rem auto 2rem auto' }}>
        <div className="flex gap-2 flex-wrap justify-center">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={
                `px-7 py-2 rounded-full font-bold text-base transition-all duration-200 shadow-sm border-2 ` +
                (selectedCategory === cat ? 'bg-[#222831] text-[#DFD0B8] border-[#948979] shadow-lg scale-105' :
                  'bg-[#DFD0B8] text-[#393E46] border-transparent hover:bg-[#948979] hover:text-[#222831] hover:border-[#393E46]')
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 실적 추가/카테고리 관리 + 카테고리 버튼 */}
      <div className="container mx-auto px-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-center gap-4">
        <div className="flex gap-2 justify-center">
          {isLoggedIn && !isAdding && (
            <>
              <button
                onClick={() => {
                  setNewItem(prev => ({
                    ...prev,
                    category: selectedCategory !== '전체' ? selectedCategory : ''
                  }));
                  setIsAdding(true);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors shadow"
              >
                <FiPlus /> 실적 추가
              </button>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#DFD0B8] text-[#222831] font-semibold hover:bg-[#222831] hover:text-[#DFD0B8] transition-colors shadow"
              >
                <FiTag /> 카테고리 관리
              </button>
            </>
          )}
        </div>
      </div>

      {/* 실적 추가 폼 (isAdding) */}
      {isAdding && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex flex-col items-center">
              <label className="w-full flex flex-col items-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const optimizedImage = await resizeAndOptimizeImage(file);
                      setNewItem(prev => ({ ...prev, image: optimizedImage }))
                    }
                  }}
                />
                <img
                  src={newItem.image || '/images/projects/science-museum.jpg'}
                  alt="실적 이미지"
                  width={128}
                  height={128}
                  className="object-cover rounded-xl border mb-2"
                  style={{ width: 128, height: 128 }}
                />
                <span className="text-xs text-gray-500">이미지 변경</span>
              </label>
            </div>
            <div className="w-full md:w-3/4 flex flex-col gap-2">
              <input
                type="text"
                value={newItem.title}
                onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="프로젝트명"
                className="text-xl font-bold border rounded-lg p-2 mb-2"
              />
              <textarea
                value={newItem.overview}
                onChange={e => setNewItem(prev => ({ ...prev, overview: e.target.value }))}
                placeholder="설명"
                className="border rounded-lg p-2 mb-2 h-16"
              />
              <textarea
                value={Array.isArray(newItem.details) ? newItem.details.join('\n') : newItem.details}
                onChange={e => setNewItem(prev => ({ ...prev, details: e.target.value.split('\n') }))}
                placeholder="상세 정보 (줄바꿈으로 구분)"
                className="border rounded-lg p-2 mb-2 h-24"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAdd}
                  className="px-6 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2 rounded-lg border border-[#222831] text-[#222831] font-semibold hover:bg-gray-100 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 카드형 리스트 (갤러리 스타일) */}
      <section className="w-full flex flex-col items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full">
          {paginated.map((item) => (
            <Link 
              href={`/portfolio/${item.id}`} 
              key={item.id}
              className="bg-white shadow hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer"
              style={{ width: 590, height: 590, minWidth: 590, minHeight: 590, maxWidth: 590, maxHeight: 590, borderRadius: 0 }}
            >
              {/* 이미지 */}
              <div className="bg-gray-100 overflow-hidden" style={{ width: 590, height: 443 }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover"
                  style={{ width: 590, height: 443, display: 'block' }}
                />
              </div>
              {/* 정보 */}
              <div className="p-6 flex flex-col flex-1" style={{height: 147, minHeight: 147, maxHeight: 147}}>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 flex-1">{item.overview}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>날짜: {item.period}</span>
                  {isLoggedIn && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 mb-8">
          <div className="flex space-x-2">
            {page > 1 && (
              <button 
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                이전
              </button>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-md ${
                  p === page 
                    ? 'bg-[#222831] text-white font-bold' 
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            
            {page < totalPages && (
              <button 
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                다음
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="h-20"></div>

      {/* 카테고리 관리 모달 */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-6 text-center">카테고리 관리</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="새 카테고리 입력"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                className="border rounded-lg px-3 py-2 flex-1"
              />
              <button
                onClick={handleAddCategory}
                className="bg-[#222831] text-[#DFD0B8] font-bold px-4 py-2 rounded-lg hover:bg-[#948979] hover:text-[#222831] transition-colors"
              >
                추가
              </button>
            </div>
            <ul className="space-y-2">
              {categories.length === 0 && <li className="text-gray-400 text-center">카테고리가 없습니다.</li>}
              {categories.map(cat => (
                <li key={cat} className="flex items-center justify-between bg-[#F4EFE6] rounded-lg px-4 py-2">
                  <span className="font-medium text-[#393E46]">{cat}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  )
} 
