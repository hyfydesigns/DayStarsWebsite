import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { fetchContent } from '../api/client';
import type { SiteContent } from '../api/client';

export default function Contact() {
  const [content, setContent] = useState<SiteContent>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchContent().then(setContent);
  }, []);

  const c = content;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to an email API or backend endpoint
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="pt-20 lg:pt-28">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-teal-800 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-primary-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            We're Here to Help
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Ready to take the first step? Contact us to learn more about our services and the enrollment process. Our 24/7 crisis support line is available for clients who need behavioral-health support outside of regular business hours.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Phone</div>
                    <a href={`tel:${(c['contact.phone'] || '281-903-7691').replace(/-/g, '')}`} className="text-gray-600 hover:text-primary-600 transition-colors">
                      {c['contact.phone'] || '281-903-7691'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Email</div>
                    <a href={`mailto:${c['contact.email'] || 'info@daystarsinc.com'}`} className="text-gray-600 hover:text-primary-600 transition-colors">
                      {c['contact.email'] || 'info@daystarsinc.com'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Location</div>
                    <p className="text-gray-600">{c['contact.address'] || '4611 S Main Suite 4 & 8, Stafford, Texas'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Hours</div>
                    <p className="text-gray-600">{c['contact.hours'] || '24/7 – We are always available'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-primary-50 rounded-2xl border border-primary-100">
                <h3 className="font-semibold text-gray-900 mb-2">Immediate Help Available</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If you or someone you know is experiencing a mental health crisis, please call us immediately at{' '}
                  <a href="tel:2819037691" className="text-primary-600 font-semibold">281-903-7691</a>. We're here around the clock.
                </p>
              </div>

              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80&auto=format&fit=crop"
                alt="Caring team ready to help"
                className="mt-8 rounded-2xl w-full h-52 object-cover shadow-sm"
              />
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
              {submitted ? (
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
                  <CheckCircle size={48} className="text-teal-500 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-gray-900 text-xl mb-2">Message Received!</h3>
                  <p className="text-gray-600">Thank you for reaching out. Our team will get back to you very soon.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-primary-600 font-medium hover:underline text-sm">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="Your phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send size={16} /> Send Message
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Your information is kept strictly confidential. We never share personal data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
