CREATE TABLE public.advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  role text,
  company text,
  short_bio text,
  long_bio text,
  image_url text,
  linkedin_url text,
  twitter_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advisors are publicly readable" ON public.advisors FOR SELECT USING (true);
CREATE POLICY "Admins can manage advisors" ON public.advisors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed with existing hardcoded data
INSERT INTO public.advisors (slug, name, role, company, short_bio, long_bio, image_url, linkedin_url, twitter_url, display_order) VALUES
('john-mitchell', 'John Mitchell', 'CEO', 'TechVentures Inc.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '/placeholder.svg', 'https://linkedin.com/in/example', 'https://twitter.com/example', 1),
('sarah-chen', 'Sarah Chen', 'CTO', 'CloudScale Systems', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '/placeholder.svg', NULL, NULL, 2),
('michael-rodriguez', 'Michael Rodriguez', 'Managing Partner', 'Summit Capital', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '/placeholder.svg', NULL, NULL, 3),
('emily-watson', 'Emily Watson', 'VP of Product', 'Enterprise Solutions', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '/placeholder.svg', NULL, NULL, 4),
('david-kim', 'David Kim', 'Founder', 'DataFlow Analytics', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '/placeholder.svg', NULL, NULL, 5),
('amanda-foster', 'Amanda Foster', 'Chief Strategy Officer', 'Global Tech Partners', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '/placeholder.svg', NULL, NULL, 6);