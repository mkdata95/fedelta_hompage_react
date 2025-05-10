"use client"

import React, { useState, useEffect } from 'react'
import { useProducts } from '../../context/ProductContext'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

export default function ProductDetailPage() {
  const params = useParams()
  const { products, updateProduct } = useProducts()
  const [isEditing, setIsEditing] = useState(false)
  const [editedImages, setEditedImages] = useState<string[]>([])
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDesc, setEditedDesc] = useState('')
  const [editedTags, setEditedTags] = useState('')
  const [editedDetail, setEditedDetail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [editedBrand, setEditedBrand] = useState('')
  const [editedSize, setEditedSize] = useState('')
  const [editedSummary, setEditedSummary] = useState('')
  const [editedFeatures, setEditedFeatures] = useState('')
  const [mainImageIdx, setMainImageIdx] = useState(0)
  const [editedGalleryTitle, setEditedGalleryTitle] = useState('갤러리형')
  const [editedGallerySubtitle, setEditedGallerySubtitle] = useState('보다 발전된 기술로 보다 정교한 제품을 생산합니다.')

  // params.id가 배열인 경우 첫 번째 요소를 사용
  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  const product = products.find(p => p.id === productId)

  useEffect(() => {
    // 로그인 상태 확인
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  useEffect(() => {
    if (product) {
      setEditedImages(product.images || (product.image ? [product.image] : []))
      setMainImageIdx(0)
      setEditedTitle(product.title || '')
      setEditedDesc(product.description || '')
      setEditedTags(product.tags ? product.tags.join(', ') : '')
      setEditedDetail(product.detail || '')
      setEditedBrand(product.brand || 'DAONTHEME')
      setEditedSize(product.size || 'Desktop 1200 ~ Mobile 360')
      setEditedSummary(product.summary || '간단설명을 입력하세요')
      setEditedFeatures(product.features || '주요특징을 입력하세요')
      setEditedGalleryTitle(product.galleryTitle || '갤러리형')
      setEditedGallerySubtitle(product.gallerySubtitle || '보다 발전된 기술로 보다 정교한 제품을 생산합니다.')
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">제품을 찾을 수 없습니다</h1>
          <p className="text-gray-600">요청하신 제품 ID: {productId}</p>
          <p className="text-gray-600 mt-2">사용 가능한 제품 ID: {products.map(p => p.id).join(', ')}</p>
          <div className="mt-4">
            <Link 
              href="/products" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              제품 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 저장 함수
  const handleSave = async () => {
    await updateProduct(product.id, {
      ...product,
      image: editedImages[0] || '',
      images: editedImages,
      title: editedTitle,
      description: editedDesc,
      tags: editedTags.split(',').map(t => t.trim()).filter(Boolean),
      detail: editedDetail,
      brand: editedBrand,
      size: editedSize,
      summary: editedSummary,
      features: editedFeatures,
      galleryTitle: editedGalleryTitle,
      gallerySubtitle: editedGallerySubtitle
    })
    setIsEditing(false)
  }

  // 이미지 업로드 핸들러
  const handleImageChangeMulti = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedImages(prev => prev.length < 5 ? [...prev, reader.result as string] : prev)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (idx: number) => {
    setEditedImages(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <main className="bg-[#fafafa] min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center" style={{ backgroundColor: '#181617', backgroundImage: 'url(/images/hero-default.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center w-full pt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">제품소개</h1>
        </div>
      </div>
      {/* 경로 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center text-gray-400 text-sm gap-2 py-4">
          <span>홈</span>
          <span className="mx-1">&gt;</span>
          <span>제품소개</span>
          <span className="mx-1">&gt;</span>
          <span className="text-[#B85C38] font-bold">갤러리형</span>
        </div>
      </div>
      {/* 갤러리형 대제목/부제목 (인라인 수정) */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        {isEditing ? (
          <>
            <input type="text" value={editedGalleryTitle} onChange={e => setEditedGalleryTitle(e.target.value)} className="text-3xl md:text-4xl font-extrabold mb-2 text-center w-full" />
            <input type="text" value={editedGallerySubtitle} onChange={e => setEditedGallerySubtitle(e.target.value)} className="text-lg text-gray-600 text-center w-full mt-2" />
          </>
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">{product.galleryTitle || '갤러리형'}</h2>
            <p className="text-lg text-gray-600">{product.gallerySubtitle || '보다 발전된 기술로 보다 정교한 제품을 생산합니다.'}</p>
          </>
        )}
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 items-start">
        {/* 좌측: 큰 이미지 + 썸네일 */}
        <div className="flex-1 flex flex-col items-center bg-white p-0 min-w-[400px] max-w-[700px]">
          <div className="w-full flex justify-center items-center min-h-[500px] bg-[#fafafa] border border-gray-200 mb-4">
            {isEditing ? (
              editedImages.length > 0 ? (
                <img src={editedImages[mainImageIdx] || editedImages[0]} alt="제품 이미지" className="object-contain max-h-[480px] w-auto h-auto" style={{ maxWidth: '100%' }} />
              ) : (
                <div className="text-gray-400 text-xl">이미지를 등록하세요</div>
              )
            ) : (
              <img src={(product.images && product.images[mainImageIdx]) || product.images?.[0] || product.image || '/images/products/MSI.png'} alt="제품 이미지" className="object-contain max-h-[480px] w-auto h-auto" style={{ maxWidth: '100%' }} />
            )}
            {isEditing && editedImages.length < 5 && (
              <label className="absolute bottom-4 right-4 bg-white border rounded-full p-2 shadow cursor-pointer hover:bg-gray-100">
                <FiPlus size={20} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChangeMulti} />
              </label>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            {(isEditing ? editedImages : (product.images || (product.image ? [product.image] : []))).map((img, idx) => (
              <div key={idx} className={`w-20 h-20 border border-gray-200 bg-white flex items-center justify-center overflow-hidden relative group cursor-pointer ${mainImageIdx === idx ? 'ring-2 ring-[#B85C38]' : ''}`} onClick={() => setMainImageIdx(idx)}>
                <img src={img} alt={`썸네일${idx+1}`} className="object-contain w-full h-full" />
                {isEditing && (
                  <button type="button" className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-500 hover:text-red-500" onClick={e => { e.stopPropagation(); handleRemoveImage(idx); }}><FiTrash2 size={16} /></button>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* 우측: 정보 테이블 (플랫, 카드/그림자/라운드 없음) */}
        <div className="flex-1 max-w-lg w-full">
          <div className="flex items-center border-b border-[#222] mb-4">
            <span className="bg-[#888] text-white text-xs font-bold px-4 py-2 mr-2">쇼핑몰</span>
            <div className="text-xl font-bold tracking-tight py-2 text-left w-full">{isEditing ? (
              <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="text-xl font-bold tracking-tight py-2 border-b border-[#B85C38] focus:outline-none w-full text-left" />
            ) : product.title}</div>
          </div>
          <table className="w-full text-left border-b border-gray-200 mb-6">
            <tbody className="text-base">
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 text-gray-600 font-semibold w-32">Brand</th>
                <td className="py-3 font-bold">{isEditing ? (<input type="text" value={editedBrand} onChange={e => setEditedBrand(e.target.value)} className="border rounded px-2 py-1 w-full" />) : (product.brand || 'DAONTHEME')}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 text-gray-600 font-semibold">Size</th>
                <td className="py-3">{isEditing ? (<input type="text" value={editedSize} onChange={e => setEditedSize(e.target.value)} className="border rounded px-2 py-1 w-full" />) : (product.size || 'Desktop 1200 ~ Mobile 360')}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 text-gray-600 font-semibold">간단설명</th>
                <td className="py-3">{isEditing ? (<input type="text" value={editedSummary} onChange={e => setEditedSummary(e.target.value)} className="border rounded px-2 py-1 w-full" />) : (product.summary || '간단설명을 입력하세요')}</td>
              </tr>
              <tr>
                <th className="py-3 pr-4 text-gray-600 font-semibold">주요특징</th>
                <td className="py-3">{isEditing ? (<input type="text" value={editedFeatures} onChange={e => setEditedFeatures(e.target.value)} className="border rounded px-2 py-1 w-full" />) : (product.features || '주요특징을 입력하세요')}</td>
              </tr>
            </tbody>
          </table>
          <Link href="/products" className="inline-block bg-black text-white font-bold rounded px-6 py-3 mt-2 hover:bg-[#B85C38] transition">목록으로</Link>
        </div>
      </div>
      {/* 상세 설명(Detail view) */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">Detail view</h2>
          {isEditing ? (
            <div className="space-y-4">
              <RichTextEditor value={editedDetail} onChange={setEditedDetail} />
            </div>
          ) : (
            <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: product.detail || '' }} />
          )}
        </div>
      </div>
      {/* 우측 하단 수정 아이콘 (관리자만) */}
      {isLoggedIn && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="수정하기"
        >
          <FiEdit2 size={24} />
        </button>
      )}
      {/* 저장/취소 버튼 (수정 모드일 때만) */}
      {isEditing && (
        <div className="fixed bottom-8 right-8 flex gap-2 z-50">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 rounded-full bg-gray-200 text-gray-800 font-bold shadow hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      )}
    </main>
  )
} 