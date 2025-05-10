"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiHome, FiChevronRight, FiShare2, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import { siteContent } from '../../../data/siteContent'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

// YouTube URL을 임베드 URL로 변환하는 함수
function getYoutubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // 이미 임베드 URL 형식인 경우
  if (url.includes('youtube.com/embed/')) {
    // 매개변수 추가
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}rel=0&modestbranding=1&showinfo=0`;
  }
  
  // youtube.com/watch?v=VIDEO_ID 형식
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match && match[1]) {
    // 관련 영상을 표시하지 않는 매개변수 추가
    return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0`;
  }
  
  // 그 외 다른 형식이거나 잘못된 URL
  return url;
}

interface Project {
  id: string;
  title: string;
  period: string;
  role: string;
  overview: string;
  details: string[] | string;
  client: string;
  image: string;
  category: string;
  gallery?: any[];
  size?: string;
  description: string;
  youtubeLink?: string;
}

export default function PortfolioDetail({ params }: { params: { id: string } }) {
  const [portfolio, setPortfolio] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // 편집 상태를 위한 임시 데이터
  const [editedContent, setEditedContent] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [saveMessage, setSaveMessage] = useState('')

  // 이미지 리사이징 및 최적화 함수
  const resizeAndOptimizeImage = async (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<string> => {
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
  };

  // 로그인 상태 확인
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  // 포트폴리오 데이터 불러오기
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true)
        console.log('Fetching portfolio with ID:', params.id)
        
        const res = await fetch(`/api/portfolio/${params.id}`)
        const data = await res.json() // 항상 응답 본문을 읽습니다
        
        if (!res.ok) {
          console.error('Error response:', data)
          throw new Error(data.error || `포트폴리오를 찾을 수 없습니다 (상태: ${res.status})`)
        }
        
        console.log('Portfolio data received:', data)
        const description = typeof data.details === 'string' 
          ? data.details 
          : JSON.stringify(data.details)
        setPortfolio({
          ...data,
          description
        })
        setEditedContent(description)
      } catch (err: any) {
        console.error('포트폴리오 데이터 가져오기 오류:', err)
        setError(err.message || '포트폴리오 데이터를 불러오는 중 오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPortfolio()
  }, [params.id])

  // 저장 함수
  const handleSave = async () => {
    if (!portfolio) return;
    
    setIsSaving(true)
    setSaveMessage('저장 중...')
    try {
      // 이미지가 변경되었으면 최적화
      let updatedImage = portfolio.image;
      if (newImage) {
        updatedImage = await resizeAndOptimizeImage(newImage);
      }
      
      const updatedPortfolio = {
        ...portfolio,
        image: updatedImage,
        description: editedContent,
        youtubeLink: portfolio.youtubeLink ? getYoutubeEmbedUrl(portfolio.youtubeLink) : undefined
      };
      
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPortfolio)
      });
      
      if (response.ok) {
        try {
          // 응답이 JSON인지 확인
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            await response.json(); // 응답 본문이 있으면 파싱
          }
          
          setPortfolio(updatedPortfolio);
          setIsEditing(false);
          setNewImage(null);
          setSaveMessage('저장되었습니다!')
        } catch (jsonError) {
          console.error('JSON 파싱 오류:', jsonError);
          // JSON 파싱 오류가 발생해도 저장은 성공했으므로 UI 업데이트
          setPortfolio(updatedPortfolio);
          setIsEditing(false);
          setNewImage(null);
          setSaveMessage('저장되었습니다!')
        }
      } else {
        let errorMessage = '저장 중 오류가 발생했습니다.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // JSON 파싱 실패 시 기본 오류 메시지 사용
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('저장 오류:', error);
      setSaveMessage('오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  };
  
  // 취소 함수
  const handleCancel = () => {
    setIsEditing(false);
    setNewImage(null);
  };
  
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }
  
  if (error || !portfolio) {
    return (
      <div className="min-h-[400px] flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || '포트폴리오를 찾을 수 없습니다'}
          </h1>
          <div className="mt-4">
            <Link href="/portfolio" className="text-blue-600 hover:text-blue-800 underline">
              포트폴리오 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 갤러리 이미지 목록 (메인 이미지 + 갤러리 이미지)
  const portfolioToShow = isEditing ? portfolio : portfolio;
  const allImages = [
    portfolioToShow?.image,
    ...(portfolioToShow?.gallery?.map((item: any) => typeof item === 'string' ? item : item.image) || [])
  ].filter(Boolean)
  
  if (allImages.length === 0) {
    allImages.push('/images/default-portfolio.jpg') // 기본 이미지 추가
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-24" style={{ maxWidth: '1200px' }}>
      {/* 상단 네비게이션 */}
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link href="/" className="flex items-center">
          <FiHome className="mr-1" /> 홈
        </Link>
        <FiChevronRight className="mx-2" />
        <Link href="/portfolio" className="hover:text-gray-700">
          제품소개
        </Link>
        <FiChevronRight className="mx-2" />
        <span className="text-gray-700">갤러리형</span>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-12">
        {isEditing ? (
          <input
            type="text"
            value={portfolioToShow?.title || ''}
            onChange={(e) => setPortfolio({...portfolioToShow!, title: e.target.value})}
            className="w-full text-center border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
          />
        ) : (
          portfolio.title
        )}
      </h1>
      
      <p className="text-center text-gray-500 mb-12">
        {isEditing ? (
          <textarea
            value={portfolioToShow?.overview || ''}
            onChange={(e) => setPortfolio({...portfolioToShow!, overview: e.target.value})}
            className="w-full text-center border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
            rows={2}
          />
        ) : (
          "보다 발전된 기술과 보다 완고한 제품을 생산합니다."
        )}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* 왼쪽: 이미지 영역 */}
        <div className="md:col-span-7 space-y-4">
          {/* 메인 이미지 */}
          <div className="relative bg-gray-100 rounded-md overflow-hidden" style={{height: '500px'}}>
            {isEditing ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={allImages[selectedThumbnail] || '/images/default-portfolio.jpg'}
                  alt={portfolioToShow?.title || ''}
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized={allImages[selectedThumbnail]?.startsWith('data:')}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                  <label className="bg-white text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-100 cursor-pointer">
                    이미지 변경
                    <input
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewImage(e.target.files[0]);
                          const newUrl = URL.createObjectURL(e.target.files[0]);
                          setPortfolio({...portfolioToShow!, image: newUrl});
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <Image
                src={allImages[selectedThumbnail]}
                alt={portfolio.title}
                fill
                style={{ objectFit: 'contain' }}
                priority
                unoptimized={allImages[selectedThumbnail]?.startsWith('data:')}
              />
            )}
          </div>
          
          {/* 썸네일 이미지 */}
          {allImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto py-2">
              {allImages.map((image, index) => (
                <div 
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedThumbnail === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedThumbnail(index)}
                >
                  <Image
                    src={image}
                    alt={`${portfolioToShow?.title} 썸네일 ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={image?.startsWith('data:')}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 오른쪽: 상세 정보 */}
        <div className="md:col-span-5">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 pb-2 border-b border-gray-200">
              설치사래 안내
            </h2>
            
            <table className="w-full my-4">
              <tbody>
                <tr className="border-b border-gray-100">
                  <th className="py-2 px-2 text-left text-gray-600 w-1/4">프로젝트명</th>
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={portfolioToShow?.client || ''}
                        onChange={(e) => setPortfolio({...portfolioToShow!, client: e.target.value})}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="-"
                      />
                    ) : (
                      portfolio.client || '-'
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-2 px-2 text-left text-gray-600">설치장소</th>
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={portfolioToShow?.size || 'Desktop 1200 - Mobile 360'}
                        onChange={(e) => setPortfolio({...portfolioToShow!, size: e.target.value})}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="Desktop 1200 - Mobile 360"
                      />
                    ) : (
                      portfolio.size || 'Desktop 1200 - Mobile 360'
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-2 px-2 text-left text-gray-600">용도</th>
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={portfolioToShow?.category || ''}
                        onChange={(e) => setPortfolio({...portfolioToShow!, category: e.target.value})}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="기업형 디자인"
                      />
                    ) : (
                      portfolio.category || '기업형 디자인'
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-2 px-2 text-left text-gray-600">특징</th>
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={portfolioToShow?.role || ''}
                        onChange={(e) => setPortfolio({...portfolioToShow!, role: e.target.value})}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="반응형+모던 스타일"
                      />
                    ) : (
                      portfolio.role || '반응형+모던 스타일'
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <h3 className="text-xl font-bold mt-8 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={portfolioToShow?.title || ''}
                  onChange={(e) => setPortfolio({...portfolioToShow!, title: e.target.value})}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                />
              ) : (
                portfolio.title
              )}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {isEditing ? (
                <textarea
                  value={portfolioToShow?.overview || ''}
                  onChange={(e) => setPortfolio({...portfolioToShow!, overview: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              ) : (
                portfolio.overview
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* YouTube 비디오 섹션 */}
      {(portfolioToShow?.youtubeLink || isEditing) && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">프로젝트 소개 영상</h2>
          
          {isEditing ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube 영상 URL
              </label>
              <input
                type="text"
                value={portfolioToShow?.youtubeLink || ''}
                onChange={(e) => setPortfolio({...portfolioToShow!, youtubeLink: e.target.value})}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                YouTube 영상 URL을 직접 붙여넣으세요. (예: https://www.youtube.com/watch?v=abcd1234)
              </p>
            </div>
          ) : (
            portfolioToShow?.youtubeLink && (
              <div className="mb-8">
                <iframe
                  src={getYoutubeEmbedUrl(portfolioToShow.youtubeLink)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  width="100%"
                  height="600"
                  className="rounded-lg"
                  style={{ aspectRatio: '16/9', maxHeight: '70vh' }}
                ></iframe>
              </div>
            )
          )}
        </div>
      )}
      
      {/* 상세 설명 */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">설치사래 정보안내</h2>
        {isEditing ? (
          <div className="space-y-4">
            <RichTextEditor
              value={editedContent}
              onChange={setEditedContent}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            {typeof portfolio.description === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: portfolio.description }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: portfolio.description }} />
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-right">
        <Link href="/portfolio" className="inline-block bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200">
          목록
        </Link>
      </div>

      {/* 편집 버튼 */}
      {isLoggedIn && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="편집"
        >
          <FiEdit2 size={24} />
        </button>
      )}

      {/* 저장/취소 버튼 */}
      {isEditing && (
        <div className="fixed bottom-8 right-8 flex gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white rounded-full p-4 shadow-lg hover:bg-gray-600 transition-colors"
            aria-label="취소"
            disabled={isSaving}
          >
            <FiX size={24} />
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-colors"
            aria-label="저장"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSave size={24} />
            )}
          </button>
        </div>
      )}

      {saveMessage && (
        <div className="fixed bottom-8 right-8 p-4 bg-green-100 text-green-700 rounded-lg">{saveMessage}</div>
      )}
    </div>
  )
} 