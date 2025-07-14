// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth screens */}
        <Route path="/" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
