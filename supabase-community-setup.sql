-- ============================================
-- Dual Persian Community Platform — Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Forum Categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text DEFAULT '💬',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON forum_categories FOR SELECT USING (true);

-- Seed default categories
INSERT INTO forum_categories (name, slug, description, icon, sort_order) VALUES
  ('Culture & Identity', 'culture-identity', 'Discuss Persian heritage, traditions, and the dual-culture experience', '🏛️', 1),
  ('Relationships', 'relationships', 'Dating advice, marriage, and relationship discussions', '❤️', 2),
  ('Parenting', 'parenting', 'Raising bilingual and bicultural children', '👨‍👩‍👧‍👦', 3),
  ('Career & Education', 'career-education', 'Professional networking, job advice, and educational resources', '💼', 4),
  ('Food & Recipes', 'food-recipes', 'Share and discover Persian recipes and food culture', '🍽️', 5),
  ('Events & Meetups', 'events-meetups', 'Local and virtual community gatherings', '📅', 6),
  ('General Discussion', 'general', 'Everything else — open conversation', '💬', 7)
ON CONFLICT (slug) DO NOTHING;

-- 2. Forum Threads
CREATE TABLE IF NOT EXISTS forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES forum_categories(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  reply_count int DEFAULT 0,
  last_reply_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view threads" ON forum_threads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create threads" ON forum_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own threads" ON forum_threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own threads" ON forum_threads FOR DELETE USING (auth.uid() = author_id);

-- 3. Forum Replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES forum_threads(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own replies" ON forum_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own replies" ON forum_replies FOR DELETE USING (auth.uid() = author_id);

-- 4. Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  event_date date NOT NULL,
  event_time time,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'United Kingdom',
  venue text,
  organiser_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = organiser_id);
CREATE POLICY "Organisers can update own events" ON events FOR UPDATE USING (auth.uid() = organiser_id);
CREATE POLICY "Organisers can delete own events" ON events FOR DELETE USING (auth.uid() = organiser_id);

-- Seed some sample events
INSERT INTO events (title, description, event_date, event_time, city, country, venue) VALUES
  ('Persian Culture Night', 'An evening of poetry, music, and Persian cuisine in the heart of Los Angeles.', '2026-04-29', '19:00', 'Los Angeles', 'United States', 'The Persian Cultural Center'),
  ('Nowruz Celebration 2026', 'Join us for a community Nowruz celebration with live music, Haft-Sin, and family activities.', '2026-03-20', '18:00', 'London', 'United Kingdom', 'Kensington Olympia'),
  ('Persian Book Club', 'Monthly book club discussing contemporary Iranian literature in translation.', '2026-05-10', '14:00', 'Toronto', 'Canada', 'Koerner Hall Library'),
  ('Sydney Persian Picnic', 'Family-friendly outdoor gathering for the Persian community in Sydney.', '2026-05-15', '11:00', 'Sydney', 'Australia', 'Centennial Park')
ON CONFLICT DO NOTHING;

-- 5. Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('interested', 'going')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view RSVPs" ON event_rsvps FOR SELECT USING (true);
CREATE POLICY "Users can RSVP" ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own RSVP" ON event_rsvps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove own RSVP" ON event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- 6. Function to auto-increment reply count
CREATE OR REPLACE FUNCTION update_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_threads SET reply_count = reply_count + 1, last_reply_at = now() WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_threads SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.thread_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_reply_change ON forum_replies;
CREATE TRIGGER on_reply_change
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_thread_reply_count();
