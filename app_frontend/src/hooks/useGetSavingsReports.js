// src/hooks/useGetSavingsReports.js
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function useGetSavingsReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('/api/savings-reports', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      // if you’re using a Resource collection it’ll be in res.data.data
      const list = res.data.data ?? res.data
      setReports(list)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return {
    reports,
    loading,
    error,
    refetch: fetchReports
  }
}
