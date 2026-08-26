-- Blog CMS — follow-up fixes
--
-- 20260826_blog_cms.sql has already been applied to the live project. This file
-- carries two corrections found while running the import. Both are CREATE OR
-- REPLACE, so applying this is safe and repeatable.
--
-- Run in the Supabase SQL editor.

-- ── 1. refresh_blog_author_counts: pg-safeupdate ─────────────────────────────
-- The original body was a blanket UPDATE with no WHERE clause. This project
-- runs Supabase's pg-safeupdate extension, which rejects that outright with
-- SQLSTATE 21000, "UPDATE requires a WHERE clause" — so every call failed and
-- article_count never moved.
--
-- Joining against the freshly computed totals gives the required qualifier, and
-- the IS DISTINCT FROM test also skips rewriting rows whose count is unchanged.
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

-- ── 2. Ranked search ─────────────────────────────────────────────────────────
-- Filtering on search_vector works, but PostgREST returns matches in table
-- order: searching "bhimbetka" put the Bhimbetka article fifth behind four
-- posts that merely link to it. These articles cross-reference each other
-- heavily, so an unranked result set is close to useless.
--
-- ts_rank cannot be expressed as a PostgREST filter, so ranking needs a
-- function. The weights match the generated column: title A, excerpt B,
-- body C.
CREATE OR REPLACE FUNCTION search_blogs(
  search_query text,
  result_limit integer DEFAULT 9,
  result_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  excerpt text,
  featured_image_url text,
  featured_image_alt text,
  reading_time integer,
  views integer,
  published_at timestamptz,
  author_name text,
  author_slug text,
  category_name text,
  category_slug text,
  rank real,
  total_count bigint
)
LANGUAGE sql
STABLE
AS $$
  WITH matches AS (
    SELECT b.*,
           ts_rank(b.search_vector, websearch_to_tsquery('english', search_query)) AS r
      FROM blogs b
     WHERE b.status = 'published'
       AND b.search_vector @@ websearch_to_tsquery('english', search_query)
  )
  SELECT m.id, m.title, m.slug, m.excerpt,
         m.featured_image_url, m.featured_image_alt,
         m.reading_time, m.views, m.published_at,
         au.name, au.slug,
         c.name, c.slug,
         m.r,
         count(*) OVER () AS total_count
    FROM matches m
    LEFT JOIN blog_authors au ON au.id = m.author_id
    LEFT JOIN blog_categories c ON c.id = m.category_id
   -- Recency breaks ties between equally relevant posts.
   ORDER BY m.r DESC, m.published_at DESC
   LIMIT result_limit OFFSET result_offset;
$$;

GRANT EXECUTE ON FUNCTION search_blogs(text, integer, integer) TO anon, authenticated;
