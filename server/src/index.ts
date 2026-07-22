import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import servicesRoutes from './routes/services';
import teamRoutes from './routes/team';
import faqsRoutes from './routes/faqs';
import testimonialsRoutes from './routes/testimonials';

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

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Day Stars API running on http://localhost:${PORT}`);
});
