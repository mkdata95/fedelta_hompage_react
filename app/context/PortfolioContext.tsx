"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface PortfolioItem {
  id: string
  title: string
  period: string
  role: string
  overview: string
  details: string[] | string
  client: string
  image: string
  category: string
  gallery?: any[]
  size?: string
}

interface PortfolioContextType {
  items: PortfolioItem[]
  addItem: (item: PortfolioItem) => void
  updateItem: (id: string, item: PortfolioItem) => void
  deleteItem: (id: string) => void
}

const initialItems: PortfolioItem[] = [
  {
    id: 'project1',
    title: '국립과학관',
    period: '2023년 1월 - 2023년 6월',
    role: '시스템 설계, 개발, 구축, 운영',
    overview: '국립과학관 디지털 전시 시스템 구축',
    details: [
      '전시 콘텐츠 관리 시스템 개발',
      '실시간 방문자 모니터링 시스템 구축',
      '디지털 전시물 인터랙티브 시스템 개발',
    ],
    client: '국립과학관',
    image: '/images/projects/science-museum.jpg',
    category: '솔루션',
    size: 'Desktop 1200 - Mobile 360',
  },
]

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioItems')
      if (saved) return JSON.parse(saved)
    }
    return initialItems
  })

  const addItem = (item: PortfolioItem) => {
    setItems(prev => {
      const newItems = [...prev, item]
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolioItems', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  const updateItem = (id: string, item: PortfolioItem) => {
    setItems(prev => {
      const newItems = prev.map(i => (i.id === id ? item : i))
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolioItems', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  const deleteItem = (id: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.id !== id)
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolioItems', JSON.stringify(newItems))
      }
      return newItems
    })
  }

  useEffect(() => {
    const saved = localStorage.getItem('portfolioItems')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  return (
    <PortfolioContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider')
  return context
} 