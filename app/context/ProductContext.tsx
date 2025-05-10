'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface Product {
  id: string
  title: string
  description: string
  detail: string
  image?: string
  images?: string[]
  brand?: string
  size?: string
  summary?: string
  features?: string
  galleryTitle?: string
  gallerySubtitle?: string
  category?: string
  tags?: string[]
}

interface ProductContextType {
  products: Product[]
  updateProduct: (id: string, product: Product) => void
  addProduct: (product: Product) => void
  deleteProduct: (id: string) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // 초기 데이터 로드 - 이미 데이터가 있으면 다시 불러오지 않음
    if (products.length > 0) return;
    
    let isMounted = true;
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        
        if (Array.isArray(data)) {
          // ID가 없는 경우 자동으로 생성
          const productsWithIds = data.map((product, index) => ({
            ...product,
            id: product.id || `product-${index + 1}`
          }))
          setProducts(productsWithIds)
        } else {
          console.error('Received data is not an array:', data)
        }
      })
      .catch(error => {
        console.error('Failed to load products:', error)
      })
      
    return () => {
      isMounted = false;
    };
  }, [])

  const updateProduct = async (id: string, product: Product) => {
    try {
      console.log('Updating product:', { id, product })
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, id }),
      })
      
      if (response.ok) {
        setProducts(prev => prev.map(p => p.id === id ? product : p))
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const addProduct = async (product: Product) => {
    try {
      console.log('Adding product:', product)
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      
      if (response.ok) {
        const newProduct = await response.json()
        console.log('Added product:', newProduct)
        setProducts(prev => [...prev, newProduct])
      } else {
        throw new Error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      console.log('Deleting product:', id)
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  return (
    <ProductContext.Provider value={{ products, updateProduct, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
} 