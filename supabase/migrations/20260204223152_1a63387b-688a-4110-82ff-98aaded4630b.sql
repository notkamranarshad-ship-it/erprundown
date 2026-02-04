-- Create authors table
CREATE TABLE public.authors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authors are publicly readable" 
ON public.authors 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage authors" 
ON public.authors 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default author
INSERT INTO public.authors (name, slug, title, image_url, is_default)
VALUES ('Kamran Arshad', 'kamran-arshad', 'Founder at ERPRundown', NULL, true);

-- Add author_id foreign key to blog_posts (optional linking)
ALTER TABLE public.blog_posts 
ADD COLUMN author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL;