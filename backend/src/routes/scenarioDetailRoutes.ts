// import express from 'express';
// import { pool } from '../db';

// const router = express.Router();

// // [POST] /api/scenario-detail - 섹션 데이터 저장
// router.post('/', async (req, res) => {
//   try {
//     const { scenario_id, data, create_id } = req.body;

//     if (!scenario_id || !data || !create_id) {
//       return res.status(400).json({ error: 'scenario_id, data, create_id are required.' });
//     }

//     const result = await pool.query(
//       `
//       INSERT INTO scenario_detail (id, scenario_id, data, create_id, create_date)
//       VALUES (gen_random_uuid(), $1, $2, $3, NOW())
//       RETURNING *
//       `,
//       [scenario_id, JSON.stringify(data), create_id]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error('Error saving scenario detail:', error);
//     res.status(500).json({ error: 'Failed to save scenario detail' });
//   }
// });

// export default router;
