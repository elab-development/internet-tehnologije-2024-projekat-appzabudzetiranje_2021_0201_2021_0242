// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth screens */}
        <Route path="/" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/home" element={<Home />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
