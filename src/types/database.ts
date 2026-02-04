// Custom type definitions for ERPRundown
// These complement the auto-generated Supabase types

export type DeploymentType = 'SaaS' | 'On-Prem' | 'Hybrid';
export type CompanySize = 'Small' | 'Mid-market' | 'Enterprise';
export type PricingStance = 'Quote-based' | 'Starts at $' | 'Free trial' | 'Unknown';
export type ImplementationTime = '<3 months' | '3-6 months' | '6-12 months' | '12+ months' | 'Unknown';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Closed';
export type AppRole = 'admin' | 'moderator' | 'user';

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  short_description: string | null;
  long_description: string | null;
  website_url: string | null;
  deployment: DeploymentType[] | null;
  company_size_fit: CompanySize[] | null;
  integrations: string[] | null;
  pricing_stance: PricingStance | null;
  implementation_time: ImplementationTime | null;
  pros: string[] | null;
  cons: string[] | null;
  screenshots: string[] | null;
  featured: boolean | null;
  sponsored: boolean | null;
  sponsor_label: string | null;
  top_clients: string[] | null;
  partner_names: string[] | null;
  key_differentiators: string[] | null;
  awards: string[] | null;
  user_rating: number | null;
  reviews_count: number | null;
  created_at: string;
  updated_at: string;
  // Relations
  industries?: Industry[];
  features?: Feature[];
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  overview: string | null;
  key_requirements: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  vendors?: Vendor[];
}

export interface Feature {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  author_name: string;
  author_title: string | null;
  co_author_name: string | null;
  co_author_title: string | null;
  verified_by_name: string | null;
  verified_by_title: string | null;
  featured_image: string | null;
  published_at: string;
  updated_at: string;
  created_at: string;
  // Relations
  vendors?: Vendor[];
  industries?: Industry[];
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  metrics: string[];
  featured_image: string | null;
  published_at: string;
  industry_id: string | null;
  vendor_id: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  industry?: Industry;
  vendor?: Vendor;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  company_size: string | null;
  industry: string | null;
  vendors_interested: string[];
  message: string | null;
  source_page: string | null;
  status: LeadStatus;
  honeypot: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  company?: string;
  role?: string;
  company_size?: string;
  industry?: string;
  vendors_interested?: string[];
  message?: string;
  source_page?: string;
  honeypot?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  short_description: string | null;
  long_description: string | null;
  website_url: string | null;
  headquarters: string | null;
  year_founded: number | null;
  employees_count: string | null;
  regions_served: string[] | null;
  erp_specializations: string[] | null;
  industries_served: string[] | null;
  services_offered: string[] | null;
  certifications: string[] | null;
  notable_clients: string[] | null;
  featured: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
