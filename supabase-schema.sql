-- Blossom Private School Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(100),
  reading_time INTEGER,
  published_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
  published_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON announcements(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_news_updated_at 
  BEFORE UPDATE ON news 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at 
  BEFORE UPDATE ON announcements 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample news data
INSERT INTO news (title, slug, content, excerpt, featured_image, category, author, reading_time, published_at, status) VALUES
(
  'Annual Science Fair 2024 - Students Showcase Innovation',
  'annual-science-fair-2024',
  'Students from all grade levels participated in our Annual Science Fair 2024, demonstrating remarkable creativity and scientific thinking across various fields including biology, chemistry, physics, and environmental science. The event showcased innovative projects that addressed real-world problems and demonstrated the students'' deep understanding of scientific principles.',
  'Students showcase their innovative scientific projects at our Annual Science Fair 2024, demonstrating creativity and scientific thinking across various fields.',
  '/science-fair.jpg',
  'Academic Events',
  'Dr. Khin Khin Win',
  3,
  '2024-03-15T10:00:00Z',
  'published'
),
(
  'New Digital Library Opens for Students',
  'new-digital-library-opens',
  'Our new state-of-the-art digital library has officially opened, providing students with access to over 10,000 e-books, academic journals, and educational resources. The facility features modern study spaces, computer workstations, and collaborative learning areas designed to enhance the learning experience for all students.',
  'Our new Digital Library opens with over 10,000 e-books and educational resources, enhancing learning opportunities for all students.',
  '/digital-library.jpg',
  'Facilities',
  'Ms. Thant Sin Aye',
  2,
  '2024-03-10T14:30:00Z',
  'published'
),
(
  'Cultural Festival Celebrates Diversity and Unity',
  'cultural-festival-2024',
  'The annual Cultural Festival was a vibrant celebration of diversity and unity, featuring traditional performances, art exhibitions, and cultural workshops. Students, teachers, and families came together to showcase Myanmar''s rich cultural heritage through music, dance, traditional crafts, and culinary demonstrations.',
  'Our Cultural Festival celebrates diversity with traditional performances, exhibitions, and workshops showcasing Myanmar and international heritage.',
  '/cultural-festival.png',
  'Cultural Events',
  'U Thura Aung',
  2,
  '2024-02-28T16:00:00Z',
  'published'
),
(
  'Character Building Program Launches New Initiative',
  'character-building-program-launch',
  'We are excited to announce the launch of our enhanced Character Building Program, designed to develop integrity, compassion, leadership, and global citizenship in our students. The program incorporates mindfulness practices, community service projects, and leadership development activities.',
  'Our enhanced Character Building Program focuses on developing integrity, compassion, leadership, and global citizenship in our students.',
  '/building-character.jpg',
  'Programs',
  'Ms. Aye Aye Mon',
  3,
  '2024-02-20T09:00:00Z',
  'published'
),
(
  'Cambridge English Qualifications Program Update',
  'cambridge-english-program-update',
  'We are pleased to share exciting updates about our Cambridge English Qualifications Program. Our students have achieved excellent results in recent examinations, with a 95% pass rate across all levels. The program continues to expand with new course offerings and enhanced preparation materials.',
  'Updates on our Cambridge English Qualifications Program showing excellent student achievements and program expansion.',
  '/cambridge_light_mode.png',
  'Academic Programs',
  'Ms. Emily Johnson',
  2,
  '2024-02-15T11:00:00Z',
  'published'
),
(
  'Upcoming Parent-Teacher Conference Schedule',
  'parent-teacher-conference-schedule',
  'We cordially invite all parents and guardians to attend our upcoming Parent-Teacher Conferences scheduled for April 1-6, 2024. These conferences provide an excellent opportunity to discuss your child''s academic progress, social development, and future educational goals with their teachers.',
  'Parent-Teacher Conferences scheduled for April 1-6, 2024. Book your appointment early to discuss your child''s progress.',
  '/blossom-logo.png',
  'School Events',
  'Principal Daw Khin Thida',
  2,
  '2024-03-18T08:00:00Z',
  'published'
);

-- Insert sample announcement data
INSERT INTO announcements (title, slug, content, excerpt, priority, published_at, status) VALUES
(
  'School Closure Notice - National Holiday',
  'school-closure-national-holiday',
  'Please be informed that the school will be closed on March 27, 2024, in observance of Armed Forces Day (National Holiday). Regular classes will resume on March 28, 2024. All after-school activities and events scheduled for March 27 are also cancelled.',
  'School will be closed on March 27, 2024, for Armed Forces Day. Regular classes resume March 28, 2024.',
  'important',
  '2024-03-25T09:00:00Z',
  'published'
),
(
  'New Lunch Menu Available',
  'new-lunch-menu-available',
  'We are excited to introduce our new lunch menu featuring healthy, nutritious options for all students. The menu includes local and international dishes, vegetarian options, and special dietary considerations. Menus are available at the school office and on our website.',
  'New healthy lunch menu now available with local and international options for all students.',
  'normal',
  '2024-03-20T12:00:00Z',
  'published'
),
(
  'Emergency Contact Information Update Required',
  'emergency-contact-update-required',
  'URGENT: All parents are required to update their emergency contact information by March 30, 2024. Please visit the school office or use our online portal to ensure we have your current phone numbers, email addresses, and emergency contacts on file.',
  'All parents must update emergency contact information by March 30, 2024.',
  'urgent',
  '2024-03-22T08:00:00Z',
  'published'
);

-- Set up Row Level Security (RLS) policies
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Allow public read access to published news" ON news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read access to published announcements" ON announcements
  FOR SELECT USING (status = 'published');

-- Note: For admin operations (create, update, delete), you'll need to set up authentication
-- and create appropriate policies for authenticated users with admin roles