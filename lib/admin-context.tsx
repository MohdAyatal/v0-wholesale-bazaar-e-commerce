'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already authenticated (from localStorage)
    const storedEmail = localStorage.getItem('admin_email')
    const storedToken = localStorage.getItem('admin_token')
    
    if (storedEmail && storedToken) {
      // Verify token is still valid
      const tokenTime = localStorage.getItem('admin_token_time')
      const now = Date.now()
      const tokenAge = now - parseInt(tokenTime || '0')
      
      // Token expires after 24 hours
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
    <AuthContext.Provider value={{ user, profile: user, loading, signInWithGoogle, signOut, updateProfile, refreshProfile: async () => {} }}>
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
