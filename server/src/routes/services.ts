import { Router, Request, Response } from 'express';
import db from '../db';
import { verifyToken } from '../auth';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all();
  res.json(services);
});

router.get('/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;
  // Support lookup by slug (SEO) or numeric id (legacy/admin)
  const service = /^\d+$/.test(slug)
    ? db.prepare('SELECT * FROM services WHERE id = ?').get(slug)
    : db.prepare('SELECT * FROM services WHERE slug = ?').get(slug);
  if (!service) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(service);
});

function makeSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

router.post('/', verifyToken, (req: Request, res: Response): void => {
  const { title, description, icon, sort_order = 0, image_url = '', long_description = '', bullet_points = '[]', who_it_helps = '', coming_soon = 0 } = req.body;
  const slug = makeSlug(title);
  const result = db.prepare('INSERT INTO services (title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, coming_soon, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, coming_soon, slug);
  res.json({ id: result.lastInsertRowid, title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, coming_soon, slug });
});

router.put('/:id', verifyToken, (req: Request, res: Response): void => {
  const { id } = req.params;
  const { title, description, icon, sort_order, image_url = '', long_description = '', bullet_points = '[]', who_it_helps = '', coming_soon = 0 } = req.body;
  const slug = makeSlug(title);
  db.prepare('UPDATE services SET title=?, description=?, icon=?, sort_order=?, image_url=?, long_description=?, bullet_points=?, who_it_helps=?, coming_soon=?, slug=? WHERE id=?').run(title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, coming_soon, slug, id);
  res.json({ id: Number(id), title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, coming_soon, slug });
});

router.delete('/:id', verifyToken, (req: Request, res: Response): void => {
  db.prepare('DELETE FROM services WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

export default router;
