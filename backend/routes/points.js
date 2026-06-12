import express from 'express'
import { supabase } from '../supabase.js'

const router = express.Router()

// GET /api/points
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('points')
    .select('user_email, points')
    .order('points', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

export default router
