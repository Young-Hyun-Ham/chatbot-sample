// import express from 'express';
// import { pool } from '../db';
// const router = express.Router();

// // [GET] 시나리오 목록 조회
// router.get('/', async (req, res) => {
//   try{
//     // 전체 시나리오 목록 조회
//     const result = await pool.query(`
//       SELECT id, scenario_data, create_id, create_date, modify_id, modify_date
//       FROM scenario
//       ORDER BY create_date DESC
//     `);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching scenarios:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // [GET] 특정 시나리오 조회
// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!id) {
//       return res.status(400).json({ error: 'Scenario ID is required.' });
//     }
//     const result = await pool.query(
//       `
//       SELECT id, scenario_data, create_id, create_date, modify_id, modify_date
//       FROM scenario
//       WHERE id = $1
//       `,
//       [id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Scenario not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching scenarios:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // [POST] 새 시나리오 등록
// router.post('/', async (req, res) => {
//   const { scenario_data, create_id } = req.body;

//   if (!scenario_data || !create_id) {
//     return res.status(400).json({ error: 'scenario_data and create_id are required.' });
//   }

//   try {
//     const result = await pool.query(
//       `
//       INSERT INTO scenario (id, scenario_data, create_id, create_date)
//       VALUES (gen_random_uuid(), $1, $2, CURRENT_TIMESTAMP)
//       RETURNING *
//       `,
//       [scenario_data, create_id]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error('Error creating scenario:', error);
//     res.status(500).json({ error: 'Failed to create scenario' });
//   }
// });

// // [PUT] 시나리오 수정
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { scenario_data, modify_id } = req.body;

//   if (!scenario_data || !modify_id) {
//     return res.status(400).json({ error: 'scenario_data and modify_id are required.' });
//   }

//   try {
//     const result = await pool.query(
//       `
//       UPDATE scenario
//       SET scenario_data = $1,
//           modify_id = $2,
//           modify_date = CURRENT_TIMESTAMP
//       WHERE id = $3
//       RETURNING *
//       `,
//       [scenario_data, modify_id, id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Scenario not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating scenario:', error);
//     res.status(500).json({ error: 'Failed to update scenario' });
//   }
// });

// // [DELETE] 시나리오 삭제
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       `
//       DELETE FROM scenario
//       WHERE id = $1
//       RETURNING *
//       `,
//       [id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Scenario not found' });
//     }

//     res.json({ message: 'Scenario deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting scenario:', error);
//     res.status(500).json({ error: 'Failed to delete scenario' });
//   }
// });

// export default router;
