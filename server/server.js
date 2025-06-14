import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRoutes from './routes/userRoutes.js';

await connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get('/api/health', (_req, res) => res.json({ ok:true }));

app.use('/api/user', userRoutes);

// optional root page
app.get('/', (_req, res) =>
  res.send('🚀 Imagify API is live. Try GET /api/health')
);

const port = process.env.PORT||4000;
app.listen(port,()=>console.log(`Listening ${port}`));
