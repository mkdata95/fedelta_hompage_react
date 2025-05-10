"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import CustomerCenterHeader from '../../../components/CustomerCenterHeader'

interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
}

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/notice/${id}`)
      .then(res => res.json())
      .then(data => {
        setNotice(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="p-8 text-center">로딩중...</div>
  if (!notice) return <div className="p-8 text-center">존재하지 않는 게시글입니다.</div>

  return (
    <div className="bg-gray-50 min-h-screen py-0">
      <CustomerCenterHeader activeTab="notice" />
      {/* 카드형 본문 */}
      <div className="mx-auto mt-10 mb-16" style={{ maxWidth: '1100px' }}>
        <div className="bg-white rounded-xl shadow p-0 border">
          {/* 제목 영역 */}
          <div className="flex items-center gap-3 px-8 py-6 border-b bg-gray-50">
            <span className="inline-block bg-gray-300 text-gray-700 text-xs font-bold px-3 py-1 rounded mr-2">공지</span>
            <h2 className="text-2xl font-bold text-gray-900 truncate">{notice.title}</h2>
          </div>
          {/* 작성자/조회수/날짜/프로필 */}
          <div className="flex items-center gap-6 px-8 py-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <svg width="32" height="32" fill="#bbb"><circle cx="16" cy="16" r="16" /></svg>
              </div>
              <div>
                <div className="font-bold text-gray-800">{notice.author}</div>
                <div className="text-xs text-gray-500">댓글 0건</div>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Hit <span className="font-semibold text-gray-700">{notice.views.toLocaleString()}</span>회</span>
              <span>Date <span className="font-semibold text-gray-700">{notice.date?.slice(2, 10).replace(/-/g, '-')}</span></span>
            </div>
          </div>
          {/* 본문 내용 */}
          <div className="px-8 py-16 text-lg text-gray-800 min-h-[200px] whitespace-pre-line leading-relaxed">
            {notice.content}
          </div>
        </div>
        {/* 하단 버튼 */}
        <div className="flex gap-2 justify-end mt-8">
          <Link href="/customer/notice" className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">목록</Link>
          <Link href={`/customer/notice/edit/${notice.id}`} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">수정</Link>
          <button
            className="px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            onClick={async () => {
              if (confirm('정말 삭제하시겠습니까?')) {
                await fetch(`/api/notice/${notice.id}`, { method: 'DELETE' })
                router.push('/customer/notice')
              }
            }}
          >삭제</button>
        </div>
      </div>
    </div>
  )
} 