import { Router, Request, Response } from 'express';
import db from '../db';
import { verifyToken } from '../auth';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all();
  res.json(services);
});

router.get('/:id', (req: Request, res: Response): void => {
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!service) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(service);
});

router.post('/', verifyToken, (req: Request, res: Response): void => {
  const { title, description, icon, sort_order = 0, image_url = '', long_description = '', bullet_points = '[]', who_it_helps = '' } = req.body;
  const result = db.prepare('INSERT INTO services (title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps);
  res.json({ id: result.lastInsertRowid, title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps });
});

router.put('/:id', verifyToken, (req: Request, res: Response): void => {
  const { id } = req.params;
  const { title, description, icon, sort_order, image_url = '', long_description = '', bullet_points = '[]', who_it_helps = '' } = req.body;
  db.prepare('UPDATE services SET title=?, description=?, icon=?, sort_order=?, image_url=?, long_description=?, bullet_points=?, who_it_helps=? WHERE id=?').run(title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, id);
  res.json({ id: Number(id), title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps });
});

router.delete('/:id', verifyToken, (req: Request, res: Response): void => {
  db.prepare('DELETE FROM services WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

export default router;
