import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Vendor, Industry, Feature } from "@/types/database";

export function useVendors(options?: {
  featured?: boolean;
  limit?: number;
  search?: string;
  deployment?: string[];
  companySize?: string[];
  industrySlug?: string;
}) {
  return useQuery({
    queryKey: ["vendors", options],
    queryFn: async () => {
      let query = supabase
        .from("vendors")
        .select("*")
        .order("featured", { ascending: false })
        .order("name", { ascending: true });

      if (options?.featured) {
        query = query.eq("featured", true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.search) {
        query = query.ilike("name", `%${options.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch related industries and features for each vendor
      const vendorIds = data?.map((v) => v.id) || [];
      
      // Get industries
      const { data: vendorIndustries } = await supabase
        .from("vendor_industries")
        .select(`
          vendor_id,
          industries(*)
        `)
        .in("vendor_id", vendorIds);

      // Get features
      const { data: vendorFeatures } = await supabase
        .from("vendor_features")
        .select(`
          vendor_id,
          features(*)
        `)
        .in("vendor_id", vendorIds);

      // Map relations to vendors
      const vendors = data?.map((vendor) => ({
        ...vendor,
        industries: vendorIndustries
          ?.filter((vi) => vi.vendor_id === vendor.id)
          .map((vi) => vi.industries as Industry) || [],
        features: vendorFeatures
          ?.filter((vf) => vf.vendor_id === vendor.id)
          .map((vf) => vf.features as Feature) || [],
      })) as Vendor[];

      return vendors;
    },
  });
}

export function useVendor(slug: string) {
  return useQuery({
    queryKey: ["vendor", slug],
    queryFn: async () => {
      const { data: vendor, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!vendor) return null;

      // Get industries
      const { data: vendorIndustries } = await supabase
        .from("vendor_industries")
        .select(`
          industries(*)
        `)
        .eq("vendor_id", vendor.id);

      // Get features
      const { data: vendorFeatures } = await supabase
        .from("vendor_features")
        .select(`
          features(*)
        `)
        .eq("vendor_id", vendor.id);

      return {
        ...vendor,
        industries: vendorIndustries?.map((vi) => vi.industries as Industry) || [],
        features: vendorFeatures?.map((vf) => vf.features as Feature) || [],
      } as Vendor;
    },
    enabled: !!slug,
  });
}

export function useVendorsBySlug(slugs: string[]) {
  return useQuery({
    queryKey: ["vendors-by-slug", slugs],
    queryFn: async () => {
      if (slugs.length === 0) return [];

      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .in("slug", slugs);

      if (error) throw error;

      // Get industries for all vendors
      const vendorIds = data?.map((v) => v.id) || [];
      
      const { data: vendorIndustries } = await supabase
        .from("vendor_industries")
        .select(`
          vendor_id,
          industries(*)
        `)
        .in("vendor_id", vendorIds);

      const { data: vendorFeatures } = await supabase
        .from("vendor_features")
        .select(`
          vendor_id,
          features(*)
        `)
        .in("vendor_id", vendorIds);

      const vendors = data?.map((vendor) => ({
        ...vendor,
        industries: vendorIndustries
          ?.filter((vi) => vi.vendor_id === vendor.id)
          .map((vi) => vi.industries as Industry) || [],
        features: vendorFeatures
          ?.filter((vf) => vf.vendor_id === vendor.id)
          .map((vf) => vf.features as Feature) || [],
      })) as Vendor[];

      // Maintain the order of slugs
      return slugs
        .map((slug) => vendors.find((v) => v.slug === slug))
        .filter(Boolean) as Vendor[];
    },
    enabled: slugs.length > 0,
  });
}