import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import adminRoutes from './admin/routes/adminRoutes';
import userRoutes from './user/routes/userRoutes';

// ✅ Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ✅ Debug path resolution
console.log('ENV CHECK →', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY?.slice(0, 10) + '...',
  PORT: process.env.PORT
});

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ CORS config — allow frontend domain
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://juicyplanet.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.get('/', (_req, res) => {
  res.send('Backend is running 🚀');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
