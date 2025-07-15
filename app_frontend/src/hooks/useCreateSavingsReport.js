// src/hooks/useCreateSavingsReport.js
import { useState } from 'react'
import axios from 'axios'

export default function useCreateSavingsReport() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const createReport = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(
        '/api/savings-reports',
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      return res.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createReport, loading, error }
}
