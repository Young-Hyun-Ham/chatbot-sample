// // src/controllers/chatController.ts
// import { Request, Response } from 'express';
// import { pool } from '../db';

// export const getMessages = async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 20');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// };

// export const postMessage = async (req: Request, res: Response) => {
//   const { username, message } = req.body;

//   try {
//     const result = await pool.query(
//       'INSERT INTO messages (username, message) VALUES ($1, $2) RETURNING *',
//       [username, message]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to post message' });
//   }
// };
