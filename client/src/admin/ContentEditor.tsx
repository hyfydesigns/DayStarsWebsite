import { useEffect, useState } from 'react';
import api, { fetchContent } from '../api/client';
import type { SiteContent } from '../api/client';
import { Save, CheckCircle } from 'lucide-react';

type Section = { label: string; keys: { key: string; label: string; multiline?: boolean }[] };

const sections: Section[] = [
  {
    label: 'Hero Section',
    keys: [
      { key: 'hero.headline', label: 'Headline' },
      { key: 'hero.subheadline', label: 'Subheadline', multiline: true },
      { key: 'hero.cta_primary', label: 'Primary Button Text' },
      { key: 'hero.cta_secondary', label: 'Secondary Button Text' },
    ],
  },
  {
    label: 'About Section',
    keys: [
      { key: 'about.title', label: 'Section Title' },
      { key: 'about.history', label: 'History Paragraph', multiline: true },
      { key: 'about.mission', label: 'Mission Statement', multiline: true },
      { key: 'about.vision', label: 'Vision Statement', multiline: true },
      { key: 'about.licensed_since', label: 'Case Mgmt Licensed Since' },
    ],
  },
  {
    label: 'Statistics',
    keys: [
      { key: 'stats.clients_served', label: 'Clients Served' },
      { key: 'stats.years_operating', label: 'Years Operating' },
      { key: 'stats.staff_members', label: 'Staff Members' },
      { key: 'stats.locations', label: 'Locations' },
    ],
  },
  {
    label: 'Contact Information',
    keys: [
      { key: 'contact.phone', label: 'Phone Number' },
      { key: 'contact.email', label: 'Email Address' },
      { key: 'contact.address', label: 'Address' },
      { key: 'contact.hours', label: 'Hours of Operation' },
    ],
  },
];

export default function ContentEditor() {
  const [content, setContent] = useState<SiteContent>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent().then(setContent);
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent(c => ({ ...c, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await api.put('/content', content);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Site Content</h1>
          <p className="text-gray-500 text-sm mt-1">Edit text content across your website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}</>}
        </button>
      </div>
      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-display font-semibold text-gray-900 mb-5 pb-4 border-b border-gray-100">{section.label}</h2>
            <div className="space-y-4">
              {section.keys.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      value={content[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={content[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
