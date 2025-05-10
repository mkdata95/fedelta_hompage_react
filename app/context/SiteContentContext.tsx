"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { siteContent as initialSiteContent } from '../data/siteContent'

interface SiteContentContextType {
  siteContent: typeof initialSiteContent
  setSiteContent: (content: typeof initialSiteContent) => void
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [siteContent, setSiteContent] = useState(initialSiteContent)

  return (
    <SiteContentContext.Provider value={{ siteContent, setSiteContent }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSiteContent must be used within a SiteContentProvider')
  return ctx
} 