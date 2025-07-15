// src/pages/TrackExpenses.jsx

import React, { useState } from 'react'
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton
} from '@mui/material'
import AddIcon        from '@mui/icons-material/Add'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import EditIcon       from '@mui/icons-material/Edit'
import DeleteIcon     from '@mui/icons-material/Delete'

// Category icons
import ShoppingCartIcon   from '@mui/icons-material/ShoppingCart'
import FastfoodIcon       from '@mui/icons-material/Fastfood'
import LocalPharmacyIcon  from '@mui/icons-material/LocalPharmacy'
import SportsSoccerIcon   from '@mui/icons-material/SportsSoccer'
import MovieIcon          from '@mui/icons-material/Movie'
import ReceiptLongIcon    from '@mui/icons-material/ReceiptLong'

import useGetExpenses        from '../hooks/useGetExpenses'
import useGetSavingsReports  from '../hooks/useGetSavingsReports'
import useCreateExpense      from '../hooks/useCreateExpense'
import useUpdateExpense      from '../hooks/useUpdateExpense'
import useDeleteExpense      from '../hooks/useDeleteExpense'
import useUpdateExpenseMonth from '../hooks/useUpdateExpenseMonth'

const categories     = ['shopping','food','medications','sports','entertainment','bills']
const paymentMethods = ['cash','card']

// map each category to its icon component
const categoryIcons = {
  shopping:      ShoppingCartIcon,
  food:          FastfoodIcon,
  medications:   LocalPharmacyIcon,
  sports:        SportsSoccerIcon,
  entertainment: MovieIcon,
  bills:         ReceiptLongIcon
}

