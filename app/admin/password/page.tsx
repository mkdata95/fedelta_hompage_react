"use client"

import { useState } from 'react'

export default function AdminPasswordPage() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPw2, setNewPw2] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  // 쿠키에서 admin_pw 값 읽기 함수 추가
  function getAdminPwFromCookie() {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const found = cookies.find(c => c.startsWith('admin_pw='));
    return found ? found.split('=')[1] : 'password';
  }

  // 비밀번호 변경 핸들러 (예시: 기존 비밀번호는 'password'로 하드코딩)
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg('')
    setPwSuccess(false)
    if (currentPw !== getAdminPwFromCookie()) {
      setPwMsg('현재 비밀번호가 올바르지 않습니다.')
      return
    }
    if (!newPw || newPw.length < 4) {
      setPwMsg('새 비밀번호는 4자 이상이어야 합니다.')
      return
    }
    if (newPw !== newPw2) {
      setPwMsg('새 비밀번호가 일치하지 않습니다.')
      return
    }
    // 실제로는 서버에 저장해야 하지만, 예시로 쿠키에 저장
    document.cookie = `admin_pw=${newPw}; path=/;`
    setPwMsg('비밀번호가 성공적으로 변경되었습니다.')
    setPwSuccess(true)
    setCurrentPw('')
    setNewPw('')
    setNewPw2('')
  }

  return (
    <div className="max-w-xl mx-auto py-16">
      <div className="p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">관리자 비밀번호 변경</h1>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">현재 비밀번호</label>
            <input 
              type="password" 
              value={currentPw} 
              onChange={e => setCurrentPw(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg bg-white" 
              placeholder="현재 비밀번호를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
            <input 
              type="password" 
              value={newPw} 
              onChange={e => setNewPw(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg bg-white" 
              placeholder="새 비밀번호를 입력하세요 (4자 이상)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
            <input 
              type="password" 
              value={newPw2} 
              onChange={e => setNewPw2(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg bg-white" 
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </div>
          {pwMsg && (
            <div className={`p-3 rounded-lg ${pwSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {pwMsg}
            </div>
          )}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  )
} 