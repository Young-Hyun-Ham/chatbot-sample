import { Pool } from 'pg'; import dotenv from 'dotenv';
dotenv.config();

console.log('DB_HOST(raw )=', JSON.stringify(process.env.DB_HOST));
console.log('DB_HOST(trim)=', JSON.stringify(process.env.DB_HOST?.trim()));
console.log(JSON.stringify(process.env.DB_HOST)); 

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST?.trim(),
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
      }
);

// 헬스체크
pool.query('select 1').then(() => console.log('✅ DB OK')).catch(err => console.error('❌ DB FAIL', err));
