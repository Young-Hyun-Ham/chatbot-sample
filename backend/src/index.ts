// src/index.ts
import express from 'express';
import cors from 'cors';

const app = express();

// CORS 설정 (프론트 도메인만 허용)
const whitelist = [
  'http://localhost:5173',
  'https://chatbot-frontend-ten-snowy.vercel.app',
].filter(Boolean) as string[];

app.use((req, res, next) => { res.setHeader('Vary', 'Origin'); next(); });
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    cb(null, whitelist.includes(origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
  maxAge: 600,
}));
app.options('*', cors());
app.use(express.json());

// ❗여기서는 '/api'를 붙이지 마세요 (Vercel이 자동으로 붙임)
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import scenarioRoutes from './routes/scenarioRoutes';
import scenarioDetailRoutes from './routes/scenarioDetailRoutes';

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/scenario', scenarioRoutes);
app.use('/scenario-detail', scenarioDetailRoutes);

export default app;

// 로컬 개발에서만 서버 포트 오픈
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Local server on http://localhost:${port}`));
}
