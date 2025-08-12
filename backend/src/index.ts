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

app.use(cors());
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
