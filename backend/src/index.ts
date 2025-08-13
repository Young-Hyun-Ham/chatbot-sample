// src/index.ts

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

// PG 풀은 기존에 쓰는 걸 재사용 (경로 맞춰주세요)
import { pool } from './db';

// 라우터
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import scenarioRoutes from './routes/scenarioRoutes';
import scenarioDetailRoutes from './routes/scenarioDetailRoutes';

const app = express();
const PgSession = connectPgSimple(session as any);

const isProd = process.env.NODE_ENV === 'production';

// --- 0. 리버스 프록시(예: Vercel) 뒤에서 secure 쿠키를 쓰기 위함 ---
app.set('trust proxy', 1);

// --- 1. CORS (세션 쿠키 전달을 위해 credentials: true) ---
const whitelist = [
  'http://localhost:5173',
  'https://chatbot-frontend-ten-snowy.vercel.app',
  'https://chatbot-frontend-git-main-younghyunhams-projects.vercel.app',
  'https://chatbot-frontend-mn6yrot3d-younghyunhams-projects.vercel.app',
  'https://chatbot-sample-git-main-younghyunhams-projects.vercel.app',
].filter(Boolean) as string[];

app.use((req, res, next) => { res.setHeader('Vary', 'Origin'); next(); });

app.use(
  cors({
    origin(origin, cb) {
      // 서버-서버 호출(Origin 없음)은 허용, 브라우저는 화이트리스트만 허용
      if (!origin) return cb(null, true);
      cb(null, whitelist.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,        // ★ 세션 쿠키 전달
    maxAge: 600,
  })
);

// --- 2. Body Parser ---
app.use(express.json());

// --- 3. 세션 전역 설정 (PG에 영구 저장) ---
app.use(
  session({
    store: new PgSession({
      pool,                    // 기존 PG Pool 재사용
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    cookie: {
      httpOnly: true,
      // 프론트/백이 서로 다른 도메인(서브도메인 포함)인 프로덕션에서는
      // cross-site 쿠키 허용을 위해 반드시 SameSite=None; Secure 필요
      secure: isProd,                  // HTTPS에서만
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7일
    },
  })
);

// --- 4. 디버깅용 로깅 ---
app.use((req, _res, next) => {
  console.log(`[Request] ${req.method} ${req.path}`);
  next();
});

// --- 5. 라우터 등록 ---
// (Vercel은 자동으로 '/api' prefix를 붙임. 여기서는 붙이지 않음)
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/scenario', scenarioRoutes);
app.use('/scenario-detail', scenarioDetailRoutes);

// 헬스체크 (선택)
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// --- 6. 기본 동작 및 로컬 서버 실행 ---
export default app;

if (!process.env.VERCEL && !isProd) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Local server on http://localhost:${port}`));
}
