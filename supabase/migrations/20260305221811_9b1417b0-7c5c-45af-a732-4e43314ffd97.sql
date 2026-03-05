
DELETE FROM public.featured_publications;

INSERT INTO public.featured_publications (name, logo_url, website_url, display_order) VALUES
  ('Forbes', 'https://logo.clearbit.com/forbes.com', 'https://www.forbes.com', 1),
  ('TechCrunch', 'https://logo.clearbit.com/techcrunch.com', 'https://techcrunch.com', 2),
  ('Wall Street Journal', 'https://logo.clearbit.com/wsj.com', 'https://www.wsj.com', 3),
  ('Inc.', 'https://logo.clearbit.com/inc.com', 'https://www.inc.com', 4),
  ('Gartner', 'https://logo.clearbit.com/gartner.com', 'https://www.gartner.com', 5),
  ('Business Insider', 'https://logo.clearbit.com/businessinsider.com', 'https://www.businessinsider.com', 6);
