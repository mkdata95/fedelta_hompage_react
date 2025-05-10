'use client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <h1>src admin layout 테스트 (쿠키 무시)</h1>
      {children}
    </div>
  )
} 