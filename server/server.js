// server/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import userRouter  from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

await connectDB()

const app = express()

// Allow your Vercel client origin (or '*' for dev)
app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json())

// --- HEALTH CHECK (for your client to call) ---
app.get('/api/health', (_req, res) => {
  return res.json({ ok: true })
})

// --- YOUR API MOUNTING ---
app.use('/api/user',  userRouter)
app.use('/api/image', imageRouter)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`🚀 API listening on ${port}`))
