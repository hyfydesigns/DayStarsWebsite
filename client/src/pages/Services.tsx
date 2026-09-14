import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ClipboardList, Heart, Users, Search, Shield, Phone, ArrowRight, Activity, Pill, Stethoscope, MessageCircle, Network, FileText, Globe, Leaf, CheckCircle } from 'lucide-react';
import { fetchServices } from '../api/client';
import type { Service } from '../api/client';

const iconMap: Record<string, React.ElementType> = {
  Brain, ClipboardList, Heart, Users, Search, Shield,
  Activity, Pill, Stethoscope, MessageCircle, Network, FileText, Phone, Globe, Leaf, CheckCircle,
};

const iconStyles = [
  { bg: 'bg-[#2B6CB0]', shadow: 'shadow-[0_8px_24px_rgba(43,108,176,0.35)]' },
  { bg: 'bg-[#9B2070]', shadow: 'shadow-[0_8px_24px_rgba(155,32,112,0.35)]' },
  { bg: 'bg-[#7DB83A]', shadow: 'shadow-[0_8px_24px_rgba(125,184,58,0.35)]' },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  return (
    <div className="pt-20 lg:pt-28">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-teal-800 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-primary-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
            What We Offer
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            Comprehensive Mental Health Services
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed max-w-2xl mx-auto">
            We offer a full continuum of behavioral health services delivered by licensed, compassionate professionals who are committed to your recovery.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-8">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Brain;
              const style = iconStyles[i % 3];
              const card = (
                <div className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex gap-6 group transition-all duration-300 ${service.coming_soon ? 'opacity-75' : 'hover:shadow-lg hover:-translate-y-1'}`}>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.bg} ${style.shadow} transition-transform duration-300 ${!service.coming_soon && 'group-hover:scale-105'}`}>
                    <Icon size={38} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div className="pt-1 flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-display font-bold text-gray-900 text-lg leading-tight">{service.title}</h3>
                      {!!service.coming_soon && (
                        <span className="flex-shrink-0 mt-0.5 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">Coming Soon</span>
                      )}
                    </div>
                    <p className="text-gray-500 leading-relaxed text-sm">{service.description}</p>
                    {!service.coming_soon && (
                      <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-semibold mt-3 group-hover:gap-2 transition-all">Learn more <ArrowRight size={13} /></span>
                    )}
                  </div>
                </div>
              );
              return service.coming_soon
                ? <div key={service.id}>{card}</div>
                : <Link key={service.id} to={`/services/${service.slug}`}>{card}</Link>;
            })}
          </div>
        </div>
      </section>

      {/* Diagnoses */}
      <section className="py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Accepted Diagnoses</h2>
          <p className="text-gray-500 mb-10">We provide care for adults with any chronic mental illness, including:</p>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {['Major Depression', 'Bipolar Disorder', 'Schizophrenia', 'Schizoaffective Disorder', 'Co-occurring Substance Abuse', 'Other Chronic Mental Illness'].map(d => (
              <div key={d} className="flex items-center gap-3 bg-primary-50 rounded-xl px-5 py-4">
                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-primary-800 font-medium text-sm">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">Need Help? We're Here 24/7</h2>
          <p className="text-primary-200 mb-8">Contact us to start the enrollment process or to learn more about our services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:2819037691" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3.5 rounded-full">
              <Phone size={16} /> 281-903-7691
            </a>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white/10">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
