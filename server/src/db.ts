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

// Migrate: add new columns to services if they don't exist
try { db.exec(`ALTER TABLE services ADD COLUMN image_url TEXT DEFAULT ''`); } catch {}
try { db.exec(`ALTER TABLE services ADD COLUMN long_description TEXT DEFAULT ''`); } catch {}
try { db.exec(`ALTER TABLE services ADD COLUMN bullet_points TEXT DEFAULT '[]'`); } catch {}
try { db.exec(`ALTER TABLE services ADD COLUMN who_it_helps TEXT DEFAULT ''`); } catch {}

// Seed services
const serviceCount = (db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number }).c;
if (serviceCount === 0) {
  const services = [
    { title: 'Individual & Group Therapy', description: 'Daily individual and group therapy sessions led by licensed clinicians. We maintain a maximum of 16 clients per clinician to ensure personalized attention.', icon: 'Brain', sort_order: 1, image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80&auto=format&fit=crop', long_description: 'Our therapy program combines evidence-based individual and group sessions to help clients process their experiences, develop coping strategies, and build resilience. Each client works with a licensed clinician to create a personalized treatment plan. Group sessions, capped at 16 clients per clinician, foster community and shared healing in a safe, structured environment.', bullet_points: JSON.stringify(['Licensed therapists specializing in mental health disorders','Daily individual sessions tailored to each client','Group therapy capped at 16 clients per clinician','Cognitive Behavioral Therapy (CBT) and other evidence-based modalities','Safe, confidential, and supportive environment']), who_it_helps: 'Adults experiencing depression, bipolar disorder, schizophrenia, anxiety, or co-occurring substance use disorders who benefit from structured therapeutic support.' },
    { title: 'Case Management', description: 'Comprehensive case management and advocacy services to help clients navigate healthcare systems, access resources, and coordinate their care.', icon: 'ClipboardList', sort_order: 2, image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop', long_description: 'Our dedicated case managers serve as advocates and guides for every client. From coordinating appointments and connecting clients to community resources, to managing benefits and navigating complex healthcare systems — we ensure no one falls through the cracks. Our holistic approach addresses housing, healthcare, finances, and social support to promote long-term stability.', bullet_points: JSON.stringify(['Personalized care coordination and planning','Benefits enrollment and assistance','Community resource referrals and linkage','Housing and financial stability support','Regular progress reviews and plan updates']), who_it_helps: 'Clients who need help organizing their care, managing benefits, or connecting with community resources to support their recovery.' },
    { title: 'Nursing Services', description: 'Full nursing services including medication administration, vital sign monitoring, physician-ordered tests, and chronic condition management.', icon: 'Heart', sort_order: 3, image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80&auto=format&fit=crop', long_description: 'Our licensed nursing team delivers comprehensive medical care alongside behavioral health treatment. We believe physical health is inseparable from mental health — so we monitor, manage, and coordinate the full picture. From daily medication administration to chronic disease monitoring, our nurses ensure clients stay healthy and medically stable throughout their time with us.', bullet_points: JSON.stringify(['Medication administration and management','Vital sign monitoring and documentation','Physician-ordered laboratory tests','Chronic condition management (diabetes, hypertension, etc.)','Health education and wellness coaching']), who_it_helps: 'Clients managing chronic physical health conditions alongside mental illness, or those who require close medical monitoring.' },
    { title: 'Transportation Assistance', description: 'Reliable transportation services to ensure clients can attend appointments and access the care they need without barriers.', icon: 'Car', sort_order: 4, image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80&auto=format&fit=crop', long_description: 'We remove one of the most common barriers to consistent care — transportation. Our transportation assistance program ensures clients can reliably attend their scheduled sessions, medical appointments, and program activities. By eliminating this obstacle, we help clients maintain the consistency that is critical to recovery and stability.', bullet_points: JSON.stringify(['Scheduled rides to and from the center','Support for medical appointment transportation','Coordination with public transit options','Safe, reliable, and punctual service','Reduces barriers to consistent attendance']), who_it_helps: 'Clients without reliable personal transportation who would otherwise struggle to attend scheduled sessions and appointments.' },
    { title: 'Nutrition & Meals', description: 'Warm breakfast and lunch provided daily to support the physical health and well-being of our clients during their program.', icon: 'Utensils', sort_order: 5, image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&auto=format&fit=crop', long_description: 'Good nutrition is a foundation of mental wellness. Every day, clients in our program receive a warm, nutritious breakfast and lunch. Beyond the physical benefits, shared mealtimes build community and give structure to each day. Our nutrition support reduces the burden on clients and their families while reinforcing the connection between healthy eating and mental health.', bullet_points: JSON.stringify(['Warm breakfast served every program day','Nutritious lunch prepared on-site','Mealtimes that build community and routine','Supports clients who may face food insecurity','Nutrition education integrated into wellness programming']), who_it_helps: 'All program participants who benefit from consistent, healthy nutrition as part of their daily recovery routine.' },
    { title: 'Social Skills Training', description: 'Structured social skills training and community activities that help clients rebuild connections and develop meaningful relationships.', icon: 'Users', sort_order: 6, image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop', long_description: 'Mental illness can erode social confidence and isolate individuals from their communities. Our social skills training program provides a structured, supportive space for clients to practice communication, build friendships, and rediscover their place in the world. Through group activities, role-playing, and guided interactions, clients develop the interpersonal tools they need to thrive.', bullet_points: JSON.stringify(['Structured communication and interpersonal skills training','Role-playing and real-world practice scenarios','Community outings and group activities','Conflict resolution and emotional regulation skills','Rebuilding confidence in social settings']), who_it_helps: 'Clients who have experienced social isolation, difficulty maintaining relationships, or challenges in community participation as a result of their illness.' },
    { title: 'Screening & Assessments', description: 'Comprehensive intake screenings and individualized treatment planning to create the most effective path forward for each client.', icon: 'Search', sort_order: 7, image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80&auto=format&fit=crop', long_description: 'Every successful treatment journey starts with truly understanding the individual. Our intake process includes comprehensive psychiatric, medical, and psychosocial screenings to develop a complete picture of each client\'s needs, strengths, and goals. From this foundation, our clinical team crafts a fully individualized treatment plan — reviewed and updated regularly as the client grows.', bullet_points: JSON.stringify(['Psychiatric and behavioral health screenings','Medical and psychosocial assessments','Individualized treatment plan development','Regular plan reviews and updates','Collaborative goal-setting with each client']), who_it_helps: 'New clients entering the program, as well as existing clients whose needs evolve over time and require updated care planning.' },
    { title: 'Relapse Prevention', description: 'Evidence-based relapse prevention programs designed to reduce hospitalizations and support long-term recovery and stability.', icon: 'Shield', sort_order: 8, image_url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=80&auto=format&fit=crop', long_description: 'Preventing relapse is at the heart of everything we do. Our evidence-based relapse prevention program equips clients with the knowledge, skills, and support systems to recognize warning signs and respond effectively before a crisis occurs. By reducing hospitalizations and supporting sustained stability, we help clients build lives of lasting independence and well-being.', bullet_points: JSON.stringify(['Early warning sign identification and monitoring','Personalized relapse prevention planning','Crisis de-escalation skills training','Family education and involvement','Ongoing support to reduce hospitalizations']), who_it_helps: 'Clients with a history of relapse or hospitalization who are working toward sustained stability and long-term independence.' },
  ];
  const insert = db.prepare('INSERT INTO services (title, description, icon, sort_order, image_url, long_description, bullet_points, who_it_helps) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const s of services) insert.run(s.title, s.description, s.icon, s.sort_order, s.image_url, s.long_description, s.bullet_points, s.who_it_helps);
}

// Seed detail content for existing services that have blank fields
const existingServices = db.prepare('SELECT id, title FROM services WHERE image_url = \'\' OR image_url IS NULL').all() as {id: number, title: string}[];
const detailSeeds: Record<string, { image_url: string, long_description: string, bullet_points: string, who_it_helps: string }> = {
  'Individual & Group Therapy': { image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80&auto=format&fit=crop', long_description: 'Our therapy program combines evidence-based individual and group sessions to help clients process their experiences, develop coping strategies, and build resilience. Each client works with a licensed clinician to create a personalized treatment plan. Group sessions, capped at 16 clients per clinician, foster community and shared healing in a safe, structured environment.', bullet_points: JSON.stringify(['Licensed therapists specializing in mental health disorders','Daily individual sessions tailored to each client','Group therapy capped at 16 clients per clinician','Cognitive Behavioral Therapy (CBT) and other evidence-based modalities','Safe, confidential, and supportive environment']), who_it_helps: 'Adults experiencing depression, bipolar disorder, schizophrenia, anxiety, or co-occurring substance use disorders who benefit from structured therapeutic support.' },
  'Case Management': { image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop', long_description: 'Our dedicated case managers serve as advocates and guides for every client. From coordinating appointments and connecting clients to community resources, to managing benefits and navigating complex healthcare systems — we ensure no one falls through the cracks.', bullet_points: JSON.stringify(['Personalized care coordination and planning','Benefits enrollment and assistance','Community resource referrals and linkage','Housing and financial stability support','Regular progress reviews and plan updates']), who_it_helps: 'Clients who need help organizing their care, managing benefits, or connecting with community resources to support their recovery.' },
  'Nursing Services': { image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80&auto=format&fit=crop', long_description: 'Our licensed nursing team delivers comprehensive medical care alongside behavioral health treatment. We believe physical health is inseparable from mental health — so we monitor, manage, and coordinate the full picture.', bullet_points: JSON.stringify(['Medication administration and management','Vital sign monitoring and documentation','Physician-ordered laboratory tests','Chronic condition management','Health education and wellness coaching']), who_it_helps: 'Clients managing chronic physical health conditions alongside mental illness, or those who require close medical monitoring.' },
  'Transportation Assistance': { image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80&auto=format&fit=crop', long_description: 'We remove one of the most common barriers to consistent care — transportation. Our transportation assistance program ensures clients can reliably attend their scheduled sessions, medical appointments, and program activities.', bullet_points: JSON.stringify(['Scheduled rides to and from the center','Support for medical appointment transportation','Coordination with public transit options','Safe, reliable, and punctual service','Reduces barriers to consistent attendance']), who_it_helps: 'Clients without reliable personal transportation who would otherwise struggle to attend scheduled sessions and appointments.' },
  'Nutrition & Meals': { image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&auto=format&fit=crop', long_description: 'Good nutrition is a foundation of mental wellness. Every day, clients in our program receive a warm, nutritious breakfast and lunch. Shared mealtimes build community and give structure to each day.', bullet_points: JSON.stringify(['Warm breakfast served every program day','Nutritious lunch prepared on-site','Mealtimes that build community and routine','Supports clients who may face food insecurity','Nutrition education integrated into wellness programming']), who_it_helps: 'All program participants who benefit from consistent, healthy nutrition as part of their daily recovery routine.' },
  'Social Skills Training': { image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop', long_description: 'Our social skills training program provides a structured, supportive space for clients to practice communication, build friendships, and rediscover their place in the world. Through group activities and guided interactions, clients develop the interpersonal tools they need to thrive.', bullet_points: JSON.stringify(['Structured communication and interpersonal skills training','Role-playing and real-world practice scenarios','Community outings and group activities','Conflict resolution and emotional regulation skills','Rebuilding confidence in social settings']), who_it_helps: 'Clients who have experienced social isolation or challenges in community participation as a result of their illness.' },
  'Screening & Assessments': { image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80&auto=format&fit=crop', long_description: 'Our intake process includes comprehensive psychiatric, medical, and psychosocial screenings to develop a complete picture of each client\'s needs, strengths, and goals. From this foundation, our clinical team crafts a fully individualized treatment plan.', bullet_points: JSON.stringify(['Psychiatric and behavioral health screenings','Medical and psychosocial assessments','Individualized treatment plan development','Regular plan reviews and updates','Collaborative goal-setting with each client']), who_it_helps: 'New clients entering the program, as well as existing clients whose needs evolve over time.' },
  'Relapse Prevention': { image_url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1200&q=80&auto=format&fit=crop', long_description: 'Our evidence-based relapse prevention program equips clients with the knowledge, skills, and support systems to recognize warning signs and respond effectively before a crisis occurs. By reducing hospitalizations, we help clients build lives of lasting independence.', bullet_points: JSON.stringify(['Early warning sign identification and monitoring','Personalized relapse prevention planning','Crisis de-escalation skills training','Family education and involvement','Ongoing support to reduce hospitalizations']), who_it_helps: 'Clients with a history of relapse or hospitalization who are working toward sustained stability and long-term independence.' },
};
const updateDetail = db.prepare('UPDATE services SET image_url=?, long_description=?, bullet_points=?, who_it_helps=? WHERE id=?');
for (const svc of existingServices) {
  const seed = detailSeeds[svc.title];
  if (seed) updateDetail.run(seed.image_url, seed.long_description, seed.bullet_points, seed.who_it_helps, svc.id);
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
