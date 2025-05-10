"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
}

export default function NoticeEditPage() {
  const { id } = useParams<{ id: string }>()
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
        return
      }
    }

    // 기존 공지사항 데이터 로드
    fetch(`/api/notice/${id}`)
      .then(res => res.json())
      .then((data: Notice) => {
        setTitle(data.title)
        setContent(data.content)
        setAuthor(data.author)
      })
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch(`/api/notice/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    setLoading(false)
    router.push('/customer/notice')
  }

  return (
    <div className="container mx-auto py-24 px-4" style={{ maxWidth: '1100px' }}>
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">공지사항 수정</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border px-3 py-2 rounded min-h-[120px]"
            placeholder="내용"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="작성자"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            disabled
          />
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => router.push('/customer/notice')}>취소</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>{loading ? '수정중...' : '수정'}</button>
          </div>
        </form>
      </div>
    </div>
  )
} 