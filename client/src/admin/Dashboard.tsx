import { Link } from 'react-router-dom';
import { FileText, Briefcase, Users, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';

const sections = [
  { label: 'Site Content', desc: 'Edit hero, about, contact info, stats', to: '/admin/content', icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { label: 'Services', desc: 'Add, edit, or remove services', to: '/admin/services', icon: Briefcase, color: 'bg-teal-50 text-teal-600' },
  { label: 'Team Members', desc: 'Manage leadership team profiles', to: '/admin/team', icon: Users, color: 'bg-purple-50 text-purple-600' },
  { label: 'FAQs', desc: 'Edit frequently asked questions', to: '/admin/faqs', icon: HelpCircle, color: 'bg-orange-50 text-orange-600' },
  { label: 'Testimonials', desc: 'Add or remove client testimonials', to: '/admin/testimonials', icon: MessageSquare, color: 'bg-green-50 text-green-600' },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Manage your website content below.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <Link key={s.to} to={s.to} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.label}</h3>
              <p className="text-gray-500 text-sm mb-4">{s.desc}</p>
              <div className="flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                Manage <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
