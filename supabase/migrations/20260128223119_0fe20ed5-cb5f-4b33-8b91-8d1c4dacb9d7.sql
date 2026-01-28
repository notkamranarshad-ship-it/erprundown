-- Create enums for controlled values
CREATE TYPE public.deployment_type AS ENUM ('SaaS', 'On-Prem', 'Hybrid');
CREATE TYPE public.company_size AS ENUM ('Small', 'Mid-market', 'Enterprise');
CREATE TYPE public.pricing_stance AS ENUM ('Quote-based', 'Starts at $', 'Free trial', 'Unknown');
CREATE TYPE public.implementation_time AS ENUM ('<3 months', '3-6 months', '6-12 months', '12+ months', 'Unknown');
CREATE TYPE public.lead_status AS ENUM ('New', 'Contacted', 'Qualified', 'Closed');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Features table for controlled vocabulary
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Industries table
CREATE TABLE public.industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  overview TEXT,
  key_requirements TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  short_description TEXT,
  long_description TEXT,
  website_url TEXT,
  deployment deployment_type[] DEFAULT '{}',
  company_size_fit company_size[] DEFAULT '{}',
  integrations TEXT[] DEFAULT '{}',
  pricing_stance pricing_stance DEFAULT 'Unknown',
  implementation_time implementation_time DEFAULT 'Unknown',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  screenshots TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  sponsored BOOLEAN DEFAULT false,
  sponsor_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table: vendors <-> features
CREATE TABLE public.vendor_features (
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE,
  PRIMARY KEY (vendor_id, feature_id)
);

-- Junction table: vendors <-> industries
CREATE TABLE public.vendor_industries (
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
  PRIMARY KEY (vendor_id, industry_id)
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  author_name TEXT DEFAULT 'ERPRundown Team',
  featured_image TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table: blog_posts <-> vendors
CREATE TABLE public.blog_post_vendors (
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, vendor_id)
);

-- Junction table: blog_posts <-> industries
CREATE TABLE public.blog_post_industries (
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, industry_id)
);

-- Case studies table
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  metrics TEXT[] DEFAULT '{}',
  featured_image TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  industry_id UUID REFERENCES public.industries(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  company_size TEXT,
  industry TEXT,
  vendors_interested TEXT[] DEFAULT '{}',
  message TEXT,
  source_page TEXT,
  status lead_status DEFAULT 'New',
  honeypot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Profiles table for user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Function to check user role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies for content tables (visitors can view)
CREATE POLICY "Features are publicly readable" ON public.features FOR SELECT USING (true);
CREATE POLICY "Industries are publicly readable" ON public.industries FOR SELECT USING (true);
CREATE POLICY "Vendors are publicly readable" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Vendor features are publicly readable" ON public.vendor_features FOR SELECT USING (true);
CREATE POLICY "Vendor industries are publicly readable" ON public.vendor_industries FOR SELECT USING (true);
CREATE POLICY "Blog posts are publicly readable" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Blog post vendors are publicly readable" ON public.blog_post_vendors FOR SELECT USING (true);
CREATE POLICY "Blog post industries are publicly readable" ON public.blog_post_industries FOR SELECT USING (true);
CREATE POLICY "Case studies are publicly readable" ON public.case_studies FOR SELECT USING (true);

-- Leads: Anyone can INSERT (form submission), only admins can read/update
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ADMIN write policies for content tables
CREATE POLICY "Admins can manage features" ON public.features FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage industries" ON public.industries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage vendors" ON public.vendors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage vendor features" ON public.vendor_features FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage vendor industries" ON public.vendor_industries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage blog post vendors" ON public.blog_post_vendors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage blog post industries" ON public.blog_post_industries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage case studies" ON public.case_studies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles: Only admins can manage roles
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles: Users can view their own, admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_vendors_featured ON public.vendors(featured) WHERE featured = true;
CREATE INDEX idx_vendors_slug ON public.vendors(slug);
CREATE INDEX idx_industries_featured ON public.industries(featured) WHERE featured = true;
CREATE INDEX idx_industries_slug ON public.industries(slug);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at DESC);
CREATE INDEX idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX idx_case_studies_published ON public.case_studies(published_at DESC);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);