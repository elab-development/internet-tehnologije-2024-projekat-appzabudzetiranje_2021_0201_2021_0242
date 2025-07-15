// src/pages/SavingsReports.jsx
import React, { useState } from 'react'
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import useGetSavingsReports     from '../hooks/useGetSavingsReports'
import useCreateSavingsReport   from '../hooks/useCreateSavingsReport'

export default function SavingsReports() {
  const { reports, loading, refetch } = useGetSavingsReports()
  const {
    createReport,
    loading: creating,
    error: createError
  } = useCreateSavingsReport()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    year: '',
    month: '',
    notes: ''
  })
  const [apiErrors, setApiErrors] = useState({})

  const openDialog = () => {
    setForm({ year: '', month: '', notes: '' })
    setApiErrors({})
    setOpen(true)
  }
  const closeDialog = () => setOpen(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      setApiErrors({})
      await createReport({
        year: parseInt(form.year, 10),
        month: parseInt(form.month, 10),
        notes: form.notes || null
      })
      await refetch()
      closeDialog()
    } catch (err) {
      const ve = err.response?.data?.errors
      if (ve) setApiErrors(ve)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D1122 0%, #12172E 100%)',
        py: 8
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          mb={4}
        >
          <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 700 }}>
            Monthly Savings Reports
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openDialog}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(90deg, #2979FF, #40C4FF)',
              '&:hover': {
                background: 'linear-gradient(90deg, #1565C0, #00B0FF)'
              }
            }}
          >
            New Report
          </Button>
        </Stack>

        {/* Loading / Empty / List */}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : reports.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(20,25,50,0.6)',
              borderRadius: 3
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem' }}>
              No savings reports yet…
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
              Create one to start monitoring your progress.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {reports.map(r => (
              <Grid item xs={12} sm={6} key={r.id}>
                <Card
                  elevation={0}
                  sx={{
                    background: 'rgba(20,25,50,0.6)',
                    borderRadius: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ color: '#40C4FF', mb: 1, fontWeight: 600 }}
                    >
                      {r.year} / {r.month.toString().padStart(2, '0')}
                    </Typography>
                    <Typography sx={{ color: '#EEE' }}>
                      {r.notes || '—'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create Dialog */}
        <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ background: '#12172E', color: '#FFF' }}>
            New Savings Report
          </DialogTitle>
          <DialogContent
            sx={{ display: 'grid', gap: 2, pt: 3, background: '#12172E' }}
          >
            <TextField
              label="Year"
              name="year"
              type="number"
              variant="filled"
              InputLabelProps={{ sx: { color: '#AAA' } }}
              InputProps={{ sx: { color: '#FFF', background: 'rgba(255,255,255,0.05)' } }}
              value={form.year}
              onChange={handleChange}
              error={Boolean(apiErrors.year)}
              helperText={apiErrors.year?.[0]}
              fullWidth
            />
            <TextField
              select
              label="Month"
              name="month"
              variant="filled"
              InputLabelProps={{ sx: { color: '#AAA' } }}
              InputProps={{ sx: { color: '#FFF', background: 'rgba(255,255,255,0.05)' } }}
              value={form.month}
              onChange={handleChange}
              error={Boolean(apiErrors.month)}
              helperText={apiErrors.month?.[0]}
              fullWidth
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <MenuItem key={m} value={m}>
                  {m.toString().padStart(2, '0')}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Notes"
              name="notes"
              variant="filled"
              multiline
              rows={3}
              InputLabelProps={{ sx: { color: '#AAA' } }}
              InputProps={{ sx: { color: '#FFF', background: 'rgba(255,255,255,0.05)' } }}
              value={form.notes}
              onChange={handleChange}
              error={Boolean(apiErrors.notes)}
              helperText={apiErrors.notes?.[0]}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ background: '#12172E', px: 3, pb: 2 }}>
            <Button onClick={closeDialog} sx={{ color: '#BBB' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={creating}
              sx={{
                textTransform: 'none',
                background: 'linear-gradient(90deg,#2979FF,#40C4FF)',
                '&:hover': { background: 'linear-gradient(90deg,#1565C0,#00B0FF)' }
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
