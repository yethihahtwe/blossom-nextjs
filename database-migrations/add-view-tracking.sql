-- Add view tracking to existing tables
-- Run this in your Supabase SQL Editor

-- Add view_count columns to existing tables
ALTER TABLE news ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create page_views table for detailed tracking
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('news', 'announcement')),
  content_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_content ON page_views(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_news_view_count ON news(view_count);
CREATE INDEX IF NOT EXISTS idx_announcements_view_count ON announcements(view_count);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, record_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF table_name = 'news' THEN
    UPDATE news 
    SET view_count = view_count + 1 
    WHERE id = record_id
    RETURNING view_count INTO new_count;
  ELSIF table_name = 'announcements' THEN
    UPDATE announcements 
    SET view_count = view_count + 1 
    WHERE id = record_id
    RETURNING view_count INTO new_count;
  ELSE
    RAISE EXCEPTION 'Invalid table name: %', table_name;
  END IF;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS (Row Level Security) for page_views table
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to page_views for analytics
CREATE POLICY "Allow public read access to page_views" ON page_views
  FOR SELECT USING (true);

-- Create policy to allow public insert for tracking views
CREATE POLICY "Allow public insert to page_views" ON page_views
  FOR INSERT WITH CHECK (true);

-- Update RLS policies for news and announcements to allow view_count updates
-- (These should already exist, but we're ensuring they allow updates)

-- For news table
DROP POLICY IF EXISTS "Allow public read access to published news" ON news;
CREATE POLICY "Allow public read access to published news" ON news
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Allow public update view_count on news" ON news;
CREATE POLICY "Allow public update view_count on news" ON news
  FOR UPDATE USING (status = 'published')
  WITH CHECK (status = 'published');

-- For announcements table
DROP POLICY IF EXISTS "Allow public read access to published announcements" ON announcements;
CREATE POLICY "Allow public read access to published announcements" ON announcements
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Allow public update view_count on announcements" ON announcements;
CREATE POLICY "Allow public update view_count on announcements" ON announcements
  FOR UPDATE USING (status = 'published')
  WITH CHECK (status = 'published');

-- Create a view for analytics dashboard
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  'Total Views' as metric,
  (SELECT COALESCE(SUM(view_count), 0) FROM news) + 
  (SELECT COALESCE(SUM(view_count), 0) FROM announcements) as value,
  'combined' as type
UNION ALL
SELECT 
  'News Views' as metric,
  COALESCE(SUM(view_count), 0) as value,
  'news' as type
FROM news
UNION ALL
SELECT 
  'Announcement Views' as metric,
  COALESCE(SUM(view_count), 0) as value,
  'announcements' as type
FROM announcements;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON analytics_summary TO anon, authenticated;
GRANT ALL ON page_views TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count TO anon, authenticated;