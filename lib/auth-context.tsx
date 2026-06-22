// lib/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface User {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  photo?: string;
  phone?: string;
  gender?: string;
  preferred_categories?: string[];
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the hardcoded credentials from your context
  const supabase = createBrowserClient(
    'https://lpjlgwvjspfujjcfatww.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwamxnd3Zqc3BmdWpqY2ZhdHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDIwOTQsImV4cCI6MjA5NTMxODA5NH0.Zy0Fw2-cv86Xw_1-PvnST4G2Jnlg1BfAv9dFKfQGqTI'
  );

  useEffect(() => {
    // Check for existing session on mount
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
          photo: session.user.user_metadata?.avatar_url,
          phone: session.user.user_metadata?.phone
        });
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
              photo: session.user.user_metadata?.avatar_url,
              phone: session.user.user_metadata?.phone
            });
            localStorage.setItem('wb_user', JSON.stringify(session.user));
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('wb_user');
          }
        }
      );

      setLoading(false);
      return () => subscription.unsubscribe();
    };

    initSession();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
  };

  const signOut = async () => {
    // Clear Supabase session
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear all local storage except cookie consent
    const cookieConsent = localStorage.getItem('wb_cookie_consent');
    localStorage.clear();
    if (cookieConsent) localStorage.setItem('wb_cookie_consent', cookieConsent);
    
    setUser(null);
    window.location.href = '/';
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.name,
        phone: data.phone
      }
    });
    
    if (!error) {
      setUser({ ...user, ...data });
    }
  };

  return (
   <AuthContext.Provider value={{ user, profile: user, loading, signInWithGoogle, signOut, updateProfile, refreshProfile: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
