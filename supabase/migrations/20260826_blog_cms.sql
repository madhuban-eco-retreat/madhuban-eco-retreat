-- Blog CMS — schema, seed data and RLS
--
-- Moves the blog off the MongoDB backend (madhuban-backend-s1l7.onrender.com)
-- and into this project's Supabase, so posts share the admin panel's auth and
-- the booking engine's database instead of a second service.
--
-- Run this in the Supabase SQL editor BEFORE running scripts/migrate-blogs.js.
-- Every statement is idempotent, so re-running it is safe.
--
-- IMAGE STORAGE: images live in Cloudflare R2 (bucket madhuban-eco-retreat-images),
-- not Cloudinary. The repo already holds working R2 credentials and
-- next.config.mjs whitelists the r2.dev hosts for next/image; adding Cloudinary
-- would have meant a second asset host and a new set of secrets. Columns
-- therefore store an R2 object key alongside the public URL.

-- ── 1. Authors ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text,
  designation text,
  avatar_url text,
  avatar_r2_key text,
  avatar_alt text,
  twitter_url text,
  linkedin_url text,
  instagram_url text,
  email text,
  -- Denormalised for author cards; recomputed by refresh_blog_author_counts().
  article_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── 2. Categories ────────────────────────────────────────────────────────────
-- Deliberately no "All" row. "All" is the unfiltered view, not something a post
-- can belong to; as a real row it would show up in the admin category picker and
-- let posts be filed under it, which no listing query would then match.
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  image_r2_key text,
  image_alt text,
  meta_title text,
  meta_description text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── 3. Blogs ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,                      -- rich-text HTML from the TipTap editor
  featured_image_url text,
  featured_image_r2_key text,
  featured_image_alt text,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES blog_authors(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  meta_title text,
  meta_description text,
  focus_keyword text,
  keywords text[],
  reading_time integer,              -- whole minutes
  views integer NOT NULL DEFAULT 0,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags text[],
  schema_markup jsonb,
  og_image_url text,
  canonical_url text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Provenance for the one-time MongoDB import. legacy_uid is the old `uid`,
  -- which is also the live URL slug — keeping it lets the importer re-run
  -- without duplicating rows, and proves which posts came from the old system.
  legacy_mongo_id text UNIQUE,
  legacy_uid text
);

-- ── 4. Blog images ───────────────────────────────────────────────────────────
-- One row per image uploaded through the editor, so orphaned R2 objects can be
-- found and swept later.
CREATE TABLE IF NOT EXISTS blog_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
  r2_key text NOT NULL UNIQUE,
  url text NOT NULL,
  alt_text text,
  caption text,
  file_name text,
  width integer,
  height integer,
  size_bytes integer,
  format text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── 5. Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category_id ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_legacy_uid ON blogs(legacy_uid);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_authors_slug ON blog_authors(slug);
CREATE INDEX IF NOT EXISTS idx_blog_images_blog_id ON blog_images(blog_id);

-- Full-text search over title/excerpt/content, weighted so a title hit ranks
-- above a passing mention in the body.
--
-- This is a stored generated column rather than a bare expression index because
-- PostgREST can only run .textSearch() against a real column. An expression
-- index would be unreachable from supabase-js and every search would fall back
-- to a sequential scan.
--
-- Postgres caps a tsvector at 1 MB. Bodies stay far below that because images
-- are uploaded to R2 rather than inlined — the largest imported post is ~219 KB.
-- If the editor ever starts saving base64 images into `content` again, inserts
-- will fail here rather than merely bloating the row.
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_blogs_fts ON blogs USING gin (search_vector);

-- ── 6. updated_at triggers ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_authors_updated_at ON blog_authors;
CREATE TRIGGER update_blog_authors_updated_at BEFORE UPDATE ON blog_authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 7. Author article counts ─────────────────────────────────────────────────
-- Called by the importer and by the admin panel after publish/unpublish, rather
-- than recomputed on every read.
-- The WHERE clause is required, not decorative: this project runs Supabase's
-- pg-safeupdate extension, which rejects any UPDATE without a qualifier with
-- SQLSTATE 21000 ("UPDATE requires a WHERE clause"). Comparing against the
-- freshly computed count also skips writing rows whose total has not moved.
CREATE OR REPLACE FUNCTION refresh_blog_author_counts()
RETURNS void AS $$
  UPDATE blog_authors a
     SET article_count = c.n
    FROM (
      SELECT au.id, COUNT(b.id)::integer AS n
        FROM blog_authors au
        LEFT JOIN blogs b
          ON b.author_id = au.id AND b.status = 'published'
       GROUP BY au.id
    ) c
   WHERE c.id = a.id
     AND a.article_count IS DISTINCT FROM c.n;
$$ LANGUAGE sql;

