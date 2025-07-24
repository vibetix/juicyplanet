import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import adminRoutes from './admin/routes/adminRoutes';
import userRoutes from './user/routes/userRoutes';


// ✅ Debug path resolution
console.log('ENV CHECK →', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY?.slice(0, 10) + '...',
  PORT: process.env.PORT
});


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.get('/', (_req, res) => {
  res.send('Backend is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
