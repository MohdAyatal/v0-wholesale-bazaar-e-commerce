import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://lpjlgwvjspfujjcfatww.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwamxnd3Zqc3BmdWpqY2ZhdHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDIwOTQsImV4cCI6MjA5NTMxODA5NH0.Zy0Fw2-cv86Xw_1-PvnST4G2Jnlg1BfAv9dFKfQGqTI'
  )
}
