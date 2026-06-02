'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_urls?: string[]
  category_id?: string
  discount_percent?: number
  size?: string  // <-- ADD THIS
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size?: string) => void  // <-- Update signature
  updateQuantity: (id: string, quantity: number, size?: string) => void  // <-- Update signature
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wb_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wb_cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      // Check if item with same ID AND size exists
      const existing = prev.find(i => i.id === product.id && i.size === product.size)
      if (existing) {
        // Already in cart — increase quantity
        return prev.map(i =>
          i.id === product.id && i.size === product.size 
            ? { ...i, quantity: i.quantity + (product.quantity || 1) } 
            : i
        )
      }
      // New item
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
  }

  const removeItem = (id: string, size?: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)))
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(id, size)
      return
    }
    setItems(prev =>
      prev.map(i => (i.id === id && i.size === size) ? { ...i, quantity } : i)
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
