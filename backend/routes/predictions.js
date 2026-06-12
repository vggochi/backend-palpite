import express from 'express'
import { supabase } from '../supabase.js'

const router = express.Router()

// POST /api/predictions
router.post('/', async (req, res) => {
  const { user_email, match_id, pred_score_a, pred_score_b } = req.body

  const { data, error } = await supabase
    .from('predictions')
    .insert([{ user_email, match_id, pred_score_a, pred_score_b }])

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// GET /api/predictions/:email
router.get('/:email', async (req, res) => {
  const { email } = req.params
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_email', email)

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

export default router
