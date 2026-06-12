import express from 'express'
import matchesRoutes from './backend/routes/matches.js'
import predictionsRoutes from './backend/routes/predictions.js'
import pointsRoutes from './backend/routes/points.js'

const app = express()
app.use(express.json())

app.use('/api/matches', matchesRoutes)
app.use('/api/predictions', predictionsRoutes)
app.use('/api/points', pointsRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`))
