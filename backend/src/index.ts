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
  process.env.FRONTEND_URL,  // 운영 배포 도메인 (예: https://www.example.com)
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // Postman, 서버-서버 호출 등 Origin 없는 경우 허용
    if (!origin) return cb(null, true);
    if (whitelist.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],    // 필요 시
  credentials: false,                    // 쿠키/세션을 쓸 때만 true
  maxAge: 600,                          // preflight 캐시(초)
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight 대응

app.use(express.json());

// 기본 라우트
app.use('/api/auth', authRoutes);

// API 엔드포인트 등록
app.use('/api/chat', chatRoutes);

// scenario API 엔드포인트 등록
app.use('/api/scenario', scenarioRoutes);
app.use('/api/scenario-detail', scenarioDetailRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
