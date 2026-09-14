import { useEffect, useState } from 'react';
import { fetchContent, fetchTeam } from '../api/client';
import type { SiteContent, TeamMember } from '../api/client';
import { CheckCircle, Award, Heart } from 'lucide-react';

export default function About() {
  const [content, setContent] = useState<SiteContent>({});
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    Promise.all([fetchContent(), fetchTeam()]).then(([c, t]) => {
      setContent(c);
      setTeam(t);
    });
  }, []);

  const c = content;

  return (
    <div className="pt-20 lg:pt-28">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-teal-800 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-primary-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
            Our Story
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            {c['about.title'] || 'About Day Stars, Inc.'}
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto leading-relaxed">
            {c['about.history'] || 'Founded in 2005, Day Stars has served the Houston community with compassion and clinical excellence.'}
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-5">
                <Heart size={22} className="text-primary-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                "{c['about.mission'] || 'To walk with the challenged through their weaknesses to a place of behavioral strength.'}"
              </p>
            </div>
            <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-5">
                <Award size={22} className="text-teal-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {c['about.vision'] || 'A community where every individual has access to compassionate, evidence-based mental health care and the support needed to thrive.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop" alt="Counseling session" className="rounded-2xl h-48 w-full object-cover" />
            <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80&auto=format&fit=crop" alt="Group therapy" className="rounded-2xl h-48 w-full object-cover" />
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop" alt="Healthcare team" className="rounded-2xl h-48 w-full object-cover" />
            <img src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&q=80&auto=format&fit=crop" alt="Wellness" className="rounded-2xl h-48 w-full object-cover" />
          </div>
        </div>
      </section>

      {/* History / Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Our History</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { year: '2005', label: 'Founded', desc: 'Emmanuel Onyemem established Day Stars to serve individuals with mental health challenges in the Houston area.' },
              { year: '2008', label: 'Incorporated', desc: 'Day Stars was formally incorporated alongside Dr. Matthew Brams and Ms. Gloria Francis, expanding our capacity.' },
              { year: '2020', label: 'Case Management Licensed', desc: `In ${c['about.licensed_since'] || 'May 2020'}, we obtained Case Management licensing, broadening the scope of care we provide.` },
            ].map(item => (
              <div key={item.year} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-display font-bold text-primary-600 mb-1">{item.year}</div>
                <div className="font-semibold text-gray-900 mb-3">{item.label}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Our Objectives</h2>
            <p className="text-gray-500">How we deliver on our mission every day.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Deliver research-based, evidence-informed care',
              'Enhance personal autonomy and self-determination',
              'Teach effective symptom management skills',
              'Maintain a welcoming, safe environment for all',
              'Prevent hospitalization through relapse reduction',
              'Provide individualized treatment planning',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Our People</span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { role: 'Chief Executive Officer (CEO)', desc: 'Provides executive leadership and oversees the organization\'s strategic direction, operations, and growth.' },
              { role: 'Chief Financial Officer (CFO)', desc: 'Oversees financial operations, financial planning, accounting, and organizational financial management.' },
              { role: 'Program Director / Licensed Professional Counselor (LPC)', desc: 'Provides clinical and program leadership, oversees behavioral-health programming, supports treatment planning, and provides therapeutic services.' },
              { role: 'Medical Director — MD/DO', desc: 'Provides medical oversight and consultation for the organization\'s behavioral-health services.' },
              { role: 'Psychiatric Provider — NP/PMHNP', desc: 'Provides psychiatric assessments, medication evaluation/management, follow-up, and ongoing psychiatric care as appropriate.' },
              { role: 'Licensed Professional Counselor — LPC/LPC-S', desc: 'Provides individual and/or group therapy, clinical assessments, treatment planning, and behavioral-health interventions.' },
              { role: 'Therapists', desc: 'Provide individual and group therapeutic services focused on symptom management, coping skills, emotional wellness, relationships, and personal goals.' },
              { role: 'Registered Nurses — RN', desc: 'Provide nursing assessments, health monitoring, medication-related support, education, and coordination with healthcare providers as appropriate.' },
              { role: 'Case Managers', desc: 'Help clients navigate healthcare and community resources, coordinate services, address barriers to care, and work toward individualized goals.' },
              { role: 'Behavioral Health / Mental Health Technicians', desc: 'Provide program support, assist with structured activities and skills development, monitor client needs, and support a safe therapeutic environment.' },
              { role: 'Clinical Supervisor', desc: 'Provides clinical oversight, supervision, quality assurance, and support for the clinical team.' },
              { role: 'Intake / Admissions Coordinator', desc: 'Coordinates referrals, intake processes, scheduling, eligibility information, and admission-related communication.' },
              { role: 'Care Coordinator', desc: 'Supports communication and coordination among clients, families, providers, and community resources.' },
              { role: 'Utilization Review / Authorization Specialist', desc: 'Supports authorization, utilization review, payer requirements, and coordination related to covered services.' },
              { role: 'Billing & Insurance Specialist', desc: 'Supports insurance verification, claims, billing processes, and communication regarding coverage and reimbursement.' },
              { role: 'Quality Assurance / Compliance Coordinator', desc: 'Supports quality monitoring, documentation standards, regulatory compliance, and continuous improvement.' },
              { role: 'Peer Support Specialist', desc: 'Provides recovery-oriented support based on lived experience and helps clients connect with appropriate resources.' },
              { role: 'Substance Use Counselor', desc: 'Future role supporting substance-use and recovery services as those services become available.', comingSoon: true },
            ].map(({ role, desc, comingSoon }) => (
              <div key={role} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${comingSoon ? 'opacity-70' : ''}`}>
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-display font-bold text-gray-900 text-base leading-snug">{role}</h3>
                  {comingSoon && <span className="flex-shrink-0 mt-0.5 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">Coming Soon</span>}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
