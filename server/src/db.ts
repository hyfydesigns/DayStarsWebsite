import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(__dirname, '../../data/daystars.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    image_url TEXT DEFAULT '',
    long_description TEXT DEFAULT '',
    bullet_points TEXT DEFAULT '[]',
    who_it_helps TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );
`);

// Seed default admin
const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('Admin123!', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
}

// Seed default content
const contentSeeds: Record<string, string> = {
  'hero.headline': 'Walking With You Toward Behavioral Strength',
  'hero.subheadline': 'A Community Mental Healthcare Center dedicated to helping individuals with behavioral and mental health challenges reclaim their lives.',
  'hero.cta_primary': 'Our Services',
  'hero.cta_secondary': 'Contact Us',
  'about.title': 'About Day Stars, Inc.',
  'about.history': 'Founded in 2005 by Emmanuel Onyemem, Day Stars was incorporated in 2008 alongside Dr. Matthew Brams and Ms. Gloria Francis. Today, under the leadership of Emmanuel Onyemem Jr. (CEO), we operate out of our center at 4611 S Main, Stafford, Texas.',
  'about.mission': 'To walk with the challenged through their weaknesses to a place of behavioral strength.',
  'about.vision': 'A community where every individual has access to compassionate, evidence-based mental health care and the support needed to thrive.',
  'about.licensed_since': 'May 2020',
  'contact.phone': '281-903-7691',
  'contact.email': 'info@daystarsinc.com',
  'contact.address': '4611 S Main Suite 4 & 8, Stafford, Texas',
  'contact.hours': '24/7 – We are always available',
  'contact.location_2': '',
  'stats.clients_served': '500+',
  'stats.years_operating': '19+',
  'stats.staff_members': '20+',
  'stats.locations': '1',
};

// Keys that must always reflect the latest seed value (corrected facts, etc.)
const alwaysUpdate = new Set(['stats.locations', 'contact.location_2', 'about.history']);

for (const [key, value] of Object.entries(contentSeeds)) {
  const exists = db.prepare('SELECT key FROM site_content WHERE key = ?').get(key);
  if (!exists) {
    db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)').run(key, value);
  } else if (alwaysUpdate.has(key)) {
    db.prepare('UPDATE site_content SET value = ? WHERE key = ?').run(value, key);
  }
}

// Migrate: add columns to services if they don't exist
try { db.exec(`ALTER TABLE services ADD COLUMN image_url TEXT DEFAULT ''`); } catch {}
try { db.exec(`ALTER TABLE services ADD COLUMN long_description TEXT DEFAULT ''`); } catch {}
try { db.exec(`ALTER TABLE services ADD COLUMN bullet_points TEXT DEFAULT '[]'`); } catch {}
try { db.exec(`ALTER TABLE services ADD COLUMN who_it_helps TEXT DEFAULT ''`); } catch {}
try { db.exec(`ALTER TABLE services ADD COLUMN coming_soon INTEGER DEFAULT 0`); } catch {}

// Seed services
const serviceCount = (db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number }).c;
if (serviceCount === 0) {
  const services = [
    {
      title: 'Mental Health / CMHC', icon: 'Brain', sort_order: 1, coming_soon: 0,
      description: 'Comprehensive community mental health center services providing person-centered, recovery-oriented behavioral health care for adults with chronic mental illness.',
      image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80&auto=format&fit=crop',
      long_description: 'As a licensed Community Mental Health Center (CMHC), Day Stars provides a full continuum of behavioral health services tailored to adults living with chronic mental illness. Our evidence-based, person-centered approach integrates clinical care, community support, and skill-building to help each individual move toward greater independence, stability, and quality of life.',
      bullet_points: JSON.stringify(['Licensed CMHC serving adults with chronic mental illness','Person-centered, recovery-oriented care model','Evidence-based clinical interventions','Integrated medical and behavioral health support','Accepts Medicaid and select insurance plans']),
      who_it_helps: 'Adults diagnosed with major depression, bipolar disorder, schizophrenia, schizoaffective disorder, or other chronic mental health conditions.',
    },
    {
      title: 'Intensive Outpatient Program (IOP)', icon: 'Activity', sort_order: 2, coming_soon: 0,
      description: 'A structured, multi-day-per-week outpatient program providing intensive clinical support while allowing clients to maintain their home and community life.',
      image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Our Intensive Outpatient Program (IOP) bridges the gap between inpatient hospitalization and traditional outpatient care. Clients attend multiple sessions per week, receiving structured group therapy, skill-building, and clinical monitoring — all while remaining in their community. IOP is an ideal step-down from inpatient care or a higher level of support for those whose needs exceed standard outpatient treatment.',
      bullet_points: JSON.stringify(['Structured multi-day-per-week schedule','Group and individual therapy sessions','Skill-building and psychoeducation','Clinical monitoring and medication oversight','Supports step-down from inpatient care']),
      who_it_helps: 'Adults who need more support than weekly therapy but do not require 24-hour inpatient care, including those stepping down from hospitalization.',
    },
    {
      title: 'Psychiatric Assessments', icon: 'ClipboardList', sort_order: 3, coming_soon: 0,
      description: 'Comprehensive psychiatric evaluations conducted by licensed clinicians to accurately diagnose mental health conditions and inform individualized treatment planning.',
      image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80&auto=format&fit=crop',
      long_description: 'A thorough psychiatric assessment is the foundation of effective mental health treatment. Our licensed clinicians conduct comprehensive evaluations covering mental status, psychiatric history, psychosocial background, and diagnostic criteria. The results directly inform each client\'s individualized treatment plan and ensure care is targeted, appropriate, and evidence-based.',
      bullet_points: JSON.stringify(['Mental status examinations','Comprehensive psychiatric history review','DSM-5 diagnostic evaluation','Psychosocial and functional assessment','Findings inform individualized treatment plans']),
      who_it_helps: 'New clients entering care and existing clients requiring re-evaluation, as well as individuals seeking a formal psychiatric diagnosis.',
    },
    {
      title: 'Medication Management', icon: 'Pill', sort_order: 4, coming_soon: 0,
      description: 'Ongoing psychiatric medication oversight including prescribing, monitoring, and adjustments by qualified clinicians to support symptom stability and recovery.',
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Medication can play a vital role in managing mental health symptoms. Our qualified psychiatric clinicians work closely with each client to prescribe, monitor, and adjust medications as needed. We take a collaborative approach — explaining options, monitoring for side effects, and making data-driven adjustments to achieve the best possible outcomes.',
      bullet_points: JSON.stringify(['Psychiatric medication prescribing','Ongoing monitoring and dosage adjustments','Side effect management and education','Coordination with primary care providers','Medication adherence support']),
      who_it_helps: 'Clients whose mental health conditions benefit from pharmacological treatment as part of their overall recovery plan.',
    },
    {
      title: 'Nursing Assessments', icon: 'Stethoscope', sort_order: 5, coming_soon: 0,
      description: 'Comprehensive nursing evaluations to assess physical health, vital signs, chronic conditions, and overall wellness as part of integrated behavioral health care.',
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Physical and mental health are deeply interconnected. Our licensed nurses conduct thorough health assessments at intake and on an ongoing basis, monitoring vital signs, identifying chronic conditions, and flagging physical health concerns that may affect behavioral health. These assessments ensure our clinical team has a complete picture of each client\'s health status.',
      bullet_points: JSON.stringify(['Comprehensive health history review','Vital sign monitoring and documentation','Chronic condition screening','Physician-ordered laboratory coordination','Ongoing health monitoring throughout treatment']),
      who_it_helps: 'All clients entering our program, and those with co-occurring physical health conditions requiring regular monitoring.',
    },
    {
      title: 'Individual Therapy', icon: 'MessageCircle', sort_order: 6, coming_soon: 0,
      description: 'One-on-one sessions with a licensed therapist to explore challenges, develop coping strategies, and work toward personal recovery goals in a confidential setting.',
      image_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Individual therapy offers clients a private, confidential space to work through their unique challenges with a dedicated licensed therapist. Using evidence-based modalities including Cognitive Behavioral Therapy (CBT), motivational interviewing, and trauma-informed approaches, our therapists help clients process their experiences, build coping skills, and make meaningful progress toward their recovery goals.',
      bullet_points: JSON.stringify(['Licensed therapists with mental health specializations','Cognitive Behavioral Therapy (CBT) and other evidence-based methods','Trauma-informed and person-centered approach','Regular goal-setting and progress reviews','Confidential and supportive environment']),
      who_it_helps: 'Clients seeking one-on-one support to process trauma, manage symptoms, build coping skills, or work toward personal recovery goals.',
    },
    {
      title: 'Behavioral Health Skills Training', icon: 'Shield', sort_order: 7, coming_soon: 0,
      description: 'Structured training to develop practical life skills, emotional regulation, social competencies, and daily functioning strategies for long-term independence.',
      image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Mental illness can impact the practical skills needed for daily life. Our behavioral health skills training program teaches clients how to manage their emotions, build healthy relationships, handle daily responsibilities, and navigate community settings. Sessions are structured, interactive, and directly applicable to real-life situations — empowering clients toward lasting independence.',
      bullet_points: JSON.stringify(['Emotional regulation and coping skills','Social and interpersonal skills development','Daily living and independent living skills','Conflict resolution and problem-solving','Community integration and participation']),
      who_it_helps: 'Clients whose illness has affected their daily functioning, social skills, or ability to live independently.',
    },
    {
      title: 'Case Management', icon: 'ClipboardList', sort_order: 8, coming_soon: 0,
      description: 'Dedicated case managers advocate for clients, coordinate care across providers, connect them to community resources, and support long-term stability.',
      image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Our case managers are dedicated advocates who work alongside each client to ensure their care is coordinated, their needs are met, and no one falls through the cracks. From connecting clients to housing, financial, and social resources to coordinating with outside providers and managing benefits — our case management team addresses the full picture of what each client needs to thrive.',
      bullet_points: JSON.stringify(['Individualized care coordination and planning','Benefits enrollment and advocacy','Community resource referrals and linkage','Housing and financial stability support','Regular progress monitoring and plan updates']),
      who_it_helps: 'Clients who need help navigating the healthcare system, managing benefits, or connecting with community resources to support their recovery.',
    },
    {
      title: 'Care Coordination', icon: 'Network', sort_order: 9, coming_soon: 0,
      description: 'Seamless coordination across all treating providers — medical, psychiatric, and social — to ensure integrated, consistent, and effective care for every client.',
      image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Effective recovery requires that all of a client\'s providers work together. Our care coordination team acts as the hub connecting psychiatric, medical, social, and community services. We communicate with outside providers, share relevant information (with client consent), and ensure that the care each client receives is consistent, non-duplicative, and aligned with their overall treatment plan.',
      bullet_points: JSON.stringify(['Coordination with medical and psychiatric providers','Communication and information sharing (with consent)','Referral management and follow-up','Integrated care planning across services','Reduced gaps and duplication in care']),
      who_it_helps: 'Clients receiving care from multiple providers who need their services coordinated to prevent gaps, duplication, or conflicting treatment approaches.',
    },
    {
      title: 'Treatment Planning', icon: 'FileText', sort_order: 10, coming_soon: 0,
      description: 'Collaborative, individualized treatment plans developed with each client to set meaningful goals, guide care, and measure progress throughout the recovery journey.',
      image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Every client at Day Stars receives a comprehensive, individualized treatment plan developed collaboratively with our clinical team. The plan identifies strengths, challenges, goals, and the specific services and interventions to be used. Plans are reviewed and updated regularly — ensuring that care evolves alongside each client\'s progress, setbacks, and changing needs.',
      bullet_points: JSON.stringify(['Collaborative goal-setting with the client','Strength-based and recovery-oriented planning','Specific, measurable, and time-bound objectives','Regular review and plan updates','Guides all clinical services and interventions']),
      who_it_helps: 'All clients in our program — a personalized treatment plan is the roadmap that guides every aspect of their care.',
    },
    {
      title: '24/7 Crisis Support Line', icon: 'Phone', sort_order: 11, coming_soon: 0,
      description: 'Around-the-clock telephone crisis support available to clients and community members experiencing a mental health emergency or urgent need for guidance.',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Mental health crises don\'t follow a schedule. Our 24/7 crisis support line ensures that clients and community members always have access to a trained professional when they need it most. Whether someone is experiencing a psychiatric emergency, needs urgent guidance, or simply needs someone to talk to — our team is available around the clock to provide support, de-escalation, and referrals.',
      bullet_points: JSON.stringify(['Available 24 hours a day, 7 days a week','Trained crisis intervention staff','De-escalation and emotional support','Emergency referrals and coordination','Available to clients and community members']),
      who_it_helps: 'Anyone experiencing a mental health crisis, emotional distress, or urgent need for guidance — including existing clients and community members.',
    },
    {
      title: 'Family/Caregiver Support', icon: 'Heart', sort_order: 12, coming_soon: 0,
      description: 'Education, resources, and support for family members and caregivers to help them understand mental illness and strengthen their ability to support their loved ones.',
      image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Recovery is stronger when family is involved. Our family and caregiver support services provide education about mental illness, communication strategies, and practical guidance for those supporting a loved one in treatment. We recognize that caregivers also need support — and we\'re here for them too, helping families become a positive force in their loved one\'s recovery.',
      bullet_points: JSON.stringify(['Mental health education for families','Communication and boundary-setting guidance','Caregiver stress and self-care resources','Involvement in treatment planning (with consent)','Connection to family support groups and resources']),
      who_it_helps: 'Family members and caregivers of clients in our program who want to better understand mental illness and support their loved one\'s recovery.',
    },
    {
      title: 'Community Resources & Referrals', icon: 'Globe', sort_order: 13, coming_soon: 0,
      description: 'Connecting clients to a broad network of community resources — housing, financial assistance, employment, food, and more — to address the social determinants of health.',
      image_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Recovery doesn\'t happen in isolation — it happens in the community. Our team maintains a robust network of community resources and actively connects clients to housing assistance, food programs, financial aid, employment support, and other social services. By addressing the social determinants of health, we help clients build stable lives that support lasting mental wellness.',
      bullet_points: JSON.stringify(['Housing and shelter assistance','Food programs and nutritional support','Financial aid and benefits navigation','Employment and vocational resources','Social service referrals and follow-up']),
      who_it_helps: 'Clients facing social challenges — housing instability, food insecurity, unemployment, or financial hardship — that affect their mental health and recovery.',
    },
    {
      title: 'Discharge & Transition Planning', icon: 'CheckCircle', sort_order: 14, coming_soon: 0,
      description: 'Structured planning to ensure a smooth, safe transition out of our program, with continuity of care, community connections, and follow-up support in place.',
      image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Leaving a structured program is a critical moment in recovery. Our discharge and transition planning process begins well before a client\'s last day. We work with each client to identify next steps, connect them to ongoing outpatient services, arrange community supports, and create a written transition plan they can rely on. Our goal is to make every transition a bridge to continued success — not a gap in care.',
      bullet_points: JSON.stringify(['Early and collaborative discharge planning','Connection to outpatient and community services','Written transition plan for each client','Follow-up support and check-ins post-discharge','Coordination with receiving providers']),
      who_it_helps: 'All clients completing our program who need a structured, safe transition to the next phase of their care and community life.',
    },
    {
      title: 'Substance Use & Recovery Services', icon: 'Leaf', sort_order: 15, coming_soon: 1,
      description: 'Integrated substance use treatment and recovery support services addressing co-occurring mental health and addiction needs. Coming soon to Day Stars.',
      image_url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=80&auto=format&fit=crop',
      long_description: 'Mental health and substance use disorders frequently co-occur, and treating each in isolation limits recovery. Day Stars is expanding to offer integrated substance use and recovery services — combining evidence-based addiction treatment with our existing behavioral health expertise. This service will provide a unified, whole-person approach to healing.',
      bullet_points: JSON.stringify(['Integrated dual-diagnosis treatment','Substance use assessments and counseling','Recovery support and relapse prevention','Peer support and community connection','Coordinated with existing mental health services']),
      who_it_helps: 'Adults with co-occurring substance use disorders and mental health conditions who need integrated, coordinated treatment for both.',
    },
  ];
  const insert = db.prepare('INSERT INTO services (title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, coming_soon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const s of services) insert.run(s.title, s.description, s.icon, s.sort_order, s.image_url, s.long_description, s.bullet_points, s.who_it_helps, s.coming_soon);
}

// Seed team
const teamCount = (db.prepare('SELECT COUNT(*) as c FROM team_members').get() as { c: number }).c;
if (teamCount === 0) {
  const team = [
    { name: 'Emmanuel Onyemem Jr.', title: 'Chief Executive Officer', bio: 'Leading Day Stars with a passion for expanding access to mental health care across the Houston area.', sort_order: 1 },
    { name: 'Alice Akingbade', title: 'Center Director', bio: 'Overseeing daily operations and ensuring the highest standard of care for all clients.', sort_order: 2 },
    { name: 'Remi Sutton', title: 'Administrator', bio: 'Managing administrative functions and supporting the operational excellence of our programs.', sort_order: 3 },
    { name: 'Vera Umosen', title: 'Program Coordinator & Therapist', bio: 'Coordinating therapeutic programs and providing direct clinical care to clients.', sort_order: 4 },
  ];
  const insert = db.prepare('INSERT INTO team_members (name, title, bio, sort_order) VALUES (?, ?, ?, ?)');
  for (const t of team) insert.run(t.name, t.title, t.bio, t.sort_order);
}

// Seed FAQs
const faqCount = (db.prepare('SELECT COUNT(*) as c FROM faqs').get() as { c: number }).c;
if (faqCount === 0) {
  const faqs = [
    { question: 'Who is eligible for Day Stars services?', answer: 'We serve adults with any chronic mental illness including major depression, bipolar disorder, schizophrenia, schizoaffective disorder, and co-occurring substance abuse disorders.', sort_order: 1 },
    { question: 'What insurance do you accept?', answer: 'We work with Medicaid and various insurance plans. Please contact us directly at 281-903-7691 to verify your specific coverage and eligibility.', sort_order: 2 },
    { question: 'Where are you located?', answer: 'We are located at 4611 S Main Suite 4 & 8, Stafford, Texas. Call us at 281-903-7691 for directions.', sort_order: 3 },
    { question: 'What are your operating hours?', answer: 'Our team is available 24/7 to respond to inquiries and emergencies. Day program hours vary — please contact us for the current schedule.', sort_order: 4 },
    { question: 'How do I enroll or refer someone?', answer: 'Call us at 281-903-7691 or email info@daystarsinc.com to start the enrollment process. Our intake team will guide you through a screening and assessment.', sort_order: 5 },
    { question: 'Do you provide transportation?', answer: 'Yes. Transportation assistance is available to help clients attend their scheduled sessions and appointments.', sort_order: 6 },
    { question: 'What makes Day Stars different?', answer: 'We combine clinical excellence with genuine compassion. Our approach is person-centered, research-based, and focused on each individual\'s path to behavioral strength and independence.', sort_order: 7 },
  ];
  const insert = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)');
  for (const f of faqs) insert.run(f.question, f.answer, f.sort_order);
}

// Seed testimonials
const testCount = (db.prepare('SELECT COUNT(*) as c FROM testimonials').get() as { c: number }).c;
if (testCount === 0) {
  const tests = [
    { quote: 'Day Stars gave me the tools and the support I needed to reclaim my life. The staff truly cares about every single person who walks through those doors.', author: 'Former Client', sort_order: 1 },
    { quote: 'The team at Day Stars treated my family member with dignity and respect. We saw real progress in just a few months.', author: 'Family Member', sort_order: 2 },
    { quote: 'The combination of therapy, nursing care, and case management all in one place made such a difference. I felt truly supported.', author: 'Current Client', sort_order: 3 },
  ];
  const insert = db.prepare('INSERT INTO testimonials (quote, author, sort_order) VALUES (?, ?, ?)');
  for (const t of tests) insert.run(t.quote, t.author, t.sort_order);
}

export default db;
