"use client"

import { useProducts, Product } from '../context/ProductContext'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { FiTrash2, FiPlus, FiTag, FiX } from 'react-icons/fi'
import Image from 'next/image'
import PageHeader from '../components/PageHeader'

// UUID 생성 함수
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function ProductsPage() {
  const { products, addProduct, deleteProduct } = useProducts()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newCategory, setNewCategory] = useState('')
  const [newProduct, setNewProduct] = useState<Product>({
    id: generateUUID(),
    title: '',
    description: '',
    detail: '',
    image: '/images/products/MSI.png',
  })
  const [search, setSearch] = useState('')
  const [tagInput, setTagInput] = useState('')

  // 선택된 카테고리와 검색어에 따라 필터링된 제품 목록
  const filteredProducts = useMemo(() => {
    let list = products
    if (selectedCategory !== 'all') {
      list = list.filter(product => product.category === selectedCategory)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(product =>
        (product.title && product.title.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q)) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(q)))
      )
    }
    return list
  }, [products, selectedCategory, search])

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  // 카테고리 목록 로드
  useEffect(() => {
    fetch('/api/categories')
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
        console.error('Failed to load categories:', error);
        // 카테고리 로드 실패 시 빈 배열로 설정
        setCategories([]);
      });
  }, []);

  const handleAddCategory = async () => {
    const cat = newCategory.trim()
    if (!cat) return
    if (categories.includes(cat)) return alert('이미 존재하는 카테고리입니다.')
    
    try {
      const response = await fetch('/api/categories', {
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

  const handleDeleteCategory = async (cat: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cat })
      })
      
      if (response.ok) {
        setCategories(prev => prev.filter(c => c !== cat))
      } else {
        alert('카테고리 삭제 실패')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('카테고리 삭제 실패')
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.title.trim()) return alert('제품명을 입력하세요!')
    addProduct(newProduct)
    setNewProduct({
      id: generateUUID(),
      title: '',
      description: '',
      detail: '',
      image: '/images/products/MSI.png',
      tags: [],
      category: selectedCategory !== 'all' ? selectedCategory : ''
    })
    setIsAdding(false)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setNewProduct({
      id: generateUUID(),
      title: '',
      description: '',
      detail: '',
      image: '/images/products/MSI.png',
      tags: []
    })
  }

  return (
    <main className="bg-white min-h-screen">
      <PageHeader
        title="제품소개"
        subtitle="보다 발전된 기술로 보다 참신한 제품을 생산합니다."
        pageKey="products"
      />
      {/* 경로 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 flex items-center text-gray-400 text-sm gap-2 py-4">
          <span>홈</span>
          <span className="mx-1">&gt;</span>
          <span>제품소개</span>
          <span className="mx-1">&gt;</span>
          <span className="text-[#B85C38] font-bold">갤러리형</span>
        </div>
      </div>
      {/* 제품 카드 그리드 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* 카테고리 탭 + 검색 */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
            <div className="flex gap-2 justify-center">
              <button className={`px-5 py-2 rounded-full font-semibold transition-colors border ${selectedCategory === 'all' ? 'bg-[#222831] text-[#DFD0B8] border-[#222831]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`} onClick={() => setSelectedCategory('all')}>전체</button>
              {categories.map(category => (
                <button key={category} className={`px-5 py-2 rounded-full font-semibold transition-colors border ${selectedCategory === category ? 'bg-[#222831] text-[#DFD0B8] border-[#222831]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`} onClick={() => setSelectedCategory(category)}>{category}</button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="검색어를 입력하세요 (제품명, 설명, 태그)"
              className="border rounded-lg px-4 py-2 w-full md:w-72 shadow-sm"
            />
          </div>
          {/* 관리자용 버튼 */}
          {isLoggedIn && !isAdding && (
            <div className="flex gap-2 justify-end mb-8">
              <button
                onClick={() => {
                  setNewProduct(prev => ({
                    ...prev,
                    category: selectedCategory !== 'all' ? selectedCategory : ''
                  }));
                  setIsAdding(true);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors shadow"
              >
                <FiPlus /> 제품 추가
              </button>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#DFD0B8] text-[#222831] font-semibold hover:bg-[#222831] hover:text-[#DFD0B8] transition-colors shadow"
              >
                <FiTag /> 카테고리 관리
              </button>
            </div>
          )}
          {/* 제품 추가 폼 */}
          {isAdding && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/4 flex flex-col items-center">
                <label className="w-full flex flex-col items-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setNewProduct(prev => ({ ...prev, image: reader.result as string }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <Image
                    src={newProduct.image || '/images/products/MSI.png'}
                    alt="제품 이미지"
                    width={128}
                    height={128}
                    priority
                    className="object-cover rounded-xl border mb-2"
                  />
                  <span className="text-xs text-gray-500">이미지 변경</span>
                </label>
              </div>
              <div className="w-full md:w-3/4 flex flex-col gap-2">
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={e => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="제품명"
                  className="text-xl font-bold border rounded-lg p-2 mb-2"
                />
                <select
                  value={newProduct.category || ''}
                  onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="border rounded-lg p-2 mb-2"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="간단 설명"
                  className="border rounded-lg p-2 mb-2 h-16"
                />
                <textarea
                  value={newProduct.detail}
                  onChange={e => setNewProduct(prev => ({ ...prev, detail: e.target.value }))}
                  placeholder="상세 설명"
                  className="border rounded-lg p-2 mb-2 h-24"
                />
                <p className="text-sm text-gray-500 mb-2">상세 설명은 하단 상세 설명 영역에 본문으로 출력됩니다.</p>
                {/* 태그 입력: 엔터로 추가, 뱃지 UI */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newProduct.tags && newProduct.tags.map((tag, i) => (
                      <span key={i} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                        {tag}
                        <button type="button" className="ml-1 text-gray-400 hover:text-red-500" onClick={() => setNewProduct(prev => ({ ...prev, tags: prev.tags?.filter((_, idx) => idx !== i) }))}><FiX size={14} /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault();
                        if (!newProduct.tags?.includes(tagInput.trim())) {
                          setNewProduct(prev => ({
                            ...prev,
                            tags: [...(prev.tags || []), tagInput.trim()]
                          }))
                        }
                        setTagInput('')
                      }
                    }}
                    placeholder="엔터로 태그 추가"
                    className="border rounded-lg p-2 mb-2"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-lg border border-[#222831] text-[#222831] font-semibold hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredProducts.length === 0 ? (
              <div className="col-span-3 py-16 text-center">
                <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">해당 카테고리에 제품이 없습니다</h3>
                  <p className="text-gray-500 mb-4">다른 카테고리를 선택하거나 제품을 추가해보세요.</p>
                  {isLoggedIn && (
                    <button onClick={() => { setIsAdding(true); setNewProduct(prev => ({ ...prev, category: selectedCategory })); }} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors">
                      <FiPlus /> 이 카테고리에 제품 추가
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <Link 
                  href={`/products/${product.id}`}
                  key={product.id}
                >
                  <div 
                    className="bg-white shadow hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer"
                    style={{ width: 390, height: 390, minWidth: 390, minHeight: 390, maxWidth: 390, maxHeight: 390, borderRadius: 0 }}
                  >
                    <div 
                      className="bg-gray-100 overflow-hidden"
                      style={{ width: 390, height: 290 }}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover"
                          style={{ width: 390, height: 290, display: 'block' }}
                        />
                      )}
                      {/* 삭제 버튼: 관리자만 노출 */}
                      {isLoggedIn && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (window.confirm('정말 삭제하시겠습니까?')) deleteProduct(product.id)
                          }}
                          className="absolute top-3 right-3 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-2 shadow transition-opacity opacity-100 hover:scale-110"
                          title="삭제"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1" style={{height: 100, minHeight: 100, maxHeight: 100}}>
                      <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 flex-1 overflow-hidden">{product.description || '제품소개 준비중입니다.'}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        {product.category && (
                          <span>{product.category}</span>
                        )}
                        <span className="text-blue-500 hover:underline">상세 보기</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  )
} 