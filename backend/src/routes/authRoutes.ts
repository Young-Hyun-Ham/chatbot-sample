// src/routes/authRoutes.ts

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 조회
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    }

    const user = result.rows[0];

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    }

    console.log('로그인 성공!');
    // (선택) JWT 발급 또는 그냥 사용자 정보 반환
    return res.json({
      message: '로그인 성공',
      email: user.email,
      username: user.username,
      token: 'fake-token', // 추후 JWT로 교체 가능
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: '모든 값을 입력하세요.' });
  }

  try {
    // 이메일 중복 체크
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 저장
    await pool.query(
      'INSERT INTO users (email, password, username) VALUES ($1, $2, $3)',
      [email, hashedPassword, username]
    );

    return res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('회원가입 오류:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
});


export default router;
