import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, ClipboardList, Heart, Users, Search, Shield, Quote, Phone, CheckCircle, Activity, Pill, Stethoscope, MessageCircle, Network, FileText, Globe, Leaf } from 'lucide-react';
import { fetchContent, fetchServices, fetchTestimonials } from '../api/client';
import type { SiteContent, Service, Testimonial } from '../api/client';

const iconMap: Record<string, React.ElementType> = {
  Brain, ClipboardList, Heart, Users, Search, Shield,
  Activity, Pill, Stethoscope, MessageCircle, Network, FileText, Phone, Globe, Leaf, CheckCircle,
};

// Cycles through logo brand colors
const iconStyles = [
  { bg: 'bg-[#2B6CB0]', shadow: 'shadow-[0_8px_24px_rgba(43,108,176,0.35)]' },
  { bg: 'bg-[#9B2070]', shadow: 'shadow-[0_8px_24px_rgba(155,32,112,0.35)]' },
  { bg: 'bg-[#7DB83A]', shadow: 'shadow-[0_8px_24px_rgba(125,184,58,0.35)]' },
];

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-1">{value}</div>
      <div className="text-primary-200 text-sm font-medium">{label}</div>
    </div>
  );
}

export default function Home() {
  const [content, setContent] = useState<SiteContent>({});
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    Promise.all([fetchContent(), fetchServices(), fetchTestimonials()]).then(([c, s, t]) => {
      setContent(c);
      setServices(s.slice(0, 6));
      setTestimonials(t);
    });
  }, []);

  const c = content;

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover scale-105"
          />
          {/* Lighter overlay so image shows through more vividly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c2a4a]/88 via-[#0c3a5a]/78 to-[#0f4a5a]/65" />
          {/* Subtle radial highlight in centre */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(125,184,58,0.08),transparent_70%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 lg:py-48">
          <div className="max-w-4xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-[#7DB83A]/20 text-[#b8e87a] text-sm font-semibold px-5 py-2 rounded-full mb-8 border border-[#7DB83A]/40 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#7DB83A] animate-pulse" />
              Community Mental Healthcare Center — Stafford, Texas
            </span>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-7 drop-shadow-lg">
              {c['hero.headline'] || 'Walking With You Toward Behavioral Strength'}
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed mb-12 max-w-2xl font-light">
              {c['hero.subheadline'] || 'A Community Mental Healthcare Center dedicated to helping individuals with behavioral and mental health challenges reclaim their lives.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/services" className="inline-flex items-center justify-center gap-2 bg-[#7DB83A] hover:bg-[#6aa530] text-white font-bold px-8 py-4 rounded-full transition-all text-base shadow-[0_8px_30px_rgba(125,184,58,0.45)] hover:shadow-[0_8px_40px_rgba(125,184,58,0.6)] hover:-translate-y-0.5">
                {c['hero.cta_primary'] || 'Our Services'} <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/25 transition-all text-base hover:-translate-y-0.5">
                {c['hero.cta_secondary'] || 'Contact Us'}
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-14 flex flex-wrap gap-6">
              {[
                { value: '500+', label: 'Clients Served' },
                { value: '19+', label: 'Years of Service' },
                { value: '24/7', label: 'Always Available' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="text-2xl font-display font-extrabold text-white">{stat.value}</div>
                  <div className="text-blue-200 text-sm leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-primary-700 to-teal-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            <StatCard value={c['stats.clients_served'] || '500+'} label="Clients Served" />
            <StatCard value={c['stats.years_operating'] || '19+'} label="Years of Service" />
            <StatCard value={c['stats.staff_members'] || '20+'} label="Clinical Staff" />
            <StatCard value={c['stats.locations'] || '1'} label="Location" />
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">About Us</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6 leading-tight">
                {c['about.title'] || 'About Day Stars, Inc.'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {c['about.history'] || 'Founded in 2005, Day Stars has been a pillar of mental health care in the Houston area for nearly two decades.'}
              </p>
              <div className="bg-primary-50 border-l-4 border-primary-500 p-5 rounded-r-xl mb-8">
                <p className="text-primary-800 italic font-medium text-base leading-relaxed">
                  "{c['about.mission'] || 'To walk with the challenged through their weaknesses to a place of behavioral strength.'}"
                </p>
                <p className="text-primary-600 text-sm mt-2 font-medium">— Our Mission</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Research-based, person-centered care',
                  'Licensed & accredited clinical staff',
                  'Conveniently located in Stafford, Texas',
                  'Serving clients since 2005',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                    <CheckCircle size={18} className="text-teal-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </div>
            {/* Decorative card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-600 to-teal-500 rounded-2xl p-8 text-white">
                <div className="text-6xl font-display font-bold text-white/20 mb-4">19+</div>
                <h3 className="text-2xl font-bold mb-3">Years of Compassionate Care</h3>
                <p className="text-primary-100 leading-relaxed mb-6">
                  Since 2005, we have been dedicated to improving mental health outcomes for individuals and families across the Houston area.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">TX</div>
                    <div className="text-primary-200 text-sm">Stafford, Texas</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-primary-200 text-sm">Availability</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-100 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-100 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">What We Offer</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Comprehensive Mental Health Services
            </h2>
            <p className="text-gray-500 leading-relaxed">
              We provide a full continuum of behavioral health services designed to support recovery, independence, and well-being.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Brain;
              const style = iconStyles[i % 3];
              const card = (
                <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group transition-all duration-300 ${service.coming_soon ? 'opacity-75' : 'hover:shadow-lg hover:-translate-y-1'}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${style.bg} ${style.shadow} transition-transform duration-300 ${!service.coming_soon && 'group-hover:scale-110'}`}>
                    <Icon size={32} className="text-white" strokeWidth={1.75} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-bold text-gray-900 text-base">{service.title}</h3>
                    {!!service.coming_soon && <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Soon</span>}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                  {!service.coming_soon && <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-semibold mt-4 group-hover:gap-2 transition-all">Learn more <ArrowRight size={13} /></span>}
                </div>
              );
              return service.coming_soon
                ? <div key={service.id}>{card}</div>
                : <Link key={service.id} to={`/services/${service.slug}`} className="block">{card}</Link>;
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Stories</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
                Voices of Recovery
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-gray-50 rounded-2xl p-7 relative">
                  <Quote size={32} className="text-primary-200 mb-4" />
                  <p className="text-gray-700 leading-relaxed mb-5 text-sm">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">{t.author[0]}</span>
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{t.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Take the First Step?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
            Our compassionate team is available 24/7. Reach out today — we're here to walk with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:2819037691" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-7 py-4 rounded-full hover:bg-primary-50 transition-colors">
              <Phone size={18} /> Call 281-903-7691
            </a>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-7 py-4 rounded-full hover:bg-white/20 transition-colors">
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
