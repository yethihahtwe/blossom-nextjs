-- Blossom Private School Complete Database Schema
-- Run this in your Supabase SQL Editor to create all required tables, storage, and policies
-- This file consolidates all database setup in one place

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

-- Allow authenticated users to manage all content (admin operations)
CREATE POLICY "Authenticated users can manage news" ON news
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage announcements" ON announcements
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Storage Setup
-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete their images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Create trigger to automatically update updated_at for categories
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name) VALUES
('School Events'),
('Academic Events'),
('Facilities'),
('Cultural Events'),
('Programs'),
('Academic Programs'),
('General')
ON CONFLICT (name) DO NOTHING;

-- Set up Row Level Security for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'contact_form')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);

-- Create trigger to automatically update updated_at for notifications
CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage all notifications (admin operations)
CREATE POLICY "Authenticated users can manage notifications" ON notifications
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Note: Use service role key for admin operations to bypass RLS securely

-- Slider Images Table
CREATE TABLE IF NOT EXISTS slider_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for slider images
CREATE INDEX IF NOT EXISTS idx_slider_images_display_order ON slider_images(display_order);
CREATE INDEX IF NOT EXISTS idx_slider_images_is_active ON slider_images(is_active);

-- Create trigger to automatically update updated_at for slider images
CREATE TRIGGER update_slider_images_updated_at 
  BEFORE UPDATE ON slider_images 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security for slider images
ALTER TABLE slider_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active slider images
CREATE POLICY "Allow public read access to active slider images" ON slider_images
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage all slider images (admin operations)
CREATE POLICY "Authenticated users can manage slider images" ON slider_images
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert default slider images
INSERT INTO slider_images (title, alt_text, image_url, display_order, is_active) VALUES
('Blossom Private School', 'Blossom Private School', '/slider-01.png', 1, true),
('Campus Life', 'Campus Life', '/slider-02.png', 2, true),
('Academic Excellence', 'Academic Excellence', '/slider-03.png', 3, true)
ON CONFLICT DO NOTHING;

-- Note: For admin operations (create, update, delete), you'll need to set up authentication
-- and create appropriate policies for authenticated users with admin roles