'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { siteContent } from '../data/siteContent'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    // /admin/login에서는 인증 체크하지 않음
    if (pathname === '/admin/login') return
    // 쿠키 검사
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    if (found && found.split('=')[1] === '1') {
      setIsAuth(true)
    } else {
      router.replace('/admin/login')
    }
  }, [pathname, router])

  if (pathname !== '/admin/login' && !isAuth) {
    return null // 인증 전에는 아무것도 렌더링하지 않음
  }

  const menuItems = [
    { name: '대시보드', path: '/admin' },
    { name: 'Hero 섹션', path: '/admin/hero' },
    { name: '회사 소개', path: '/admin/about' },
    { name: '서비스', path: '/admin/services' },
    { name: '자료다운로드 관리', path: '/admin/downloads' },
    { name: '문의 관리', path: '/admin/contact' },
  ]

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col py-8 px-4">
        <div className="mb-8">
          <span className="text-2xl font-bold text-blue-400">{siteContent.siteInfo.siteName}</span>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded ${
                pathname === item.path ? 'bg-blue-700' : 'hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* 설정 1차 메뉴 */}
          <div>
            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded hover:bg-gray-800 ${settingsOpen ? 'bg-gray-800' : ''}`}
              onClick={() => setSettingsOpen(v => !v)}
            >
              <span>설정</span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${settingsOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            {settingsOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <Link href="/admin/categories" className={`block px-4 py-2 rounded ${pathname.startsWith('/admin/categories') ? 'bg-blue-700 text-white font-semibold' : 'hover:bg-gray-800 text-white'}`}>카테고리 관리</Link>
                <Link href="/admin/siteinfo" className={`block px-4 py-2 rounded ${pathname.startsWith('/admin/siteinfo') ? 'bg-blue-700 text-white font-semibold' : 'hover:bg-gray-800 text-white'}`}>사이트 정보</Link>
                <Link href="/admin/password" className={`block px-4 py-2 rounded ${pathname.startsWith('/admin/password') ? 'bg-blue-700 text-white font-semibold' : 'hover:bg-gray-800 text-white'}`}>비밀번호 변경</Link>
                <Link href="/admin/smtp" className={`block px-4 py-2 rounded ${pathname.startsWith('/admin/smtp') ? 'bg-blue-700 text-white font-semibold' : 'hover:bg-gray-800 text-white'}`}>SMTP 정보</Link>
              </div>
            )}
          </div>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          {children}
        </div>
      </main>
    </div>
  )
} 