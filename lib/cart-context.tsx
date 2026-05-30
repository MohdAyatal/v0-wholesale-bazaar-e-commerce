'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('wholesale_cart')
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wholesale_cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.id === newItem.id)
      if (existing) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      return [...prevItems, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
