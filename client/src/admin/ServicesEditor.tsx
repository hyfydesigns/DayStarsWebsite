import { useEffect, useState } from 'react';
import api, { fetchServices } from '../api/client';
import type { Service } from '../api/client';
import { Plus, Trash2, Save, X } from 'lucide-react';

const ICONS = ['Brain', 'Activity', 'ClipboardList', 'Pill', 'Stethoscope', 'MessageCircle', 'Shield', 'Users', 'Network', 'FileText', 'Phone', 'Heart', 'Globe', 'CheckCircle', 'Leaf', 'Search'];

type EditingService = Omit<Service, 'id'> & { id?: number };

const blank = (): EditingService => ({
  title: '', description: '', icon: 'Brain', sort_order: 0,
  image_url: '', long_description: '', bullet_points: '[]', who_it_helps: '', coming_soon: 0, slug: '',
});

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<EditingService | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulletsText, setBulletsText] = useState(''); // one per line

  const load = () => fetchServices().then(setServices);
  useEffect(() => { load(); }, []);

  const openEdit = (s: EditingService) => {
    setEditing(s);
    try {
      const arr: string[] = JSON.parse(s.bullet_points || '[]');
      setBulletsText(arr.join('\n'));
    } catch { setBulletsText(''); }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      ...editing,
      bullet_points: JSON.stringify(bulletsText.split('\n').map(l => l.trim()).filter(Boolean)),
    };
    if (editing.id) {
      await api.put(`/services/${editing.id}`, payload);
    } else {
      await api.post('/services', payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the services displayed on your website.</p>
        </div>
        <button onClick={() => openEdit(blank())} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-gray-900 text-lg">{editing.id ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Basic info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" value={editing.title} onChange={e => setEditing(s => s && ({ ...s, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description <span className="text-gray-400 font-normal">(shown on cards)</span></label>
                <textarea rows={2} value={editing.description} onChange={e => setEditing(s => s && ({ ...s, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <select value={editing.icon} onChange={e => setEditing(s => s && ({ ...s, icon: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {ICONS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <input type="number" value={editing.sort_order} onChange={e => setEditing(s => s && ({ ...s, sort_order: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={!!editing.coming_soon} onChange={e => setEditing(s => s && ({ ...s, coming_soon: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded accent-amber-500" />
                <span className="text-sm font-medium text-gray-700">Mark as <span className="text-amber-600">Coming Soon</span> <span className="text-gray-400 font-normal">(shows badge, disables link)</span></span>
              </label>

              {/* Detail page fields */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Detail Page Content</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                    <input type="url" value={editing.image_url} onChange={e => setEditing(s => s && ({ ...s, image_url: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://images.unsplash.com/..." />
                    {editing.image_url && (
                      <img src={editing.image_url} alt="Preview" className="mt-2 h-28 w-full object-cover rounded-xl" />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description <span className="text-gray-400 font-normal">(shown on detail page)</span></label>
                    <textarea rows={4} value={editing.long_description} onChange={e => setEditing(s => s && ({ ...s, long_description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's Included <span className="text-gray-400 font-normal">(one bullet point per line)</span>
                    </label>
                    <textarea
                      rows={5}
                      value={bulletsText}
                      onChange={e => setBulletsText(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono"
                      placeholder={"Licensed therapists on staff\nDaily individual sessions\nGroup therapy available"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Who This Service Helps</label>
                    <textarea rows={2} value={editing.who_it_helps} onChange={e => setEditing(s => s && ({ ...s, who_it_helps: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving…' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-4 font-semibold text-gray-600">#</th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600">Service</th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 hidden md:table-cell">Detail Page</th>
              <th className="text-right px-5 py-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 text-gray-400">{s.sort_order}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{s.title}</span>
                    {!!s.coming_soon && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{s.description}</div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  {s.image_url
                    ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Complete</span>
                    : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">Missing content</span>
                  }
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => openEdit(s)} className="text-primary-600 hover:text-primary-700 font-medium mr-4 text-xs">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-600"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
