import { Router, Request, Response } from 'express';
import db from '../db';
import { verifyToken } from '../auth';

const router = Router();

// Public: get all content as a flat object
router.get('/', (_req: Request, res: Response): void => {
  const rows = db.prepare('SELECT key, value FROM site_content').all() as { key: string; value: string }[];
  const content: Record<string, string> = {};
  for (const row of rows) content[row.key] = row.value;
  res.json(content);
});

// Admin: update a content key
router.put('/:key', verifyToken, (req: Request, res: Response): void => {
  const { key } = req.params;
  const { value } = req.body;
  if (!value && value !== '') {
    res.status(400).json({ error: 'Value required' });
    return;
  }
  db.prepare(`INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(key, value);
  res.json({ key, value });
});

// Admin: bulk update
router.put('/', verifyToken, (req: Request, res: Response): void => {
  const updates: Record<string, string> = req.body;
  const upsert = db.prepare(`INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`);
  const transaction = db.transaction((data: Record<string, string>) => {
    for (const [key, value] of Object.entries(data)) upsert.run(key, value);
  });
  transaction(updates);
  res.json({ success: true });
});

export default router;
