-- Add author bio fields to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS author_title text,
ADD COLUMN IF NOT EXISTS co_author_name text,
ADD COLUMN IF NOT EXISTS co_author_title text,
ADD COLUMN IF NOT EXISTS verified_by_name text,
ADD COLUMN IF NOT EXISTS verified_by_title text;