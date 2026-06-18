'use client'

import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_urls?: string[]
  discount_percent?: number
  size?: string
}

interface CartState {
  items: CartItem[]
  isLoaded: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADED' }

const STORAGE_KEY = 'wb_cart_v2'

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'LOAD_CART':
      return { ...state, items: action.payload, isLoaded: true }
    case 'SET_LOADED':
      return { ...state, isLoaded: true }
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
  isInCart: (id: string) => boolean
  totalItems: number
  totalPrice: number
  isLoaded: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isLoaded: false })
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount only
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD_CART', payload: parsed })
        } else {
          dispatch({ type: 'SET_LOADED' })
        }
      } else {
        dispatch({ type: 'SET_LOADED' })
      }
    } catch (err) {
      console.error('Failed to load cart:', err)
      dispatch({ type: 'SET_LOADED' })
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever cart changes (only after mount)
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch (err) {
      console.error('Failed to save cart:', err)
    }
  }, [state.items, mounted])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error('Failed to clear cart:', err)
    }
  }

  const getItemQuantity = (id: string) => {
    return state.items.find(i => i.id === id)?.quantity || 0
  }

  const isInCart = (id: string) => {
    return state.items.some(i => i.id === id)
  }

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
      isInCart,
      totalItems,
      totalPrice,
      isLoaded: state.isLoaded && mounted,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
