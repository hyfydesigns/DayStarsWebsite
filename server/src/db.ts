import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/daystars.db');

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
  'contact.hours': '24/7 Crisis Support Line Available',
  'contact.location_2': '',
  'stats.clients_served': '500+',
  'stats.years_operating': '19+',
  'stats.staff_members': '20+',
  'stats.locations': '1',
};

// Keys that must always reflect the latest seed value (corrected facts, etc.)
const alwaysUpdate = new Set(['stats.locations', 'contact.location_2', 'about.history', 'contact.hours']);

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
try { db.exec(`ALTER TABLE services ADD COLUMN slug TEXT DEFAULT ''`); } catch {}

// Backfill slugs for any rows missing them
const makeSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const missingSlug = db.prepare("SELECT id, title FROM services WHERE slug = '' OR slug IS NULL").all() as { id: number; title: string }[];
const updateSlug = db.prepare('UPDATE services SET slug = ? WHERE id = ?');
for (const row of missingSlug) updateSlug.run(makeSlug(row.title), row.id);

// Seed services
const serviceCount = (db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number }).c;
if (serviceCount === 0) {
  const services = [
    { title: 'Outpatient Mental Health Services / CMHC', icon: 'Brain', sort_order: 1, coming_soon: 0, description: 'Comprehensive outpatient behavioral-health services to help individuals manage symptoms, improve daily functioning, and work toward greater stability and independence.', image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80&auto=format&fit=crop', long_description: 'Comprehensive outpatient behavioral-health services designed to help individuals manage mental-health symptoms, improve daily functioning, and work toward greater stability and independence. Services may include individualized treatment planning, counseling, skills development, care coordination, and ongoing behavioral-health support.', bullet_points: JSON.stringify(['Individualized treatment planning','Counseling and therapeutic support','Skills development','Care coordination','Ongoing behavioral-health support']), who_it_helps: 'Adults living with mental-health conditions who need structured outpatient support to manage symptoms and build lasting stability.' },
    { title: 'Intensive Outpatient Program (IOP)', icon: 'Activity', sort_order: 2, coming_soon: 0, description: 'A structured level of outpatient care for individuals who need more support than traditional therapy but do not require inpatient hospitalization.', image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop', long_description: 'A structured level of outpatient care for individuals who need more support than traditional outpatient therapy but do not require inpatient hospitalization. IOP may include scheduled therapeutic groups, individual support, behavioral-health education, coping-skills development, relapse-prevention support, and coordination with psychiatric and medical providers.', bullet_points: JSON.stringify(['Scheduled therapeutic group sessions','Individual support','Behavioral-health education','Coping-skills development','Relapse-prevention support','Coordination with psychiatric and medical providers']), who_it_helps: 'Individuals who need more support than weekly therapy but do not require 24-hour inpatient care, including those stepping down from hospitalization.' },
    { title: 'Psychiatric Assessments & Evaluations', icon: 'ClipboardList', sort_order: 3, coming_soon: 0, description: 'Comprehensive psychiatric evaluations to assess mental-health symptoms, functioning, and treatment needs, with recommendations for appropriate care.', image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80&auto=format&fit=crop', long_description: 'Comprehensive psychiatric evaluations to assess mental-health symptoms, functioning, treatment needs, and appropriate recommendations for care. Assessments may assist with identifying conditions such as depression, anxiety, bipolar disorder, schizophrenia-spectrum disorders, and other behavioral-health concerns.', bullet_points: JSON.stringify(['Mental-health symptom assessment','Functional evaluation','Identification of depression, anxiety, bipolar disorder, schizophrenia-spectrum disorders, and more','Appropriate care recommendations','Informs individualized treatment planning']), who_it_helps: 'New clients entering care and existing clients requiring re-evaluation or a formal psychiatric assessment.' },
    { title: 'Medication Management / Psychiatric Follow-Up', icon: 'Pill', sort_order: 4, coming_soon: 0, description: 'Ongoing psychiatric care focused on evaluating treatment progress, monitoring symptoms and medication effectiveness, and making appropriate treatment recommendations.', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80&auto=format&fit=crop', long_description: 'Ongoing psychiatric care focused on evaluating treatment progress, monitoring symptoms and medication effectiveness, identifying side effects, and making appropriate treatment recommendations.', bullet_points: JSON.stringify(['Evaluation of treatment progress','Symptom monitoring','Medication effectiveness review','Side effect identification','Appropriate treatment recommendations']), who_it_helps: 'Clients receiving psychiatric medication as part of their treatment plan who need regular monitoring and follow-up care.' },
    { title: 'Nursing Assessments', icon: 'Stethoscope', sort_order: 5, coming_soon: 0, description: "An additional layer of clinical support evaluating physical and behavioral-health needs, medications, symptoms, and changes in a client's overall condition.", image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80&auto=format&fit=crop', long_description: "Nursing assessments provide an additional layer of clinical support by evaluating physical and behavioral-health needs, medications, symptoms, health concerns, and changes in a client's overall condition.", bullet_points: JSON.stringify(['Physical health evaluation','Behavioral-health needs assessment','Medication review','Symptom monitoring','Identification of health concerns and changes in condition']), who_it_helps: 'All clients in our program, particularly those with co-occurring physical health conditions or complex medication needs.' },
    { title: 'Individual Counseling / Therapy', icon: 'MessageCircle', sort_order: 6, coming_soon: 0, description: 'One-on-one therapeutic support to help individuals understand their symptoms, develop healthy coping skills, improve relationships, and work toward personal treatment goals.', image_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop', long_description: 'One-on-one therapeutic support focused on helping individuals understand their symptoms, develop healthy coping skills, improve relationships, manage stress, and work toward their personal treatment goals.', bullet_points: JSON.stringify(['Symptom understanding and psychoeducation','Healthy coping skills development','Relationship and communication support','Stress management','Personalized goal-setting and progress']), who_it_helps: 'Clients seeking individual support to process their experiences, manage behavioral-health symptoms, and make progress toward their personal recovery goals.' },
    { title: 'Behavioral Health Skills Training', icon: 'Shield', sort_order: 7, coming_soon: 0, description: 'Practical support to help individuals develop skills for managing emotions, communication, problem-solving, coping with stress, and functioning more successfully in daily life.', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop', long_description: 'Practical support to help individuals develop skills for managing emotions, communication, problem-solving, decision-making, coping with stress, and functioning more successfully in their daily lives.', bullet_points: JSON.stringify(['Emotion management','Communication skills','Problem-solving and decision-making','Stress coping strategies','Daily functioning and independence']), who_it_helps: "Clients whose behavioral-health condition has affected their ability to manage emotions, communicate effectively, or function independently in daily life." },
    { title: 'Case Management', icon: 'ClipboardList', sort_order: 8, coming_soon: 0, description: 'Helps clients connect with community resources and coordinate the services they need, including healthcare, benefits, housing, transportation, and referrals.', image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop', long_description: 'Case management helps clients connect with community resources and coordinate the services they need. This may include assistance with healthcare coordination, benefits and resources, housing resources, transportation, employment/education resources, community programs, and referrals to other providers.', bullet_points: JSON.stringify(['Healthcare coordination','Benefits and resource assistance','Housing resource navigation','Transportation support','Employment and education resources','Community program connections','Referrals to other providers']), who_it_helps: 'Clients who need help navigating community systems, coordinating services, or accessing resources that support their recovery and daily stability.' },
    { title: 'Care Coordination', icon: 'Network', sort_order: 9, coming_soon: 0, description: 'We work with clients, families, physicians, psychiatrists, hospitals, and community providers to promote continuity and consistency of care.', image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop', long_description: 'We work with clients, families, physicians, psychiatrists, therapists, hospitals, community providers, and other members of the treatment team to promote continuity of care.', bullet_points: JSON.stringify(['Collaboration with clients and families','Coordination with physicians and psychiatrists','Communication with hospitals and community providers','Continuity of care across the treatment team','Integrated and consistent care planning']), who_it_helps: 'Clients receiving care from multiple providers who benefit from coordinated communication and a unified approach to their treatment.' },
    { title: 'Treatment Planning', icon: 'FileText', sort_order: 10, coming_soon: 0, description: "Each client receives an individualized plan based on their needs, strengths, and goals, reviewed and updated as their needs change throughout care.", image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80&auto=format&fit=crop', long_description: "Each client receives an individualized plan based on their needs, strengths, goals, and level of care. Treatment plans are reviewed and updated as the client's needs change.", bullet_points: JSON.stringify(['Individualized planning based on needs and strengths','Collaborative goal-setting','Appropriate level-of-care determination','Regular plan reviews','Updates as needs evolve']), who_it_helps: 'All clients in our program — an individualized treatment plan guides every aspect of their care and evolves with them throughout recovery.' },
    { title: '24/7 Crisis Support Line', icon: 'Phone', sort_order: 11, coming_soon: 0, description: 'Access to a 24/7 crisis support line for clients experiencing an urgent behavioral-health concern outside of regular business hours.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop', long_description: 'Daystars provides access to a 24/7 crisis support line for clients who may need behavioral-health support outside of regular business hours. Our crisis line provides an additional point of contact for clients experiencing an urgent behavioral-health concern and can help determine appropriate next steps and connect individuals with available resources.', bullet_points: JSON.stringify(['Available 24 hours a day, 7 days a week','Support for urgent behavioral-health concerns','Guidance on appropriate next steps','Connection to available resources','Additional point of contact outside business hours']), who_it_helps: 'Clients experiencing an urgent behavioral-health concern outside of regular business hours who need immediate support and guidance.' },
    { title: 'Family & Caregiver Support', icon: 'Heart', sort_order: 12, coming_soon: 0, description: 'When appropriate and authorized by the client, families and caregivers receive education and support to better understand behavioral-health needs and participate in the treatment process.', image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop', long_description: 'When appropriate and authorized by the client, families and caregivers may receive education and support to better understand behavioral-health needs and participate appropriately in the treatment process.', bullet_points: JSON.stringify(['Behavioral-health education for families','Support for caregivers','Guidance on participating in the treatment process','Authorized and client-centered involvement','Strengthening the support system']), who_it_helps: "Family members and caregivers who, with the client's authorization, want to better understand behavioral-health conditions and support their loved one's recovery." },
    { title: 'Community Resource & Referral Services', icon: 'Globe', sort_order: 13, coming_soon: 0, description: "Assistance connecting clients with appropriate community resources and other providers when needs fall outside the scope of Daystars' services.", image_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80&auto=format&fit=crop', long_description: "Assistance connecting clients with appropriate community resources and other healthcare or social-service providers when needs fall outside the scope of Daystars' services.", bullet_points: JSON.stringify(['Referrals to healthcare providers','Social-service provider connections','Community resource identification',"Support for needs outside Daystars' scope",'Ensuring clients get the help they need']), who_it_helps: 'Clients with needs that extend beyond our direct services who benefit from connection to other community resources and providers.' },
    { title: 'Discharge & Transition Planning', icon: 'CheckCircle', sort_order: 14, coming_soon: 0, description: 'We help clients transition between levels of care and connect with appropriate ongoing services when they are ready to step down from intensive treatment.', image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop', long_description: 'We help clients transition between levels of care and connect with appropriate ongoing services when they are ready to step down from intensive treatment.', bullet_points: JSON.stringify(['Transition planning between levels of care','Connection to ongoing outpatient services','Community support coordination','Step-down planning from intensive treatment','Continuity of care after discharge']), who_it_helps: 'Clients who are ready to transition out of intensive treatment and need support connecting to appropriate ongoing care and community resources.' },
    { title: 'Substance Use & Recovery Services', icon: 'Leaf', sort_order: 15, coming_soon: 1, description: 'Daystars is expanding its outpatient behavioral-health services to include support for individuals experiencing substance-use concerns.', image_url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=80&auto=format&fit=crop', long_description: 'Daystars is expanding its outpatient behavioral-health services to include support for individuals experiencing substance-use concerns.\n\nComing soon: substance-use assessments, recovery-focused counseling, relapse-prevention support, and coordinated behavioral-health services.', bullet_points: JSON.stringify(['Substance-use assessments','Recovery-focused counseling','Relapse-prevention support','Coordinated behavioral-health services']), who_it_helps: 'Individuals experiencing substance-use concerns who need integrated, recovery-oriented support alongside their behavioral-health care.' },
  ];
  const insert = db.prepare('INSERT INTO services (title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps, coming_soon, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const s of services) insert.run(s.title, s.description, s.icon, s.sort_order, s.image_url, s.long_description, s.bullet_points, s.who_it_helps, s.coming_soon, makeSlug(s.title));
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
    { question: 'What are outpatient behavioral-health services?', answer: 'Outpatient behavioral-health services provide mental-health treatment and support while allowing individuals to continue living at home and participating in their normal daily activities.', sort_order: 1 },
    { question: 'Who can benefit from outpatient services?', answer: 'Outpatient services may benefit individuals experiencing mental-health symptoms, difficulty managing daily life, emotional challenges, behavioral concerns, or other needs that can be safely treated outside of an inpatient setting.', sort_order: 2 },
    { question: 'What is the difference between outpatient treatment and IOP?', answer: 'Traditional outpatient treatment generally involves fewer treatment hours and less frequent services. An Intensive Outpatient Program provides a more structured level of support for individuals who need additional treatment while still living in the community.', sort_order: 3 },
    { question: 'Do I need to be hospitalized to receive outpatient services?', answer: 'No. Outpatient services are specifically designed to provide treatment without requiring an inpatient hospital stay.', sort_order: 4 },
    { question: 'How do I become a client?', answer: 'Individuals may contact Daystars directly or be referred by a physician, hospital, therapist, case manager, healthcare organization, family member, or another community provider. An initial assessment helps determine appropriate services.', sort_order: 5 },
    { question: 'Do you accept insurance?', answer: 'Daystars works with participating insurance plans and programs. Coverage varies by service, plan, eligibility, and authorization requirements. Contact our office to verify benefits and determine eligibility.', sort_order: 6 },
    { question: 'Do you accept Medicaid?', answer: 'Daystars participates with select Medicaid managed-care plans. Eligibility and coverage depend on the individual\'s plan and the specific service requested.', sort_order: 7 },
    { question: 'Do you accept Medicare?', answer: 'Coverage depends on the service, the individual\'s Medicare benefits, and whether additional insurance or managed-care coverage applies. Our team can assist with determining eligibility.', sort_order: 8 },
    { question: 'Can I receive more than one service?', answer: 'Yes. When clinically appropriate, clients may receive multiple coordinated services based on their individualized treatment needs and eligibility.', sort_order: 9 },
    { question: 'How long does treatment last?', answer: 'There is no single treatment length for every client. The duration depends on the individual\'s needs, treatment goals, progress, and level of care.', sort_order: 10 },
    { question: 'Can my family member refer me?', answer: 'A family member or caregiver may contact Daystars regarding services and the referral process. Clinical services and information sharing are subject to applicable privacy requirements and client authorization.', sort_order: 11 },
    { question: 'What happens during my first appointment?', answer: 'The initial process typically involves gathering information about your current concerns, behavioral-health history, medical needs, medications, functioning, strengths, and treatment goals. This information helps our clinical team determine appropriate next steps.', sort_order: 12 },
    { question: 'Do I have to participate in group therapy?', answer: 'It depends on the specific service or program. Some outpatient services are individual, while IOP and other structured programs may include group-based treatment.', sort_order: 13 },
    { question: 'Do you provide psychiatric evaluations?', answer: 'Yes. Psychiatric assessments are available as part of our behavioral-health services, based on eligibility and clinical need.', sort_order: 14 },
    { question: 'Do you provide medication management?', answer: 'Psychiatric medication services may be available for eligible clients as clinically appropriate.', sort_order: 15 },
    { question: 'Do you provide therapy?', answer: 'Yes. Therapy and other behavioral-health interventions may be available based on the client\'s needs, treatment plan, and program eligibility.', sort_order: 16 },
    { question: 'Do you provide case management?', answer: 'Yes. Case management can help eligible clients coordinate healthcare, connect with community resources, and address barriers that may affect their overall stability.', sort_order: 17 },
    { question: 'Do you provide nursing services?', answer: 'Nursing assessments and clinical nursing support may be provided based on the individual\'s needs and program eligibility.', sort_order: 18 },
    { question: 'Can I continue working or going to school while receiving outpatient treatment?', answer: 'In many cases, yes. Outpatient treatment is designed to allow individuals to remain in the community while receiving behavioral-health support. The appropriate schedule depends on the individual\'s treatment needs and program requirements.', sort_order: 19 },
    { question: 'Is crisis support available after regular business hours?', answer: 'Yes. Daystars provides access to a 24/7 crisis support line for clients who need behavioral-health support outside of regular business hours. The crisis line is intended to provide support, help assess the situation, and guide individuals toward appropriate resources or a higher level of care when necessary.', sort_order: 20 },
    { question: 'What should I do if I am experiencing a life-threatening emergency?', answer: 'If you or someone else is in immediate danger or experiencing a life-threatening emergency, call 911 or go to the nearest emergency department. For mental-health or suicide-related crisis support, call or text 988 to reach the 988 Suicide & Crisis Lifeline.', sort_order: 21 },
    { question: 'Do you treat substance-use disorders?', answer: 'Substance-use and recovery services are coming soon. Please contact Daystars for updates regarding availability.', sort_order: 22 },
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
