import { useEffect, useState } from 'react';
import api from '../api/client';
import { Trash2, Mail, Phone, Clock, CheckCircle } from 'lucide-react';

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: number;
  created_at: string;
}

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get<Submission[]>('/contact').then(r => {
      setSubmissions(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await api.patch(`/contact/${id}/read`);
    setSubmissions(s => s.map(m => m.id === id ? { ...m, read: 1 } : m));
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this submission?')) return;
    await api.delete(`/contact/${id}`);
    setSubmissions(s => s.filter(m => m.id !== id));
  };

  const unread = submissions.filter(s => !s.read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-500 text-sm mt-1">
          Messages submitted via the contact form.
          {unread > 0 && <span className="ml-2 inline-flex items-center bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">{unread} unread</span>}
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Loading…</div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Mail size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(s => (
            <div key={s.id} className={`bg-white rounded-2xl border shadow-sm p-6 ${s.read ? 'border-gray-100' : 'border-primary-200 ring-1 ring-primary-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{s.name}</span>
                    {!s.read && <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">New</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                      <Mail size={13} /> {s.email}
                    </a>
                    {s.phone && (
                      <a href={`tel:${s.phone.replace(/\D/g, '')}`} className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                        <Phone size={13} /> {s.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Clock size={13} /> {new Date(s.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{s.message}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!s.read && (
                    <button
                      onClick={() => markRead(s.id)}
                      title="Mark as read"
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                    >
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => remove(s.id)}
                    title="Delete"
                    className="p-2 rounded-lg border border-red-100 text-red-400 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                <a
                  href={`mailto:${s.email}?subject=Re: Your message to Day Stars, Inc.`}
                  onClick={() => !s.read && markRead(s.id)}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Mail size={13} /> Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
