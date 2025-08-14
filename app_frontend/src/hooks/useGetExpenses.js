// src/hooks/useGetExpenses.js
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function useGetExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await axios.get('/api/expenses', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      })
      // handle Laravel Resource collection format:
      const list = resp.data.data ?? resp.data
      setExpenses(list)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  return { expenses, loading, error, refetch: fetchExpenses }
}
