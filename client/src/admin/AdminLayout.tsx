import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, Users, HelpCircle, MessageSquare, Settings, LogOut, Menu, X, Eye } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Site Content', to: '/admin/content', icon: FileText },
  { label: 'Services', to: '/admin/services', icon: Briefcase },
  { label: 'Team Members', to: '/admin/team', icon: Users },
  { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
  { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquare },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { username, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-gray-800">
          <img src="/logo.png" alt="Day Stars, Inc." className="h-14 w-auto brightness-0 invert" />
          <div className="text-gray-400 text-xs mt-2">Admin Panel</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors mb-1">
            <Eye size={17} /> View Site
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
            <LogOut size={17} /> Sign Out ({username})
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(o => !o)} className="lg:hidden text-gray-500 hover:text-gray-700">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />
          <span className="text-sm text-gray-500">Signed in as <strong className="text-gray-700">{username}</strong></span>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
