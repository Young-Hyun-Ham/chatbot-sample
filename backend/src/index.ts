// src/index.ts

import express from 'express';
import cors from 'cors';

// 라우터들을 먼저 import 합니다.
import authRoutes from './routes/authRoutes';
// import chatRoutes from './routes/chatRoutes';
// import scenarioRoutes from './routes/scenarioRoutes';
// import scenarioDetailRoutes from './routes/scenarioDetailRoutes';

const app = express();

// --- 1. 핵심 미들웨어 등록 ---
// CORS 설정
const whitelist = [
  'http://localhost:5173',
  'https://chatbot-frontend-ten-snowy.vercel.app',
  'https://chatbot-frontend-git-main-younghyunhams-projects.vercel.app',
  'chatbot-frontend-mn6yrot3d-younghyunhams-projects.vercel.app',
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

// JSON 파서
app.use(express.json());

// --- 2. 디버깅용 로깅 미들웨어 등록 ---
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.path}`);
  next();
});

// --- 3. 라우터 등록 ---
// Vercel이 자동으로 '/api'를 붙여주므로 여기서는 붙이지 않습니다.
app.use('/auth', authRoutes);
// app.use('/chat', chatRoutes);
// app.use('/scenario', scenarioRoutes);
// app.use('/scenario-detail', scenarioDetailRoutes);

// --- 4. 기본 동작 및 로컬 서버 실행 ---
export default app;

// 로컬 개발에서만 서버 포트 오픈
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Local server on http://localhost:${port}`));
}