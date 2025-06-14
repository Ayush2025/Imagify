// server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// — your routers —
import userRouter  from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

// connect to MongoDB (your existing code)
import connectDB from './configs/mongodb.js'
await connectDB()

const app = express()
app.use(cors())
app.use(express.json())

// mount your APIs under /api
app.use('/api/user',  userRouter)
app.use('/api/image', imageRouter)

// (optional) if you want a quick health-check:
// app.get('/api/health', (_req, res) => res.json({ ok: true }))

// serve React build for all other routes
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const clientDist = path.join(__dirname, 'client/dist')  // or 'client/build'

app.use(express.static(clientDist))

app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`🚀 Listening on ${port}`))
