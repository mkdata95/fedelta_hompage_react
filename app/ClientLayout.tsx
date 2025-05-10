"use client"
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode, useState, useEffect } from 'react'
import { FaUser } from 'react-icons/fa'
import Image from 'next/image'

// 불필요한 리렌더링 방지를 위해 메모이제이션된 푸터 컴포넌트
const Footer = dynamic(() => import('./components/Footer'), { 
  ssr: false,
  loading: () => <div className="h-32"></div> // 로딩 상태 표시
})

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showTopBar, setShowTopBar] = useState(true)
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false)

  useEffect(() => {
    // 쿠키에서 로그인 상태 확인
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))

    // 스크롤 감지하여 상단바 show/hide
    const onScroll = () => {
      setShowTopBar(window.scrollY < 50)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 쿠키에서 admin_pw 값 읽기 함수 추가
  function getAdminPwFromCookie() {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const found = cookies.find(c => c.startsWith('admin_pw='));
    return found ? found.split('=')[1] : 'password';
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // /admin/login과 동일하게 통일
    if (loginId === 'admin' && loginPw === 'admin123') {
      document.cookie = 'admin_auth=1; path=/; max-age=86400'
      setIsLoggedIn(true)
      setIsLoginModalOpen(false)
      setLoginError('')
      setLoginId('')
      setLoginPw('')
      window.location.reload()
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <>
      {!isAdmin && (
        <>
          {/* 상단바+메뉴바를 하나로 합침 */}
          <div className="w-full bg-black transition-all duration-300 fixed top-0 left-0 z-50 h-28 shadow flex items-center" style={{minHeight:'112px'}}>
            <div className="container mx-auto flex items-center justify-between px-8 h-full">
              {/* 좌측: 로고 */}
              <Link href="/" className="flex items-center text-2xl font-extrabold text-white tracking-widest min-w-[252px]">
                <Image src="/images/fedelta-logo-hologram.png" alt="FEDELTA 로고" width={252} height={112} style={{height:'112px', width:'auto'}} priority />
              </Link>
              {/* 중앙: 메뉴 */}
            <ul className="flex gap-8 items-center text-white font-medium justify-center flex-1">
              <li className="hover:text-violet-400 cursor-pointer"><Link href="/about">회사소개</Link></li>
              <li className="hover:text-violet-400 cursor-pointer"><Link href="/products">주요제품</Link></li>
              <li className="hover:text-violet-400 cursor-pointer"><Link href="/portfolio">주요실적</Link></li>
              <li className="hover:text-violet-400 cursor-pointer"><Link href="/downloads">자료다운로드</Link></li>
              {/* 고객센터 드롭다운 메뉴 */}
              <li
                className="relative"
                onMouseEnter={() => setIsCustomerMenuOpen(true)}
                onMouseLeave={() => setIsCustomerMenuOpen(false)}
              >
                <button
                  className="flex items-center text-white hover:text-violet-400"
                  onClick={() => setIsCustomerMenuOpen(!isCustomerMenuOpen)}
                  type="button"
                >
                  고객센터
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCustomerMenuOpen && (
                  <>
                    {/* 투명 브릿지 영역 */}
                    <div className="absolute left-0 top-full w-48 h-4" />
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg overflow-visible z-[9999]">
                      <div className="py-1">
                        <Link
                          href="/customer/notice"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-violet-600"
                          onClick={() => setIsCustomerMenuOpen(false)}
                        >
                          공지사항
                        </Link>
                        <Link
                          href="/customer/quote"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-violet-600"
                          onClick={() => setIsCustomerMenuOpen(false)}
                        >
                          견적요청
                        </Link>
                        <Link
                          href="/contact"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-violet-600"
                          onClick={() => setIsCustomerMenuOpen(false)}
                        >
                          문의하기
                        </Link>
                        <Link
                          href="/location"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-violet-600"
                          onClick={() => setIsCustomerMenuOpen(false)}
                        >
                          오시는길
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </li>
              {isLoggedIn && (
                <li className="hover:text-violet-400 cursor-pointer"><Link href="/admin">관리자</Link></li>
              )}
            </ul>
              {/* 우측: 로그인/로그아웃 */}
              <div className="flex items-center gap-6 min-w-[120px] justify-end">
                {isLoggedIn ? (
                  <button
                    className="flex items-center gap-1 text-gray-200 hover:text-violet-400"
                    onClick={() => {
                      document.cookie = 'admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                      setIsLoggedIn(false)
                      window.location.reload()
                    }}
                  >
                    로그아웃
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-gray-200 hover:text-violet-400" onClick={() => setIsLoginModalOpen(true)}>
                    <FaUser className="inline-block" /> 로그인
                  </button>
                )}
              </div>
            </div>
          </div>
      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs relative">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-6 text-center">관리자 로그인</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="아이디"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className="border rounded-lg px-3 py-2"
                autoFocus
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={loginPw}
                onChange={e => setLoginPw(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
              <button
                type="submit"
                className="bg-[#222831] text-[#DFD0B8] font-bold py-2 rounded-lg hover:bg-[#948979] hover:text-[#222831] transition-colors"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      )}
      {children}
      {!isAdmin && <Footer />}
        </>
      )}
      {isAdmin && (
        <>{children}</>
      )}
    </>
  )
} 