// src/db/index.ts 수정안

import { Pool } from 'pg';

// dotenv.config()는 Vercel 환경에서 불필요하므로 제거해도 무방합니다.
// 로컬 개발을 위해 남겨두어도 되지만, Vercel에서는 영향을 주지 않습니다.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('Attempting to create a new DB pool...');
console.log(`DATABASE_URL is set: ${!!process.env.DATABASE_URL}`);
console.log(`DB_HOST is set: ${!!process.env.DB_HOST}`);

let pool: Pool;

try {
  pool = new Pool(
    process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: process.env.DB_HOST?.trim(),
          port: Number(process.env.DB_PORT ?? 5432),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: { rejectUnauthorized: false }, // Supabase 등 외부 DB 연결 시 필요할 수 있음
        }
  );

  // 헬스체크
  pool.query('SELECT NOW()')
    .then(result => console.log('✅ DB connection successful. Server time:', result.rows[0].now))
    .catch(err => console.error('❌ DB query failed after connection.', err));

} catch (err) {
  console.error('❌ Failed to create DB Pool. Check environment variables.', err);
  // Pool 생성 실패 시, 앱이 정상적으로 동작할 수 없으므로 pool을 빈 객체로 만들거나
  // 에러를 던져서 서버리스 함수 실행을 확실히 중단시킬 수 있습니다.
  // 이 경우, Vercel 로그에 위 에러 메시지가 찍히게 됩니다.
  pool = {} as Pool; // 임시 할당, 실제 사용 시 에러 발생
}

export { pool };