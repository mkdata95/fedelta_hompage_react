import Link from 'next/link'

interface CustomerCenterHeaderProps {
  activeTab: 'notice' | 'quote' | 'contact' | 'location';
}

const tabs = [
  { key: 'notice', label: '공지사항', href: '/customer/notice' },
  { key: 'quote', label: '견적요청', href: '/customer/quote' },
  { key: 'contact', label: '문의하기', href: '/contact' },
  { key: 'location', label: '오시는길', href: '/location' },
]

export default function CustomerCenterHeader({ activeTab }: CustomerCenterHeaderProps) {
  return (
    <>
      {/* 상단 비주얼 */}
      <div className="relative w-full h-56 bg-black flex items-center justify-center mt-24">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">고객센터</h1>
      </div>
      {/* 탭 메뉴 */}
      <div className="bg-white border-b">
        <div className="flex justify-center gap-8 py-4">
          {tabs.map(tab => (
            <Link
              key={tab.key}
              href={tab.href}
              className={
                (activeTab === tab.key
                  ? 'font-bold border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black') +
                ' px-4 transition-colors text-lg'
              }
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
} 