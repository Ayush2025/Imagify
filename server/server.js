import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import connectDB from './configs/mongodb.js'
import userRouter  from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())

// 1) quick health check, no DB required
app.get('/api/health', (_req, res) => {
  return res.json({ ok: true })
})

// 2) now connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })

// 3) mount your real APIs
app.use('/api/user',  userRouter)
app.use('/api/image', imageRouter)

// 4) serve React from /client/dist
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const clientDist = path.join(__dirname, 'client/dist')

app.use(express.static(clientDist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`🚀 Listening on ${port}`))
