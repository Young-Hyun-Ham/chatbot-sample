import express from 'express';
import cors from 'cors';

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// Vercel이 서버리스 함수 환경에서 실행 중인지 확인하기 위한 로그
console.log('Express app initialized. Setting up routes...');

// 테스트할 API 경로
app.get('/api/hello', (req, res) => {
  console.log('✅ Request to /api/hello received!');
  res.status(200).json({
    message: 'Hello from the simplified Vercel API!',
    timestamp: new Date().toISOString(),
  });
});

// 루트 경로 핸들러
app.get('/api', (req, res) => {
    console.log('✅ Request to /api (root) received!');
    res.status(200).send('API Server is running!');
});


// 로컬 개발 환경에서만 서버를 실행합니다.
// Vercel 환경에서는 이 코드가 실행되지 않습니다.
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Local server is running for development at http://localhost:${port}`);
  });
}

// Vercel이 사용할 수 있도록 Express 앱을 내보냅니다.
export default app;