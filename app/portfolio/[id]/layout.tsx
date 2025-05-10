import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '포트폴리오 상세',
  description: '포트폴리오 프로젝트 상세 정보',
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
      {children}
    </div>
  )
} 