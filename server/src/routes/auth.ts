import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db';
import { generateToken, verifyToken } from '../auth';

const router = Router();

router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' });
    return;
  }
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as any;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = generateToken(user.id, user.username);
  res.json({ token, username: user.username });
});

router.post('/change-password', verifyToken, (req: Request, res: Response): void => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user.id;
  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(userId) as any;
  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    res.status(401).json({ error: 'Current password incorrect' });
    return;
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, userId);
  res.json({ success: true });
});

router.get('/me', verifyToken, (req: Request, res: Response): void => {
  res.json({ user: (req as any).user });
});

export default router;
