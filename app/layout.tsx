import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ProductProvider } from './context/ProductContext'
import { SiteContentProvider } from './context/SiteContentContext'
import { PortfolioProvider } from './context/PortfolioContext'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '페델타',
  description: '페델타 공식 웹사이트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      {/* <head>
        <link rel="stylesheet" href="/ckeditor5/ckeditor5.css" />
        <link rel="stylesheet" href="/ckeditor5/ckeditor5-content.css" />
        <script src="/ckeditor5/ckeditor5.js"></script>
      </head> */}
      <body className={inter.className}>
        <SiteContentProvider>
          <ProductProvider>
            <PortfolioProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </PortfolioProvider>
          </ProductProvider>
        </SiteContentProvider>
      </body>
    </html>
  )
} 