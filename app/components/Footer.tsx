"use client"
import Link from 'next/link'
import { useSiteContent } from '../context/SiteContentContext'

export default function Footer() {
  const { siteContent } = useSiteContent()
  const info = siteContent.siteInfo
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{info.siteName || '페델타'}</h3>
            <p className="text-gray-400">
              혁신적인 솔루션으로 미래를 만들어갑니다
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">회사소개</Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">제품</Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">실적</Link>
              </li>
              <li>
                <Link href="/downloads" className="text-gray-400 hover:text-white transition-colors">자료다운로드</Link>
              </li>
              <li>
                <Link href="/location" className="text-gray-400 hover:text-white transition-colors">오시는길</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">연락처</h3>
            <ul className="space-y-2 text-gray-400">
              <li>이메일: {info.email}</li>
              <li>전화: {info.phone}</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">주소</h3>
            <p className="text-gray-400">
              {info.address}
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 {info.siteName || '페델타'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 