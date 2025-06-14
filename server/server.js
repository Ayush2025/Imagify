// server/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// connect to MongoDB
import connectDB from './configs/mongodb.js'
await connectDB()

// import your routers
import userRouter  from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())

// mount your APIs under /api
app.use('/api/user',  userRouter)
app.use('/api/image', imageRouter)

// optional health-check
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// export for Vercel Serverless
export default app
