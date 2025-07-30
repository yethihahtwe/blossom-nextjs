-- Create announcements table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_published_at ON announcements(published_at);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_slug ON announcements(slug);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_announcements_updated_at();

-- Row Level Security Policies
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy for public to read published announcements
CREATE POLICY "Public can read published announcements" ON announcements
  FOR SELECT USING (status = 'published' AND published_at IS NOT NULL);

-- Policy for authenticated users to manage announcements (admin operations)
CREATE POLICY "Authenticated users can manage announcements" ON announcements
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert some sample announcements for testing
INSERT INTO announcements (title, slug, content, excerpt, priority, status, published_at) VALUES
(
  'Important: School Reopening Guidelines',
  'school-reopening-guidelines',
  '<p>Dear Parents and Students,</p><p>We are excited to announce the reopening of our school campus. Please review the following guidelines to ensure a safe return to in-person learning.</p><h3>Health and Safety Measures</h3><ul><li>Daily health screening required</li><li>Face masks mandatory in common areas</li><li>Social distancing protocols in place</li></ul><p>We look forward to welcoming everyone back!</p>',
  'Essential guidelines for our safe return to campus learning. Please review all health and safety requirements.',
  'important',
  'published',
  NOW() - INTERVAL '2 days'
),
(
  'Urgent: Weather Alert - Early Dismissal',
  'weather-alert-early-dismissal',
  '<p>Due to severe weather conditions expected this afternoon, we are implementing early dismissal procedures.</p><h3>Dismissal Schedule</h3><ul><li>Elementary: 1:00 PM</li><li>Middle School: 1:15 PM</li><li>High School: 1:30 PM</li></ul><p>All after-school activities are cancelled. Please ensure safe transportation arrangements.</p>',
  'Early dismissal due to severe weather. All after-school activities cancelled.',
  'urgent',
  'published',
  NOW() - INTERVAL '1 hour'
),
(
  'Annual Science Fair - Call for Participants',
  'annual-science-fair-participants',
  '<p>The annual Blossom Science Fair is approaching! We invite all students from grades 6-12 to participate in this exciting event.</p><h3>Important Dates</h3><ul><li>Registration Deadline: March 15</li><li>Project Submission: April 1</li><li>Science Fair Event: April 15</li></ul><p>Prizes will be awarded in multiple categories. Contact the science department for more information.</p>',
  'Join our annual science fair! Registration open for grades 6-12. Exciting prizes await!',
  'normal',
  'published',
  NOW() - INTERVAL '5 days'
);

COMMENT ON TABLE announcements IS 'Stores school announcements with priority levels';
COMMENT ON COLUMN announcements.priority IS 'Priority level: normal, important, or urgent';
COMMENT ON COLUMN announcements.status IS 'Publication status: draft or published';
COMMENT ON COLUMN announcements.excerpt IS 'Brief summary for listing pages and notifications';