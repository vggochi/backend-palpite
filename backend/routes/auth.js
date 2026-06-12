import express from 'express'
import { supabase } from '../supabase.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Preencha todos os campos.' })

  // Verifica se email já existe
  const { data: existing } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single()

  if (existing)
    return res.status(409).json({ error: 'E-mail já cadastrado.' })

  // Cria o usuário
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert([{ name, email, password }])
    .select()
    .single()

  if (userError)
    return res.status(400).json({ error: userError.message })

  // Cria registro de pontos com bônus inicial de 10 pontos
  const { error: pointsError } = await supabase
    .from('points')
    .insert([{ user_email: email, points: 10 }])

  if (pointsError)
    return res.status(400).json({ error: pointsError.message })

  res.status(201).json({
    message: 'Conta criada com sucesso!',
    user: { name: newUser.name, email: newUser.email },
    points: 10
  })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Preencha e-mail e senha.' })

  const { data: user, error } = await supabase
    .from('users')
    .select('name, email, password')
    .eq('email', email)
    .single()

  if (error || !user)
    return res.status(404).json({ error: 'Usuário não encontrado.' })

  if (user.password !== password)
    return res.status(401).json({ error: 'Senha incorreta.' })

  // Busca pontos do usuário
  const { data: pointsData } = await supabase
    .from('points')
    .select('points')
    .eq('user_email', email)
    .single()

  res.json({
    message: 'Login realizado com sucesso!',
    user: { name: user.name, email: user.email },
    points: pointsData?.points ?? 0
  })
})

export default router