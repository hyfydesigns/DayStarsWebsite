import { useEffect, useState } from 'react';
import api, { fetchTeam } from '../api/client';
import type { TeamMember } from '../api/client';
import { Plus, Trash2, Save, X } from 'lucide-react';

type EditingMember = Omit<TeamMember, 'id'> & { id?: number };
const blank = (): EditingMember => ({ name: '', title: '', bio: '', image_url: '', sort_order: 0 });

export default function TeamEditor() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<EditingMember | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchTeam().then(setTeam);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await api.put(`/team/${editing.id}`, editing);
    } else {
      await api.post('/team', editing);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this team member?')) return;
    await api.delete(`/team/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the leadership team displayed on the About page.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={15} /> Add Member
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-gray-900 text-lg">{editing.id ? 'Edit Member' : 'Add Member'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={editing.name} onChange={e => setEditing(s => s && ({ ...s, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input type="text" value={editing.title} onChange={e => setEditing(s => s && ({ ...s, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea rows={3} value={editing.bio} onChange={e => setEditing(s => s && ({ ...s, bio: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                  <input type="url" value={editing.image_url} onChange={e => setEditing(s => s && ({ ...s, image_url: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <input type="number" value={editing.sort_order} onChange={e => setEditing(s => s && ({ ...s, sort_order: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                {m.image_url ? <img src={m.image_url} alt={m.name} className="w-12 h-12 rounded-full object-cover" /> : <span className="text-primary-600 font-bold text-sm">{m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{m.name}</div>
                <div className="text-primary-600 text-xs">{m.title}</div>
              </div>
            </div>
            {m.bio && <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{m.bio}</p>}
            <div className="flex gap-2">
              <button onClick={() => setEditing(m)} className="flex-1 text-xs border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 font-medium">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 p-2 rounded-lg"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
