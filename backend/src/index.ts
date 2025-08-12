// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';
import scenarioRoutes from './routes/scenarioRoutes';
import scenarioDetailRoutes from './routes/scenarioDetailRoutes';

import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// 허용 origin 목록(개발/운영 분리)
const whitelist = [
  'http://localhost:5173',   // Vite
  'https://chatbot-sample-git-v100-younghyunhams-projects.vercel.app',   // 개발
  'https://chatbot-frontend-ten-snowy.vercel.app',
  process.env.FRONTEND_URL,  // 운영 배포 도메인 (예: https://www.example.com)
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);                 // 서버-서버/포스트맨 허용
    return cb(null, whitelist.includes(origin));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // 쿠키 쓰면 true로
  maxAge: 600,
};

app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin'); // 캐시 분기
  next();
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// 기본 라우트
app.use('/auth', authRoutes);

// API 엔드포인트 등록
app.use('/chat', chatRoutes);

// scenario API 엔드포인트 등록
app.use('/scenario', scenarioRoutes);
app.use('/scenario-detail', scenarioDetailRoutes);

// app.listen(port, () => {
//   console.log(`🚀 Server is running on http://localhost:${port}`);
// });
