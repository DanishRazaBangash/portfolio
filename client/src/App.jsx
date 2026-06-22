import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useTheme } from '@/store/useTheme'
import { useEasterEgg } from '@/hooks/useEasterEgg'
import CustomCursor from '@/components/shared/CustomCursor'
import ScrollProgress from '@/components/shared/ScrollProgress'
import CommandPalette from '@/components/shared/CommandPalette'
import StarField from '@/components/shared/StarField'
import Home from '@/pages/Home'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'

function AppInner() {
  const { theme } = useTheme()
  useEasterEgg()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <>
      <StarField />
      <CustomCursor />
      <ScrollProgress />
      <CommandPalette />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isDark ? '#111' : '#ffffff',
            color: isDark ? '#fafafa' : '#09090b',
            border: isDark
              ? '1px solid rgba(255,255,255,0.10)'
              : '1px solid rgba(0,0,0,0.10)',
            borderRadius: '12px',
            fontSize: '13px',
            boxShadow: isDark
              ? '0 4px 24px rgba(0,0,0,0.4)'
              : '0 4px 24px rgba(0,0,0,0.08)',
          },
        }}
      />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/blog"            element={<Blog />} />
        <Route path="/blog/:slug"      element={<BlogPost />} />
        <Route path="/admin/login"     element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin"           element={<Navigate to="/admin/login" replace />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
