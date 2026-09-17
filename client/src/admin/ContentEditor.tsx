import { useEffect, useState } from 'react';
import api, { fetchContent } from '../api/client';
import type { SiteContent } from '../api/client';
import { Save, CheckCircle } from 'lucide-react';

type Section = { label: string; keys: { key: string; label: string; multiline?: boolean }[] };

const sections: Section[] = [
  {
    label: 'Home Page — Hero',
    keys: [
      { key: 'hero.badge', label: 'Badge Text' },
      { key: 'hero.headline', label: 'Headline' },
      { key: 'hero.subheadline', label: 'Subheadline', multiline: true },
      { key: 'hero.cta_primary', label: 'Primary Button Text' },
      { key: 'hero.cta_secondary', label: 'Secondary Button Text' },
    ],
  },
  {
    label: 'Home Page — Intro',
    keys: [
      { key: 'home.intro_p1', label: 'Intro Paragraph 1', multiline: true },
      { key: 'home.intro_p2', label: 'Intro Paragraph 2', multiline: true },
      { key: 'home.intro_p3', label: 'Intro Paragraph 3', multiline: true },
      { key: 'home.about_bullets', label: 'About Bullets (one per line)', multiline: true },
    ],
  },
  {
    label: 'Home Page — Services & CTA',
    keys: [
      { key: 'home.services_heading', label: 'Services Section Heading' },
      { key: 'home.services_subtext', label: 'Services Section Subtext', multiline: true },
      { key: 'home.cta_heading', label: 'CTA Heading' },
      { key: 'home.cta_body', label: 'CTA Body', multiline: true },
    ],
  },
  {
    label: 'Services Page',
    keys: [
      { key: 'services.hero_heading', label: 'Hero Heading' },
      { key: 'services.hero_subtext', label: 'Hero Subtext', multiline: true },
      { key: 'services.diagnoses_heading', label: 'Diagnoses Section Heading' },
      { key: 'services.diagnoses_intro', label: 'Diagnoses Intro', multiline: true },
      { key: 'services.diagnoses_list', label: 'Diagnoses List (one per line)', multiline: true },
      { key: 'services.diagnoses_disclaimer', label: 'Diagnoses Disclaimer', multiline: true },
      { key: 'services.cta_heading', label: 'CTA Heading' },
      { key: 'services.cta_body', label: 'CTA Body', multiline: true },
    ],
  },
  {
    label: 'About Page',
    keys: [
      { key: 'about.title', label: 'Hero Title' },
      { key: 'about.history', label: 'Hero Subtitle', multiline: true },
      { key: 'about.mission', label: 'Mission Statement', multiline: true },
      { key: 'about.vision', label: 'Vision Statement', multiline: true },
      { key: 'about.milestone_2005', label: 'Milestone 2005', multiline: true },
      { key: 'about.milestone_2008', label: 'Milestone 2008', multiline: true },
      { key: 'about.milestone_2020', label: 'Milestone 2020', multiline: true },
      { key: 'about.licensed_since', label: 'Case Mgmt Licensed Since' },
      { key: 'about.objectives', label: 'Objectives (one per line)', multiline: true },
    ],
  },
  {
    label: 'Contact Page',
    keys: [
      { key: 'contact.hero_heading', label: 'Hero Heading' },
      { key: 'contact.hero_subtext', label: 'Hero Subtext', multiline: true },
      { key: 'contact.phone', label: 'Phone Number' },
      { key: 'contact.email', label: 'Email Address' },
      { key: 'contact.address', label: 'Address' },
      { key: 'contact.hours', label: 'Hours of Operation' },
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
