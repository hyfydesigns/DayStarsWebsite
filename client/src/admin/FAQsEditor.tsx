import { useEffect, useState } from 'react';
import api, { fetchFaqs } from '../api/client';
import type { FAQ } from '../api/client';
import { Plus, Trash2, Save, X } from 'lucide-react';

type EditingFAQ = Omit<FAQ, 'id'> & { id?: number };
const blank = (): EditingFAQ => ({ question: '', answer: '', sort_order: 0 });

export default function FAQsEditor() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<EditingFAQ | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchFaqs().then(setFaqs);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await api.put(`/faqs/${editing.id}`, editing);
    } else {
      await api.post('/faqs', editing);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this FAQ?')) return;
    await api.delete(`/faqs/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500 text-sm mt-1">Manage frequently asked questions.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={15} /> Add FAQ
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-gray-900 text-lg">{editing.id ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input type="text" value={editing.question} onChange={e => setEditing(f => f && ({ ...f, question: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea rows={4} value={editing.answer} onChange={e => setEditing(f => f && ({ ...f, answer: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input type="number" value={editing.sort_order} onChange={e => setEditing(f => f && ({ ...f, sort_order: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map(f => (
          <div key={f.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 mb-1 text-sm">{f.question}</div>
                <div className="text-gray-500 text-xs leading-relaxed line-clamp-2">{f.answer}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(f)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 font-medium">Edit</button>
                <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-600 border border-red-100 p-1.5 rounded-lg"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
