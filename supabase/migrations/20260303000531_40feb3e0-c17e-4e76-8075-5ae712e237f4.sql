
-- 1. Hero vendors selection table
CREATE TABLE public.hero_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(vendor_id)
);

ALTER TABLE public.hero_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero vendors are publicly readable" ON public.hero_vendors FOR SELECT USING (true);
CREATE POLICY "Admins can manage hero vendors" ON public.hero_vendors FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Add core_problems column to industries
ALTER TABLE public.industries ADD COLUMN core_problems text[] DEFAULT '{}'::text[];
