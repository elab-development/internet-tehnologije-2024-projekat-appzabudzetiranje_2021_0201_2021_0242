// src/hooks/useCreateExpense.js
import { useState } from 'react'
import axios from 'axios'

export default function useCreateExpense() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const createExpense = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await axios.post('/api/expenses', payload, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      })
      return resp.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createExpense, loading, error }
}
