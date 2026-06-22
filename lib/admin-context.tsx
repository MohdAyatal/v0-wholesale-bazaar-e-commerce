'use client'
import { createContext, useContext, useState, useEffect } from 'react'

interface AdminContextType {
  isAuthenticated: boolean
  adminEmail: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedEmail = localStorage.getItem('admin_email')
    const storedToken = localStorage.getItem('admin_token')
    if (storedEmail && storedToken) {
      const tokenTime = localStorage.getItem('admin_token_time')
      const tokenAge = Date.now() - parseInt(tokenTime || '0')
      if (tokenAge < 24 * 60 * 60 * 1000) {
        setAdminEmail(storedEmail)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('admin_email')
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_token_time')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        const data = await response.json()
        setAdminEmail(email)
        setIsAuthenticated(true)
        localStorage.setItem('admin_email', email)
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_token_time', Date.now().toString())
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setAdminEmail(null)
    localStorage.removeItem('admin_email')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_token_time')
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, adminEmail, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
