
CREATE TABLE public.featured_publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.featured_publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publications are publicly readable" ON public.featured_publications FOR SELECT USING (true);
CREATE POLICY "Admins can manage publications" ON public.featured_publications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
