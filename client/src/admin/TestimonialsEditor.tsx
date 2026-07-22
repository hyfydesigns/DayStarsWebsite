import { useEffect, useState } from 'react';
import api, { fetchTestimonials } from '../api/client';
import type { Testimonial } from '../api/client';
import { Plus, Trash2, Save, X } from 'lucide-react';

type EditingT = Omit<Testimonial, 'id'> & { id?: number };
const blank = (): EditingT => ({ quote: '', author: '', sort_order: 0 });

export default function TestimonialsEditor() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<EditingT | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchTestimonials().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await api.put(`/testimonials/${editing.id}`, editing);
    } else {
      await api.post('/testimonials', editing);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage client testimonials shown on the homepage.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-gray-900 text-lg">{editing.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                <textarea rows={4} value={editing.quote} onChange={e => setEditing(t => t && ({ ...t, quote: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input type="text" value={editing.author} onChange={e => setEditing(t => t && ({ ...t, author: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <input type="number" value={editing.sort_order} onChange={e => setEditing(t => t && ({ ...t, sort_order: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(t => (
          <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-medium">— {t.author}</span>
              <div className="flex gap-2">
                <button onClick={() => setEditing(t)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-red-500 border border-red-100 p-1.5 rounded-lg"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
