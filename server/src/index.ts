import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import servicesRoutes from './routes/services';
import teamRoutes from './routes/team';
import faqsRoutes from './routes/faqs';
import testimonialsRoutes from './routes/testimonials';
import contactRoutes from './routes/contact';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigin = process.env.CLIENT_URL;
app.use(cors({
  origin: allowedOrigin || true,  // true reflects the request origin; lock down in production via CLIENT_URL
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// TEMP: remove after use
app.get('/api/reset-admin-temp', (_req, res) => {
  const hash = bcrypt.hashSync('D@yStars2026!', 10);
  db.prepare('UPDATE admin_users SET password_hash=? WHERE username=?').run(hash, 'admin');
  res.json({ ok: true, newPassword: 'D@yStars2026!' });
});


app.listen(PORT, () => {
  console.log(`Day Stars API running on http://localhost:${PORT}`);
});