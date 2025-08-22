// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material'
import axios from 'axios'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
} from 'recharts'

/* ---------- Axios base ---------- */
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process?.env?.REACT_APP_API_URL) ||
  'http://localhost:8000/api'

const api = axios.create({ baseURL: API_BASE })
api.interceptors.request.use(cfg => {
  const t = sessionStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

/* ---------- helpers ---------- */
const pad2 = (n) => String(n).padStart(2, '0')
const labelYM = (y, m) => `${y}/${pad2(m)}`
const fmtCurrency0 = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0))
const fmtCurrency = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n || 0))

/* ---------- small UI helpers ---------- */
const StatChip = ({ label }) => (
  <Chip
    size="medium"
    label={label}
    sx={{
      color: '#EAF1FF',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(6px)'
    }}
  />
)

const ChartCard = ({ title, subtitle, children }) => (
  <Card
    elevation={0}
    sx={{
      background: 'linear-gradient(180deg, rgba(20,25,50,0.7) 0%, rgba(15,20,40,0.7) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 4,
      overflow: 'hidden'
    }}
  >
    <Box sx={{ height: 3, background: 'linear-gradient(90deg,#2979FF,#40C4FF)' }} />
    <CardContent sx={{ color:'#FFF' }}>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color:'#AAB4CF', mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        {children}
      </Box>
    </CardContent>
  </Card>
)

const TooltipBox = ({ active, payload, label, money = true }) => {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div style={{
      padding:'10px 12px',
      background:'rgba(14,19,38,.95)',
      border:'1px solid rgba(255,255,255,.12)',
      borderRadius:8,
      color:'#EAF1FF',
      minWidth: 160
    }}>
      {label && <div style={{ marginBottom:6, color:'#AAB4CF' }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <span style={{ width:10, height:10, background:p.color, borderRadius:2 }} />
            {p.name}
          </span>
          <b>{money ? fmtCurrency(p.value) : p.value}</b>
        </div>
      ))}
    </div>
  )
}

/* ==============================================================
   PAGE
================================================================ */
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([]) // from /savings-reports/statistics (admin-only)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/savings-reports/statistics')
        setStats(data?.statistics || [])
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load statistics')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Normalize with helpers for sorting/aggregations
  const normalized = useMemo(() => {
    return (stats || []).map(r => ({
      ...r,
      total: Number(r.total_expenses || 0),
      count: Number(r.expenses_count || 0),
      ym: labelYM(r.year, r.month),
      ts: Number(r.year) * 100 + Number(r.month) // sortable key
    }))
  }, [stats])

  /* KPIs */
  const kpis = useMemo(() => {
    const total = normalized.reduce((s, r) => s + r.total, 0)
    const items = normalized.reduce((s, r) => s + r.count, 0)
    const reports = normalized.length
    const avg = items ? total / items : 0
    return { total, items, reports, avg }
  }, [normalized])

  /* Top 8 months by total (aggregated by year-month) */
  const topMonths = useMemo(() => {
    const map = new Map()
    normalized.forEach(r => {
      map.set(r.ym, (map.get(r.ym) || 0) + r.total)
    })
    return Array.from(map, ([month, total]) => ({ month, total }))
      .sort((a,b) => b.total - a.total)
      .slice(0, 8)
      .reverse()
  }, [normalized])

  /* Last 12 months trend (sum per month) */
  const last12 = useMemo(() => {
    const map = new Map()
    normalized.forEach(r => {
      const key = r.ts
      const month = r.ym
      const got = map.get(key) || { month, total: 0 }
      got.total += r.total
      map.set(key, got)
    })
    return Array.from(map.entries())
      .sort((a,b) => a[0] - b[0])
      .map(([, v]) => v)
      .slice(-12)
  }, [normalized])

  return (
    <Box sx={{
      minHeight: '100vh',
      background:
        'radial-gradient(1200px 600px at 10% -10%, rgba(64,196,255,0.15), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(21,101,192,0.18), transparent 55%), #0D1122',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Stack spacing={1} mb={3}>
          <Typography variant="h4" sx={{ color:'#FFF', fontWeight: 800 }}>
            Welcome Administrator!
          </Typography>
          <Typography sx={{ color:'rgba(255,255,255,0.65)' }}>
            Overview of savings report activity (all users).
          </Typography>
        </Stack>

        {/* KPIs (now white text chips) */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" mb={2}>
          <StatChip label={`Total: ${fmtCurrency0(kpis.total)}`} />
          <StatChip label={`Reports: ${kpis.reports}`} />
          <StatChip label={`Items: ${kpis.items}`} />
          <StatChip label={`Avg per item: ${fmtCurrency0(kpis.avg)}`} />
        </Stack>

        {loading ? (
          <Box sx={{ textAlign:'center', mt: 8 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : error ? (
          <Box sx={{
            p: 4, textAlign:'center',
            background:'rgba(255,84,84,0.1)',
            border: '1px solid rgba(255,84,84,0.35)',
            borderRadius: 3,
            color:'#FFD1D1'
          }}>
            {error}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* LEFT: Top months by total (Top 8) */}
            <Grid item xs={12} md={6}>
              <ChartCard
                title="Top Months by Total (Top 8)"
                subtitle="Across all users • Horizontal bar"
              >
                <Box sx={{ height: 380, width: 500 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topMonths}
                      layout="vertical"
                      margin={{ top: 8, right: 16, bottom: 8, left: 40 }}
                    >
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                      <XAxis type="number" tick={{ fill:'#BFD9FF' }} tickFormatter={(v)=>`$${Math.round(v/1000)}k`} />
                      <YAxis type="category" dataKey="month" tick={{ fill:'#BFD9FF' }} width={70} />
                      <RechartsTooltip content={<TooltipBox money />} />
                      <Bar dataKey="total" name="Total" fill="#40C4FF" radius={[6,6,6,6]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>

            {/* RIGHT: Last 12 months trend (area) */}
            <Grid item xs={12} md={6}>
              <ChartCard
                title="Last 12 Months Trend"
                subtitle="Sum of totals per month"
              >
                <Box sx={{ height: 380, width: 500 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={last12} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                      <defs>
                        <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#40C4FF" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#40C4FF" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false}/>
                      <XAxis dataKey="month" tick={{ fill:'#BFD9FF' }} />
                      <YAxis tick={{ fill:'#BFD9FF' }} tickFormatter={(v)=>`$${Math.round(v/1000)}k`} />
                      <RechartsTooltip content={<TooltipBox money />} />
                      <Area type="monotone" dataKey="total" name="Total" stroke="#40C4FF" fill="url(#gradBlue)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  )
}
