"use client"
import { useState } from 'react'

export default function SmtpPage() {
  const [smtp, setSmtp] = useState({ host: '', port: '', user: '', pass: '' })
  const [saveMessage, setSaveMessage] = useState('')

  const handleChange = (field: string, value: string) => {
    setSmtp(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveMessage('저장 중...')
    // 실제 저장 로직은 별도 구현 필요
    setTimeout(() => setSaveMessage('저장되었습니다!'), 1000)
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-8">SMTP 정보</h1>
      <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded">
        <div className="font-semibold mb-2">네이버 SMTP 기본값 안내</div>
        <div>호스트: <b>smtp.naver.com</b></div>
        <div>포트: <b>465</b> (SSL)</div>
        <div>사용자(이메일): <b>yourid@naver.com</b></div>
        <div>비밀번호: <b>네이버 비밀번호</b> (2단계 인증 시 앱 비밀번호 사용)</div>
      </div>
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 호스트</label>
          <input type="text" value={smtp.host} onChange={e => handleChange('host', e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="smtp.naver.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 포트</label>
          <input type="number" value={smtp.port} onChange={e => handleChange('port', e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="465" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 사용자(이메일)</label>
          <input type="text" value={smtp.user} onChange={e => handleChange('user', e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="yourid@naver.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 비밀번호</label>
          <input type="password" value={smtp.pass} onChange={e => handleChange('pass', e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="네이버 비밀번호 또는 앱 비밀번호" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">저장하기</button>
        {saveMessage && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">{saveMessage}</div>}
      </form>
    </div>
  )
} 