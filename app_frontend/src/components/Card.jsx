import React from 'react'
import {
  Card as MUICard,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Button,
  Stack
} from '@mui/material'
import RestartAltIcon    from '@mui/icons-material/RestartAlt'
import EditIcon          from '@mui/icons-material/Edit'
import DeleteIcon        from '@mui/icons-material/Delete'
import DescriptionIcon   from '@mui/icons-material/Description'
import ShoppingCartIcon  from '@mui/icons-material/ShoppingCart'
import FastfoodIcon      from '@mui/icons-material/Fastfood'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import TheatersIcon      from '@mui/icons-material/Theaters'
import InsightsIcon      from '@mui/icons-material/Insights'
import ReceiptLongIcon   from '@mui/icons-material/ReceiptLong'

const categoryIcons = {
  shopping: ShoppingCartIcon,
  food: FastfoodIcon,
  medicines: LocalPharmacyIcon,
  sports_and_recreation: FitnessCenterIcon,
  entertainment: TheatersIcon,
  bills: DescriptionIcon,
}

export default function Card({
  type,
  item,
  onMonth,
  onEdit,
  onDelete,
  onViewAnalytics,
  onViewExpenses
}) {
  // ORIGINAL expense card style (unchanged)
  const expenseCardSx = {
    width: 360,
    height: 300,
    background: 'rgba(20,25,50,0.6)',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.3)' }
  }

  // New, modern look ONLY for reports
  const reportCardSx = {
    width: '100%',
    minHeight: 300,
    background: 'linear-gradient(180deg, rgba(20,25,50,0.7) 0%, rgba(15,20,40,0.7) 100%)',
    borderRadius: 4,
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }
  }

  if (type === 'expense') {
    const { id, category, description, date, amount, payment_method } = item
    const Icon = categoryIcons[category] || DescriptionIcon
    const displayDate = new Date(date).toLocaleDateString()

    return (
      <MUICard elevation={0} sx={expenseCardSx}>
        <CardContent sx={{ overflowY: 'auto', color: '#FFF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Icon sx={{ color: '#40C4FF', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
          </Box>
          <Typography sx={{ color: '#EEE', mb: 1, lineHeight: 1.4 }}>
            {description}
          </Typography>
          <Typography sx={{ color: '#BBB', mb: 1 }}>
            {displayDate} — {payment_method}
          </Typography>
          <Typography variant="h6" sx={{ color: '#40C4FF', fontWeight: 600 }}>
            ${Number(amount).toFixed(2)}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={() => onMonth?.(id)} sx={{ color: '#40C4FF' }}>
            <RestartAltIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit?.(item)} sx={{ color: '#FFF' }}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete?.(id)} sx={{ color: '#FF6B6B' }}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </MUICard>
    )
  }

  if (type === 'report') {
    const { id, year, month, notes } = item
    return (
      <MUICard elevation={0} sx={reportCardSx}>
        <Box sx={{ height: 3, background: 'linear-gradient(90deg,#2979FF,#40C4FF)' }} />
        <CardContent sx={{ color: '#FFF', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DescriptionIcon sx={{ color: '#40C4FF', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {year}/{String(month).padStart(2, '0')}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: '#D6E4FF',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {notes || '—'}
          </Typography>
        </CardContent>

        {/* Bottom-aligned actions (balanced, full width) */}
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Stack direction="row" spacing={1.5} width="100%">
            <Button
              fullWidth
              size="medium"
              startIcon={<InsightsIcon />}
              onClick={() => onViewAnalytics?.(id)}
              sx={{
                textTransform: 'none',
                color: '#0E1326',
                background: 'linear-gradient(90deg,#7BD3FF,#40C4FF)',
                fontWeight: 700,
                '&:hover': { background: 'linear-gradient(90deg,#64C8FF,#18B6FF)' }
              }}
            >
              View Analytics
            </Button>
            <Button
              fullWidth
              size="medium"
              variant="outlined"
              startIcon={<ReceiptLongIcon />}
              onClick={() => onViewExpenses?.(id)}
              sx={{
                textTransform: 'none',
                color: '#E6EEFF',
                borderColor: 'rgba(255,255,255,0.25)',
                fontWeight: 700,
                '&:hover': { borderColor: '#40C4FF', background: 'rgba(64,196,255,0.08)' }
              }}
            >
              View Expenses
            </Button>
          </Stack>
        </CardActions>
      </MUICard>
    )
  }

  return null
}
