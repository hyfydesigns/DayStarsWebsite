import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt="Day Stars, Inc." className="h-20 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              "To walk with the challenged through their weaknesses to a place of behavioral strength."
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Services', to: '/services' },
                { label: 'About Us', to: '/about' },
                { label: 'FAQs', to: '/faqs' },
                { label: 'Contact', to: '/contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Outpatient Mental Health / CMHC', slug: 'outpatient-mental-health-services-cmhc' },
                { label: 'Intensive Outpatient Program (IOP)', slug: 'intensive-outpatient-program-iop' },
                { label: 'Psychiatric Assessments', slug: 'psychiatric-assessments-evaluations' },
                { label: 'Medication Management', slug: 'medication-management-psychiatric-follow-up' },
                { label: 'Individual Counseling / Therapy', slug: 'individual-counseling-therapy' },
                { label: 'Case Management', slug: 'case-management' },
                { label: 'Nursing Assessments', slug: 'nursing-assessments' },
                { label: '24/7 Crisis Support Line', slug: '24-7-crisis-support-line' },
              ].map(s => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-primary-400 hover:text-primary-300 transition-colors text-xs font-medium mt-1 inline-block">
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <Phone size={15} className="mt-0.5 flex-shrink-0 text-primary-400" />
                <a href="tel:2819037691" className="hover:text-white transition-colors">281-903-7691</a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Mail size={15} className="mt-0.5 flex-shrink-0 text-primary-400" />
                <a href="mailto:info@daystarsinc.com" className="hover:text-white transition-colors">info@daystarsinc.com</a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-primary-400" />
                <span>4611 S Main Suite 4 & 8<br />Stafford, Texas</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-primary-400" />
                <span>24/7 Crisis Support Line</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Day Stars, Inc. All rights reserved.</p>
          <Link to="/admin" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
