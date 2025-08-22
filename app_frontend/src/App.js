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
  // local state for the token
  const [token, setToken] = useState(sessionStorage.getItem('token'))

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem('token')
      if (stored !== token) {
        setToken(stored)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [token])

  return (
    <BrowserRouter>
      {/* menu only when we have a token */}
      {token && <NavigationMenu />}

      <Routes>
        {/* auth pages redirect if already logged in */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" /> : <Auth />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/home" /> : <Auth />}
        />

        {/* protected home */}
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/" />}
        />

        <Route
          path="/expenses"
          element={token ? <TrackExpenses /> : <Navigate to="/" />}
        />

        <Route
          path="/savings-reports"
          element={token ? <SavingsReports /> : <Navigate to="/" />}
        />

        <Route
          path="/my-savings-groups"
          element={token ? <MySavingsGroups /> : <Navigate to="/" />}
        />

        <Route
          path="/admin-dashboard"
          element={token ? <AdminDashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/user-management"
          element={token ? <UserManagement /> : <Navigate to="/" />}
        />
      </Routes>
      {token && <Footer/>}
    </BrowserRouter>
  )
}

export default App
