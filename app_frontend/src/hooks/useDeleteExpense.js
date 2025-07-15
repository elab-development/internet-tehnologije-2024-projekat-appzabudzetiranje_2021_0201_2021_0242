// src/hooks/useDeleteExpense.js
import { useState } from 'react'
import axios from 'axios'

export default function useDeleteExpense() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const deleteExpense = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      })
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteExpense, loading, error }
}
