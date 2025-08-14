// src/hooks/useUpdateExpenseMonth.js
import { useState } from 'react'
import axios from 'axios'

export default function useUpdateExpenseMonth() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const updateMonth = async (id, month) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await axios.patch(
        `/api/expenses/${id}/month`,
        { month },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
      )
      return resp.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateMonth, loading, error }
}
