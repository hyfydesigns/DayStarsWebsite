import { Router, Request, Response } from 'express';
import { Resend } from 'resend';
import db from '../db';
import { verifyToken } from '../auth';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'info@daystarsinc.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

// Public: submit contact form
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone = '', message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  // Save to DB
  const result = db.prepare(
    'INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)'
  ).run(name, email, phone, message);

  // Send email notification (non-blocking — don't fail the request if email fails)
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Submitted via daystarsinc.com contact form</p>
      `,
    });
  } catch (err) {
    console.error('Resend error (submission still saved):', err);
  }

  res.json({ id: result.lastInsertRowid });
});

// Admin: list submissions
router.get('/', verifyToken, (_req: Request, res: Response): void => {
  const rows = db.prepare(
    'SELECT * FROM contact_submissions ORDER BY created_at DESC'
  ).all();
  res.json(rows);
});

// Admin: mark as read
router.patch('/:id/read', verifyToken, (req: Request, res: Response): void => {
  db.prepare('UPDATE contact_submissions SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Admin: delete
router.delete('/:id', verifyToken, (req: Request, res: Response): void => {
  db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
