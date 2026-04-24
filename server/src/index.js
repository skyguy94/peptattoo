require('dotenv').config()
const express = require('express')
const cors = require('cors')
const designsRouter = require('./routes/designs')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/designs', designsRouter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
