// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import TrackExpenses from './pages/TrackExpenses'
import SavingsReports from './pages/SavingsReports'
import NavigationMenu from './components/NavigationMenu'
import Footer from './components/Footer'
import MySavingsGroups from './pages/MySavingsGroups'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'

function App() {
  // keep token in state; always a string ('' when unauthenticated) for stability
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || '')

  // derive user/role from sessionStorage (no effects needed)
  const userRaw = sessionStorage.getItem('user')
  const user    = userRaw ? JSON.parse(userRaw) : {}
  const role    = String(user?.role || '').toLowerCase()
  const landing = role === 'administrator' ? '/admin-dashboard' : '/home'

  // sync token from other tabs / login page changes WITHOUT dynamic deps
  useEffect(() => {
    const sync = () => setToken(sessionStorage.getItem('token') || '')
    const onVis = () => { if (document.visibilityState === 'visible') sync() }

    window.addEventListener('storage', sync)
    document.addEventListener('visibilitychange', onVis)

    // small timer to catch immediate changes from the Auth page
    const id = setInterval(sync, 1000)

    return () => {
      window.removeEventListener('storage', sync)
      document.removeEventListener('visibilitychange', onVis)
      clearInterval(id)
    }
  }, []) // ✅ array length is constant

  // Guard for routes with optional role checks (no useEffect inside)
  const RequireAuth = ({ children, roles }) => {
    const hasToken = !!(sessionStorage.getItem('token') || '')
    if (!hasToken) return <Navigate to="/" replace />
    if (roles?.length && !roles.includes(role)) return <Navigate to="/home" replace />
    return children
  }

  return (
    <BrowserRouter>
      {token && <NavigationMenu />}

      <Routes>
        {/* Auth: if logged in, go to role-based landing */}
        <Route
          path="/"
          element={token ? <Navigate to={landing} replace /> : <Auth />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to={landing} replace /> : <Auth />}
        />

        {/* Regular protected */}
        <Route
          path="/home"
          element={<RequireAuth><Home /></RequireAuth>}
        />
        <Route
          path="/expenses"
          element={<RequireAuth><TrackExpenses /></RequireAuth>}
        />
        <Route
          path="/savings-reports"
          element={<RequireAuth><SavingsReports /></RequireAuth>}
        />
        <Route
          path="/my-savings-groups"
          element={<RequireAuth><MySavingsGroups /></RequireAuth>}
        />

        {/* Admin-only */}
        <Route
          path="/admin-dashboard"
          element={
            <RequireAuth roles={['administrator']}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/user-management"
          element={
            <RequireAuth roles={['administrator']}>
              <UserManagement />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? landing : '/'} replace />} />
      </Routes>

      {token && <Footer />}
    </BrowserRouter>
  )
}

export default App
