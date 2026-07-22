import { Router, Request, Response } from 'express';
import db from '../db';
import { verifyToken } from '../auth';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY sort_order ASC').all();
  res.json(testimonials);
});

router.post('/', verifyToken, (req: Request, res: Response): void => {
  const { quote, author, sort_order = 0 } = req.body;
  const result = db.prepare('INSERT INTO testimonials (quote, author, sort_order) VALUES (?, ?, ?)').run(quote, author, sort_order);
  res.json({ id: result.lastInsertRowid, quote, author, sort_order });
});

router.put('/:id', verifyToken, (req: Request, res: Response): void => {
  const { id } = req.params;
  const { quote, author, sort_order } = req.body;
  db.prepare('UPDATE testimonials SET quote=?, author=?, sort_order=? WHERE id=?').run(quote, author, sort_order, id);
  res.json({ id: Number(id), quote, author, sort_order });
});

router.delete('/:id', verifyToken, (req: Request, res: Response): void => {
  db.prepare('DELETE FROM testimonials WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

export default router;
