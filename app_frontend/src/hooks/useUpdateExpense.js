// src/hooks/useUpdateExpense.js
import { useState } from 'react'
import axios from 'axios'

export default function useUpdateExpense() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const updateExpense = async (id, payload) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await axios.put(`/api/expenses/${id}`, payload, {
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

  return { updateExpense, loading, error }
}
