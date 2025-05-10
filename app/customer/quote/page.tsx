"use client"
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FiHome } from 'react-icons/fi'
import { useSiteContent } from '../../context/SiteContentContext'
import CustomerCenterHeader from '../../components/CustomerCenterHeader'

export default function QuotePage() {
  const { siteContent } = useSiteContent()
  const adminEmail = siteContent?.siteInfo?.email || 'info@company.com'
  
  // 폼 상태 관리
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    requestType: '분류 선택',
    searchText: '',
    content: '',
    agreePrivacy: false,
    date: ''
  })
  
  // 캡챠 관련 상태
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const captchaCanvasRef = useRef<HTMLCanvasElement>(null)
  
  // 서비스 타입 체크박스
  const [serviceTypes, setServiceTypes] = useState({
    service1: false,
    service2: false,
    service3: false,
    service4: false
  })
  
  // 기타 상태
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const [privacyError, setPrivacyError] = useState('')
  
  // 폼 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // 유효성 검사 에러 초기화
    if (name === 'name') setNameError('')
    if (name === 'phone') setPhoneError('')
  }
  
  // 체크박스 핸들러
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    
    if (name === 'agreePrivacy') {
      setForm({ ...form, agreePrivacy: checked })
      setPrivacyError('')
    } else {
      setServiceTypes({
        ...serviceTypes,
        [name]: checked
      })
    }
  }
  
  // 캡챠 생성 함수
  const generateCaptcha = () => {
    const canvas = captchaCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 5자리 랜덤 코드 생성
    const code = Math.random().toString(36).substring(2, 7).toUpperCase()
    setCaptchaCode(code)
    
    // 코드 그리기
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 각 문자를 약간 회전하여 그리기
    for (let i = 0; i < code.length; i++) {
      const x = 20 + i * 25
      const y = canvas.height / 2 + Math.random() * 10 - 5
      const rotation = Math.random() * 0.4 - 0.2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.fillText(code[i], 0, 0)
      ctx.restore()
    }
    
    // 방해선 추가
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.strokeStyle = '#777'
      ctx.stroke()
    }
  }
  
  // 컴포넌트 마운트 시 캡챠 생성
  useEffect(() => {
    generateCaptcha()
  }, [])
  
  // 날짜 변경 핸들러
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, date: e.target.value })
  }
  
  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 필수 필드 검증
    let isValid = true
    
    if (!form.name.trim()) {
      setNameError('이름을 입력해주세요')
      isValid = false
    }
    
    if (!form.phone.trim()) {
      setPhoneError('연락처를 입력해주세요')
      isValid = false
    }
    
    if (captchaInput.toUpperCase() !== captchaCode) {
      setCaptchaError('자동등록방지 코드가 일치하지 않습니다')
      isValid = false
    }
    
    if (!form.agreePrivacy) {
      setPrivacyError('개인정보 수집에 동의해주세요')
      isValid = false
    }
    
    if (!isValid) return
    
    // 서비스 타입 문자열 생성
    const selectedServices = Object.entries(serviceTypes)
      .filter(([_, checked]) => checked)
      .map(([key]) => {
        if (key === 'service1') return '컨설팅'
        if (key === 'service2') return '시스템 구축'
        if (key === 'service3') return '솔루션'
        if (key === 'service4') return '기타'
        return key
      })
      .join(', ')
    
    setSending(true)
    setSuccess('')
    setError('')
    
    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          services: selectedServices,
          to: adminEmail
        })
      })
      
      if (res.ok) {
        setSuccess('견적 요청이 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.')
        setForm({
          name: '',
          company: '',
          phone: '',
          email: '',
          requestType: '분류 선택',
          searchText: '',
          content: '',
          agreePrivacy: false,
          date: ''
        })
        setServiceTypes({
          service1: false,
          service2: false,
          service3: false,
          service4: false
        })
        setCaptchaInput('')
        generateCaptcha()
      } else {
        setError('견적 요청 접수에 실패했습니다. 다시 시도해 주세요.')
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setSending(false)
    }
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerCenterHeader activeTab="quote" />
      {/* 견적요청 폼 */}
      <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1100px' }}>
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-center text-2xl font-bold mb-2">온라인 견적요청</h2>
          <p className="text-center text-gray-500 mb-8">제품 견적이 필요하신가요? 견적 내용을 간단하게 입력하시면 빠른 답변 드리겠습니다.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold mb-4">고객정보</h3>
              <div className="space-y-6">
                {/* 이름 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label htmlFor="name" className="text-base font-semibold text-gray-800">이름</label>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="이름을 입력해 주세요"
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-gray-900 bg-gray-50 placeholder-gray-400"
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                  </div>
                </div>
                {/* 연락처 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label htmlFor="phone" className="text-base font-semibold text-gray-800">연락처</label>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(+82) 00-0000-0000"
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-gray-900 bg-gray-50 placeholder-gray-400"
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                  </div>
                </div>
                {/* 회사명 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label htmlFor="company" className="text-base font-semibold text-gray-800">회사명</label>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="회사명을 입력해 주세요"
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-gray-900 bg-gray-50 placeholder-gray-400"
                    />
                  </div>
                </div>
                {/* 이메일 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label htmlFor="email" className="text-base font-semibold text-gray-800">이메일</label>
                  <div className="md:col-span-3">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-gray-900 bg-gray-50 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-4">문의사항</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-base font-semibold text-gray-800">서비스 종류</label>
                <div className="md:col-span-3 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input type="checkbox" name="service1" checked={serviceTypes.service1} onChange={handleCheckboxChange} className="w-4 h-4 accent-blue-600" />
                    <span>컨설팅</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input type="checkbox" name="service2" checked={serviceTypes.service2} onChange={handleCheckboxChange} className="w-4 h-4 accent-blue-600" />
                    <span>시스템 구축</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input type="checkbox" name="service3" checked={serviceTypes.service3} onChange={handleCheckboxChange} className="w-4 h-4 accent-blue-600" />
                    <span>솔루션</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input type="checkbox" name="service4" checked={serviceTypes.service4} onChange={handleCheckboxChange} className="w-4 h-4 accent-blue-600" />
                    <span>기타</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-4">예상 설치 날짜</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="date" className="text-base font-semibold text-gray-800">납품기한 예정일</label>
                <div className="md:col-span-3">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-gray-900 bg-gray-50"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-4">내용</h3>
              
              <div>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="내용을 입력해 주세요"
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-gray-900 bg-gray-50 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-4">첨부파일</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label htmlFor="file" className="text-base font-semibold text-gray-800">파일첨부</label>
                <div className="md:col-span-3">
                  <input
                    type="file"
                    id="file"
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 bg-gray-50"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-4">자동등록방지</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-base font-semibold text-gray-800">보안문자</label>
                <div className="md:col-span-3 flex flex-col md:flex-row gap-4 items-center">
                  <div>
                    <canvas
                      ref={captchaCanvasRef}
                      width="150"
                      height="50"
                      className="border-2 border-gray-400 rounded-lg bg-gray-50 cursor-pointer"
                      onClick={generateCaptcha}
                    ></canvas>
                  </div>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value)
                      setCaptchaError('')
                    }}
                    placeholder="보안문자를 입력하세요"
                    className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-gray-900 bg-gray-50 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    새로고침
                  </button>
                </div>
              </div>
              {captchaError && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  <div></div>
                  <div className="md:col-span-3">
                    <p className="text-red-500 text-sm">{captchaError}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* 개인정보 수집 동의 */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">개인정보 수집에 대한 안내</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    개인정보 수집에 대한 내용을 알려드립니다. 수집된 정보는 서비스 제공 및 고객 문의 응대를 위해서만 사용됩니다.
                    이용자의 개인정보는 관계법령에 따라 안전하게 관리됩니다.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    name="agreePrivacy"
                    checked={form.agreePrivacy}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 mr-2 accent-blue-600"
                  />
                  <label htmlFor="agreePrivacy" className="text-base font-medium text-gray-700">
                    개인정보 수집 및 이용에 동의합니다.
                  </label>
                </div>
                {privacyError && <p className="text-red-500 text-sm mt-1">{privacyError}</p>}
              </div>
            </div>
            
            {/* 버튼 영역 */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                type="submit"
                disabled={sending}
                className="px-8 py-3 bg-blue-700 text-white rounded-lg font-bold shadow-md hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? '전송 중...' : '등록하기'}
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
          
          {success && (
            <div className="mt-6 p-4 bg-green-50 text-green-700 rounded text-center">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 