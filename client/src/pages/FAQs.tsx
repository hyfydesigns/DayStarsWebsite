import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchFaqs } from '../api/client';
import type { FAQ } from '../api/client';

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
        <ChevronDown size={18} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white">
          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetchFaqs().then(setFaqs);
  }, []);

  return (
    <div className="pt-20 lg:pt-28">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-teal-800 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-primary-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
            FAQ
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Have questions about our services, eligibility, or enrollment? Find answers here — or contact us directly at any time.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqs.map(faq => <FAQItem key={faq.id} faq={faq} />)}
          </div>

          <div className="mt-14 bg-primary-50 rounded-2xl p-8 text-center border border-primary-100">
            <h3 className="font-display font-bold text-gray-900 text-xl mb-3">Still Have Questions?</h3>
            <p className="text-gray-600 mb-6">Contact us to learn more about our services, eligibility, or the enrollment process.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a href="tel:2819037691" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                Call 281-903-7691
              </a>
              <a href="mailto:info@daystarsinc.com" className="border border-primary-300 text-primary-600 font-semibold px-6 py-3 rounded-full hover:bg-primary-100 transition-colors text-sm">
                info@daystarsinc.com
              </a>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-lg mx-auto">
              If you or someone else is in immediate danger, call <strong className="text-gray-600">911</strong> or go to the nearest emergency department. For mental-health or suicide-related crisis support, call or text <strong className="text-gray-600">988</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
