import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Brain, ClipboardList, Heart, Users, Search, Shield, ArrowLeft, ArrowRight, CheckCircle, Phone, HelpCircle, Activity, Pill, Stethoscope, MessageCircle, Network, FileText, Globe, Leaf } from 'lucide-react';
import { fetchService, fetchServices } from '../api/client';
import type { Service } from '../api/client';

const iconMap: Record<string, React.ElementType> = {
  Brain, ClipboardList, Heart, Users, Search, Shield,
  Activity, Pill, Stethoscope, MessageCircle, Network, FileText, Phone, Globe, Leaf, CheckCircle,
};

const iconStyles = [
  { bg: 'bg-[#2B6CB0]', shadow: 'shadow-[0_8px_24px_rgba(43,108,176,0.4)]', light: 'bg-blue-50', text: 'text-[#2B6CB0]' },
  { bg: 'bg-[#9B2070]', shadow: 'shadow-[0_8px_24px_rgba(155,32,112,0.4)]', light: 'bg-pink-50',  text: 'text-[#9B2070]' },
  { bg: 'bg-[#7DB83A]', shadow: 'shadow-[0_8px_24px_rgba(125,184,58,0.4)]',  light: 'bg-green-50', text: 'text-[#7DB83A]' },
];

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchService(id), fetchServices()]).then(([svc, all]) => {
      setService(svc);
      setAllServices(all);
      setLoading(false);
    }).catch(() => navigate('/services'));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) return null;

  const Icon = iconMap[service.icon] || Brain;
  const idx = allServices.findIndex(s => s.id === service.id);
  const style = iconStyles[idx % 3];
  const bullets: string[] = (() => {
    try { return JSON.parse(service.bullet_points); } catch { return []; }
  })();
  const otherServices = allServices.filter(s => s.id !== service.id).slice(0, 3);

  return (
    <div className="pt-20 lg:pt-28">

      {/* Hero */}
      <section className="relative h-[420px] lg:h-[520px] overflow-hidden">
        {service.image_url ? (
          <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-800 to-teal-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/services" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <ArrowLeft size={15} /> All Services
            </Link>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.bg} ${style.shadow}`}>
                <Icon size={32} className="text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Day Stars Service</p>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-white leading-tight">{service.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Overview */}
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {service.long_description || service.description}
                </p>
              </div>

              {/* What's included */}
              {bullets.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {bullets.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3.5">
                        <CheckCircle size={18} className={`${style.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-sm leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Who it helps */}
              {service.who_it_helps && (
                <div className={`${style.light} rounded-2xl p-7 border border-opacity-20`}>
                  <div className="flex items-start gap-3">
                    <HelpCircle size={22} className={`${style.text} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className="font-display font-bold text-gray-900 mb-2 text-lg">Who This Service Helps</h3>
                      <p className="text-gray-600 leading-relaxed">{service.who_it_helps}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* CTA card */}
              <div className="bg-gradient-to-br from-primary-700 to-teal-600 rounded-2xl p-7 text-white sticky top-32">
                <h3 className="font-display font-bold text-xl mb-3">Ready to Get Started?</h3>
                <p className="text-primary-100 text-sm leading-relaxed mb-6">
                  Contact our team today to learn more about this service and how we can help you or your loved one.
                </p>
                <div className="space-y-3">
                  <a href="tel:2819037691" className="flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-5 py-3 rounded-full text-sm hover:bg-primary-50 transition-colors w-full">
                    <Phone size={15} /> Call 281-903-7691
                  </a>
                  <Link to="/contact" className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-5 py-3 rounded-full text-sm hover:bg-white/20 transition-colors w-full">
                    Send a Message
                  </Link>
                </div>
              </div>

              {/* Other services */}
              {otherServices.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-display font-semibold text-gray-900 mb-4 text-base">Other Services</h3>
                  <div className="space-y-3">
                    {otherServices.map((s) => {
                      const OtherIcon = iconMap[s.icon] || Brain;
                      const otherStyle = iconStyles[allServices.findIndex(a => a.id === s.id) % 3];
                      return (
                        <Link key={s.id} to={`/services/${s.id}`} className="flex items-center gap-3 group">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${otherStyle.bg} transition-transform group-hover:scale-105`}>
                            <OtherIcon size={18} className="text-white" strokeWidth={1.75} />
                          </div>
                          <span className="text-gray-700 text-sm font-medium group-hover:text-primary-600 transition-colors leading-snug">{s.title}</span>
                        </Link>
                      );
                    })}
                    <Link to="/services" className="flex items-center gap-1 text-primary-600 text-sm font-semibold pt-1 hover:text-primary-700 transition-colors">
                      View all services <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
