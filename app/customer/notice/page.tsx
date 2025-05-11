"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'

interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/notice')
      .then(res => res.json())
      .then(data => setNotices(data))
    // 관리자 여부 확인 - 쿠키 기반으로 변경
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const found = cookies.find(c => c.startsWith('admin_auth='))
      setIsAdmin(Boolean(found && found.split('=')[1] === '1'))
    }
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="고객센터" pageKey="customer" />
      {/* 탭 메뉴 */}
      <div className="bg-white border-b">
        <div className="flex justify-center gap-8 py-4">
          <Link href="/customer/notice" className="font-bold border-b-2 border-black text-black px-4 transition-colors text-lg">공지사항</Link>
          <Link href="/customer/quote" className="text-gray-500 hover:text-black px-4 transition-colors text-lg">견적요청</Link>
          <Link href="/contact" className="text-gray-500 hover:text-black px-4 transition-colors text-lg">문의하기</Link>
          <Link href="/location" className="text-gray-500 hover:text-black px-4 transition-colors text-lg">오시는길</Link>
        </div>
      </div>
      {/* 공지사항 리스트 */}
      <div className="container mx-auto py-8 px-2" style={{ maxWidth: '1100px' }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <div>전체 <span className="text-blue-600 font-bold">{notices.length}</span>건</div>
          {isAdmin && (
            <Link href="/customer/notice/write" className="bg-blue-600 text-white px-4 py-2 rounded font-bold">글쓰기</Link>
          )}
        </div>
        <div className="overflow-x-auto bg-white rounded-none shadow border border-gray-300">
          <table className="w-full text-center text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 font-bold text-gray-900 border-r border-gray-200">번호</th>
                <th className="p-3 font-bold text-gray-900 border-r border-gray-200">제목</th>
                <th className="p-3 font-bold text-gray-900 border-r border-gray-200">작성자</th>
                <th className="p-3 font-bold text-gray-900 border-r border-gray-200">조회</th>
                <th className="p-3 font-bold text-gray-900 border-r border-gray-200">날짜</th>
                {isAdmin && (
                  <th className="p-3 font-bold text-gray-900">관리</th>
                )}
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, idx) => (
                <tr key={notice.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                  <td className="p-2 font-medium text-gray-800 border-r border-gray-100">{notice.id}</td>
                  <td className="p-2 text-left text-blue-700 font-semibold underline cursor-pointer border-r border-gray-100">
                    <Link href={`/customer/notice/${notice.id}`}>{notice.title}</Link>
                  </td>
                  <td className="p-2 text-gray-700 border-r border-gray-100">{notice.author}</td>
                  <td className="p-2 text-gray-700 border-r border-gray-100">{notice.views}</td>
                  <td className="p-2 text-gray-700 border-r border-gray-100">{notice.date?.slice(0, 10)}</td>
                  {isAdmin && (
                    <td className="p-2 flex gap-2 justify-center">
                      <Link href={`/customer/notice/edit/${notice.id}`} className="text-xs text-white bg-gray-800 rounded-none font-bold px-3 py-1 hover:bg-black transition">수정</Link>
                      <button
                        className="text-xs text-white bg-red-600 rounded-none font-bold px-3 py-1 hover:bg-red-700 transition"
                        onClick={async () => {
                          if (confirm('정말 삭제하시겠습니까?')) {
                            await fetch(`/api/notice/${notice.id}`, { method: 'DELETE' })
                            setNotices(notices.filter(n => n.id !== notice.id))
                          }
                        }}
                      >삭제</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 