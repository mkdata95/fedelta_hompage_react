"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NoticeWritePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 쿠키 기반으로 관리자 권한 확인
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const found = cookies.find(c => c.startsWith('admin_auth='))
      const isAdmin = Boolean(found && found.split('=')[1] === '1')
      if (!isAdmin) {
        alert('관리자만 접근 가능합니다.')
        router.replace('/')
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/notice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }),
    })
    setLoading(false)
    router.push('/customer/notice')
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-20" style={{ maxWidth: '1100px' }}>
      <div className="bg-white rounded-xl shadow-lg">
        {/* 헤더 */}
        <div className="border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-800">공지사항 글쓰기</h2>
        </div>
        
        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* 제목 입력 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* 내용 입력 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                style={{ height: '300px' }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y text-lg"
                placeholder="내용을 입력하세요"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>

            {/* 작성자 입력 */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                작성자 <span className="text-red-500">*</span>
              </label>
              <input
                id="author"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="작성자명을 입력하세요"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/customer/notice')}
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '등록중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 