-- ── 7b. View counter ─────────────────────────────────────────────────────────
-- SECURITY DEFINER because the public read policy deliberately grants no UPDATE
-- on blogs; without it an anon caller's increment silently does nothing. The
-- single UPDATE ... SET views = views + 1 is also atomic, unlike reading the
-- count and writing it back, which loses hits under concurrent traffic.
CREATE OR REPLACE FUNCTION increment_blog_views(blog_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE blogs SET views = views + 1
   WHERE slug = blog_slug AND status = 'published';
$$;

GRANT EXECUTE ON FUNCTION increment_blog_views(text) TO anon, authenticated;

-- ── 8. Row level security ────────────────────────────────────────────────────
-- The admin panel writes through the service-role client, which bypasses RLS
-- entirely; these policies are the second line of defence for anything that
-- ever reaches these tables with an anon or user JWT.
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
CREATE POLICY "Public read published blogs" ON blogs
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access blogs" ON blogs;
CREATE POLICY "Admin full access blogs" ON blogs
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles WHERE role = 'admin' AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Public read authors" ON blog_authors;
CREATE POLICY "Public read authors" ON blog_authors
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access authors" ON blog_authors;
CREATE POLICY "Admin full access authors" ON blog_authors
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles WHERE role = 'admin' AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Public read categories" ON blog_categories;
CREATE POLICY "Public read categories" ON blog_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access categories" ON blog_categories;
CREATE POLICY "Admin full access categories" ON blog_categories
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles WHERE role = 'admin' AND is_active = true
    )
  );

-- Image rows carry no secrets and are referenced from published HTML, so they
-- are readable outright.
DROP POLICY IF EXISTS "Public read blog images" ON blog_images;
CREATE POLICY "Public read blog images" ON blog_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access blog images" ON blog_images;
CREATE POLICY "Admin full access blog images" ON blog_images
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles WHERE role = 'admin' AND is_active = true
    )
  );

-- ── 9. Seed categories ───────────────────────────────────────────────────────
INSERT INTO blog_categories (name, slug, description, display_order, meta_title, meta_description) VALUES
  ('Wildlife & Nature', 'wildlife-and-nature',
   'Stories about wildlife and nature at Ratapani Tiger Reserve', 1,
   'Wildlife & Nature Blogs | Madhuban Eco Retreat',
   'Explore wildlife and nature stories from Ratapani Tiger Reserve near Bhopal.'),
  ('Ratapani Tiger Reserve', 'ratapani-tiger-reserve',
   'Complete guides about Ratapani Tiger Reserve', 2,
   'Ratapani Tiger Reserve Blogs | Madhuban Eco Retreat',
   'Read complete guides and stories about Ratapani Tiger Reserve near Bhopal.'),
  ('Experiences', 'experiences',
   'Guest experiences and activities at Madhuban Eco Retreat', 3,
   'Experiences Blogs | Madhuban Eco Retreat',
   'Read about unique experiences and activities at Madhuban Eco Retreat near Ratapani Tiger Reserve.'),
  ('Heritage', 'heritage',
   'Cultural heritage and history of the region', 4,
   'Heritage Blogs | Madhuban Eco Retreat',
   'Explore the cultural heritage and history of Madhya Pradesh near Ratapani Tiger Reserve.'),
  ('Others', 'others',
   'Other interesting stories from Madhuban', 5,
   'Other Blogs | Madhuban Eco Retreat',
   'Read other interesting stories and updates from Madhuban Eco Retreat.')
ON CONFLICT (slug) DO NOTHING;

-- ── 10. Seed authors ─────────────────────────────────────────────────────────
-- Anuj Sharma is not in the original plan but writes one of the live posts
-- (ratapani-tiger-reserve); without a row the import would silently reattribute
-- that article to the house account.
INSERT INTO blog_authors (name, slug, bio, designation, is_active) VALUES
  ('Mousam Kourav', 'mousam-kourav',
   'Mousam Kourav is a nature enthusiast and travel writer based in Madhya Pradesh. With a deep passion for wildlife and eco-tourism, he writes about Ratapani Tiger Reserve, eco-luxury stays, and sustainable travel experiences near Bhopal.',
   'Nature Writer & Travel Enthusiast', true),
  ('Mitali Pawar', 'mitali-pawar',
   'Mitali Pawar is a wildlife photographer and content creator who specializes in documenting the rich biodiversity of Central India. Her writing focuses on wildlife conservation, forest treks, and immersive nature experiences.',
   'Wildlife Writer & Photographer', true),
  ('Anuj Sharma', 'anuj-sharma',
   'Anuj Sharma writes about the forests, forts and lesser-known trails of Central India, with a focus on Ratapani Tiger Reserve and the heritage sites around Bhopal.',
   'Contributing Writer', true),
  ('Madhuban Eco Retreat', 'madhuban-eco-retreat',
   'Official blog of Madhuban Eco Retreat — an eco-luxury forest resort nestled at the edge of Ratapani Tiger Reserve, near Bhopal, Madhya Pradesh.',
   'Official Blog', true)
ON CONFLICT (slug) DO NOTHING;
