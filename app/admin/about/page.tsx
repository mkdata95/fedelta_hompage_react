'use client'

import { useState, useEffect } from 'react'
import RichTextEditor from '@/components/RichTextEditor'

interface TimelineItem {
  year: string;
  event: string;
}

export default function AboutAdminPage() {
  const [content, setContent] = useState('')
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    // 초기 데이터 로드
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setContent(data.content)
        setTimeline(data.timeline)
      })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('저장 중...')
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, timeline }),
      })
      if (response.ok) {
        setSaveMessage('저장되었습니다!')
      } else {
        setSaveMessage('저장에 실패했습니다.')
      }
    } catch {
      setSaveMessage('오류가 발생했습니다.')
    }
    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleTimelineChange = (index: number, field: keyof TimelineItem, value: string) => {
    const newTimeline = [...timeline]
    newTimeline[index] = { ...newTimeline[index], [field]: value }
    setTimeline(newTimeline)
  }

  const addTimelineItem = () => {
    setTimeline([...timeline, { year: '', event: '' }])
  }

  const removeTimelineItem = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index))
  }

  return (
    <main className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">회사 소개 관리</h1>
          {saveMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">{saveMessage}</div>
          )}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">회사 소개 내용</h2>
            <RichTextEditor
              value={content}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">연혁</h2>
              <button
                onClick={addTimelineItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                연혁 추가
              </button>
            </div>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => handleTimelineChange(index, 'year', e.target.value)}
                    placeholder="연도"
                    className="w-32 px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={item.event}
                    onChange={(e) => handleTimelineChange(index, 'event', e.target.value)}
                    placeholder="내용"
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => removeTimelineItem(index)}
                    className="px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 