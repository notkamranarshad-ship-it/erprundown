-- Create a public view that excludes sensitive fields (email)
CREATE VIEW public.authors_public
WITH (security_invoker=on) AS
SELECT id, name, slug, title, bio, image_url, linkedin_url, twitter_url, is_default, created_at, updated_at
FROM public.authors;

-- Grant SELECT on the view to anon and authenticated users
GRANT SELECT ON public.authors_public TO anon, authenticated;