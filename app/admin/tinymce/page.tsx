'use client'

import { useState, useEffect } from 'react'

export default function TinyMceSettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 저장된 API 키 불러오기
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/tinymce-settings')
        if (response.ok) {
          const data = await response.json()
          setApiKey(data.apiKey || '')
        }
      } catch (error) {
        console.error('API 키 불러오기 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiKey()
  }, [])

  // API 키 저장
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/tinymce-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      })

      if (response.ok) {
        setSaveMessage('API 키가 성공적으로 저장되었습니다.')
      } else {
        setSaveMessage('API 키 저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('API 키 저장 오류:', error)
      setSaveMessage('API 키 저장 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-16">
      <div className="p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">TinyMCE 설정</h1>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            TinyMCE 에디터를 사용하려면 API 키가 필요합니다. 
            <a 
              href="https://www.tiny.cloud/auth/signup/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-600 hover:underline ml-1"
            >
              TinyMCE 웹사이트에서 무료로 API 키를 받을 수 있습니다.
            </a>
          </p>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mb-6">
            <h3 className="font-bold mb-1">중요 안내</h3>
            <p>
              API 키를 저장하면 모든 에디터에 자동으로 적용됩니다. 
              저장 후 페이지를 새로고침하여 변경사항을 적용하세요.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TinyMCE API 키
            </label>
            <input 
              type="text" 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg bg-white" 
              placeholder="여기에 API 키를 입력하세요"
              disabled={isLoading}
            />
          </div>

          {saveMessage && (
            <div className="p-3 rounded-lg bg-green-100 text-green-700">
              {saveMessage}
            </div>
          )}

          <div className="flex justify-end">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 