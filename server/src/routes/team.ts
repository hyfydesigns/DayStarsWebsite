import { Router, Request, Response } from 'express';
import db from '../db';
import { verifyToken } from '../auth';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  const members = db.prepare('SELECT * FROM team_members ORDER BY sort_order ASC').all();
  res.json(members);
});

router.post('/', verifyToken, (req: Request, res: Response): void => {
  const { name, title, bio = '', image_url = '', sort_order = 0, coming_soon = 0 } = req.body;
  const result = db.prepare('INSERT INTO team_members (name, title, bio, image_url, sort_order, coming_soon) VALUES (?, ?, ?, ?, ?, ?)').run(name, title, bio, image_url, sort_order, coming_soon);
  res.json({ id: result.lastInsertRowid, name, title, bio, image_url, sort_order, coming_soon });
});

router.put('/:id', verifyToken, (req: Request, res: Response): void => {
  const { id } = req.params;
  const { name, title, bio, image_url, sort_order, coming_soon = 0 } = req.body;
  db.prepare('UPDATE team_members SET name=?, title=?, bio=?, image_url=?, sort_order=?, coming_soon=? WHERE id=?').run(name, title, bio, image_url, sort_order, coming_soon, id);
  res.json({ id: Number(id), name, title, bio, image_url, sort_order, coming_soon });
});

router.delete('/:id', verifyToken, (req: Request, res: Response): void => {
  db.prepare('DELETE FROM team_members WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

export default router;