export default function TrackExpenses() {
  const { expenses, loading, refetch }           = useGetExpenses()
  const { reports, loading: reportsLoading }     = useGetSavingsReports()
  const { createExpense, loading: creating }     = useCreateExpense()
  const { updateExpense, loading: updating }     = useUpdateExpense()
  const { deleteExpense, loading: deleting }     = useDeleteExpense()
  const { updateMonth,   loading: patching }     = useUpdateExpenseMonth()

  const [openDialog, setOpenDialog] = useState(false)
  const [editId,     setEditId]     = useState(null)
  const initialForm = {
    amount: '',
    date: '',
    category: '',
    payment_method: '',
    currency: 'USD',
    receipt_image: '',
    is_recurring: false,
    recurring_interval: '',
    tags: [],
    description: '',
    savings_report_id: ''
  }
  const [form, setForm]           = useState(initialForm)
  const [apiErrors, setApiErrors] = useState({})

  const openCreate = () => {
    setEditId(null)
    setForm(initialForm)
    setApiErrors({})
    setOpenDialog(true)
  }

  const openEdit = exp => {
    setEditId(exp.id)
    setForm({
      amount: exp.amount,
      date:   exp.date?.slice(0,10) || '',
      category: exp.category,
      payment_method: exp.payment_method,
      currency: exp.currency,
      receipt_image: exp.receipt_image,
      is_recurring: exp.is_recurring,
      recurring_interval: exp.recurring_interval,
      tags: exp.tags || [],
      description: exp.description || '',
      savings_report_id: exp.savings_report_id || ''
    })
    setApiErrors({})
    setOpenDialog(true)
  }

  const closeDialog = () => setOpenDialog(false)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    const payload = {
      amount: parseFloat(form.amount),
      date: form.date,
      category: form.category,
      payment_method: form.payment_method,
      currency: form.currency,
      receipt_image: form.receipt_image,
      is_recurring: form.is_recurring,
      recurring_interval: form.recurring_interval,
      tags: form.tags,
      description: form.description,
      savings_report_id: form.savings_report_id
    }
    try {
      setApiErrors({})
      if (editId) await updateExpense(editId, payload)
      else         await createExpense(payload)
      await refetch()
      closeDialog()
    } catch (err) {
      const ve = err.response?.data?.errors
      if (ve) setApiErrors(ve)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await deleteExpense(id)
      await refetch()
    } catch {}
  }

  const handleMonth = async id => {
    const m = window.prompt('Enter new month (1–12):')
    const month = parseInt(m, 10)
    if (!month || month < 1 || month > 12) return
    try {
      await updateMonth(id, month)
      await refetch()
    } catch {}
  }

  // filter reports to match selected date’s month in the form
  const filteredReports = (() => {
    if (!form.date) return reports
    const d = new Date(form.date), y = d.getFullYear(), m = d.getMonth()+1
    return [...new Map(
      reports
        .filter(r=>r.year===y && r.month===m)
        .map(r=>[r.id,r])
    ).values()]
  })()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D1122 0%, #12172E 100%)',
        py: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          mb={4}
        >
          <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700 }}>
            Your Expenses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={creating}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(90deg, #2979FF, #40C4FF)',
              '&:hover': {
                background: 'linear-gradient(90deg, #1565C0, #00B0FF)'
              }
            }}
          >
            + New Expense
          </Button>
        </Stack>

        {/* Loading / Empty / Fixed‐size Cards */}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : expenses.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(20,25,50,0.6)',
              borderRadius: 3
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem' }}>
              There are no expenses…
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
              Try creating a new one to start tracking.
            </Typography>
          </Box>
        ) : (
          <Box
            component="section"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'flex-start'
            }}
          >
            {expenses.map(exp => {
              const prettyDate = new Date(exp.date).toLocaleDateString()
              const Icon = categoryIcons[exp.category] || ShoppingCartIcon
              return (
                <Card
                  key={exp.id}
                  elevation={0}
                  sx={{
                    flex: '0 0 300px',
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(20,25,50,0.6)',
                    borderRadius: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Icon sx={{ color:'#40C4FF', fontSize:32, mb:1 }} />
                    <Typography variant="h6" sx={{ color: '#FFF', mb: 1 }}>
                      {exp.category.charAt(0).toUpperCase() + exp.category.slice(1)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#BBB',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflowY: 'auto'
                      }}
                    >
                      {exp.description || '—'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#AAA', mb: 1 }}>
                      {prettyDate}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#AAA', mb: 2 }}>
                      Payment: {exp.payment_method.charAt(0).toUpperCase() + exp.payment_method.slice(1)}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#40C4FF', fontWeight: 600 }}>
                      ${Number(exp.amount || 0).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton size="small" onClick={() => handleMonth(exp.id)} sx={{ color: '#40C4FF' }}>
                      <RestartAltIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => openEdit(exp)} sx={{ color: '#FFF' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(exp.id)} sx={{ color: '#FF6B6B' }}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              )
            })}
          </Box>
        )}

        {/* Create / Edit Dialog */}
        <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ background: '#12172E', color: '#FFF' }}>
            {editId ? 'Edit Expense' : 'New Expense'}
          </DialogTitle>
          <DialogContent sx={{ display:'grid', gap:2, pt:3, background:'#12172E' }}>
            {/* Amount */}
            <TextField
              label="Amount"
              name="amount"
              type="number"
              variant="filled"
              InputLabelProps={{ sx:{ color:'#AAA' } }}
              InputProps={{ sx:{ color:'#FFF', background:'rgba(255,255,255,0.05)' } }}
              value={form.amount}
              onChange={handleChange}
              error={Boolean(apiErrors.amount)}
              helperText={apiErrors.amount?.[0]}
              fullWidth
            />
            {/* Date */}
            <TextField
              label="Date"
              name="date"
              type="date"
              variant="filled"
              InputLabelProps={{ sx:{ color:'#AAA' }, shrink:true }}
              InputProps={{ sx:{ color:'#FFF', background:'rgba(255,255,255,0.05)' } }}
              value={form.date}
              onChange={handleChange}
              error={Boolean(apiErrors.date)}
              helperText={apiErrors.date?.[0]}
              fullWidth
            />
            {/* Category */}
            <TextField
              select
              label="Category"
              name="category"
              variant="filled"
              InputLabelProps={{ sx:{ color:'#AAA' } }}
              InputProps={{ sx:{ color:'#FFF', background:'rgba(255,255,255,0.05)' } }}
              value={form.category}
              onChange={handleChange}
              error={Boolean(apiErrors.category)}
              helperText={apiErrors.category?.[0]}
              fullWidth
            >
              {categories.map(c => (
                <MenuItem key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            {/* Payment Method */}
            <TextField
              select
              label="Payment Method"
              name="payment_method"
              variant="filled"
              InputLabelProps={{ sx:{ color:'#AAA' } }}
              InputProps={{ sx:{ color:'#FFF', background:'rgba(255,255,255,0.05)' } }}
              value={form.payment_method}
              onChange={handleChange}
              error={Boolean(apiErrors.payment_method)}
              helperText={apiErrors.payment_method?.[0]}
              fullWidth
            >
              {paymentMethods.map(m => (
                <MenuItem key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            {/* Description */}
            <TextField
              label="Description"
              name="description"
              variant="filled"
              multiline
              rows={2}
              InputLabelProps={{ sx:{ color:'#AAA' } }}
              InputProps={{ sx:{ color:'#FFF', background:'rgba(255,255,255,0.05)' } }}
              value={form.description}
              onChange={handleChange}
              error={Boolean(apiErrors.description)}
              helperText={apiErrors.description?.[0]}
              fullWidth
            />
            {/* Savings Report */}
            <TextField
              select
              label="Report"
              name="savings_report_id"
              variant="filled"
              InputLabelProps={{ sx:{ color:'#AAA' } }}
              InputProps={{ sx:{ color:'#FFF', background:'rgba(255,255,255,0.05)' } }}
              value={form.savings_report_id}
              onChange={handleChange}
              error={Boolean(apiErrors.savings_report_id)}
              helperText={apiErrors.savings_report_id?.[0]}
              fullWidth
            >
              {reportsLoading
                ? <MenuItem disabled>Loading…</MenuItem>
                : filteredReports.length > 0
                  ? filteredReports.map(r => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.year}/{String(r.month).padStart(2,'0')}
                      </MenuItem>
                    ))
                  : <MenuItem disabled>No report for that month</MenuItem>
              }
            </TextField>
          </DialogContent>
          <DialogActions sx={{ background:'#12172E', px:3, pb:2 }}>
            <Button onClick={closeDialog} sx={{ color:'#BBB' }}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={creating || updating}
              sx={{
                textTransform:'none',
                background:'linear-gradient(90deg,#2979FF,#40C4FF)',
                '&:hover':{ background:'linear-gradient(90deg,#1565C0,#00B0FF)' }
              }}
            >
              {editId ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  )
}
