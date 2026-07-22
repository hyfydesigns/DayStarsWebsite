import { Router, Request, Response } from 'express';
import db from '../db';
import { verifyToken } from '../auth';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  const faqs = db.prepare('SELECT * FROM faqs ORDER BY sort_order ASC').all();
  res.json(faqs);
});

router.post('/', verifyToken, (req: Request, res: Response): void => {
  const { question, answer, sort_order = 0 } = req.body;
  const result = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)').run(question, answer, sort_order);
  res.json({ id: result.lastInsertRowid, question, answer, sort_order });
});

router.put('/:id', verifyToken, (req: Request, res: Response): void => {
  const { id } = req.params;
  const { question, answer, sort_order } = req.body;
  db.prepare('UPDATE faqs SET question=?, answer=?, sort_order=? WHERE id=?').run(question, answer, sort_order, id);
  res.json({ id: Number(id), question, answer, sort_order });
});

router.delete('/:id', verifyToken, (req: Request, res: Response): void => {
  db.prepare('DELETE FROM faqs WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

export default router;
