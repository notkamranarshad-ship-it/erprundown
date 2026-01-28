import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CaseStudy, Vendor, Industry } from "@/types/database";

export function useCaseStudies(options?: {
  limit?: number;
  industryId?: string;
  vendorId?: string;
}) {
  return useQuery({
    queryKey: ["case-studies", options],
    queryFn: async () => {
      let query = supabase
        .from("case_studies")
        .select(`
          *,
          industries(*),
          vendors(*)
        `)
        .order("published_at", { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.industryId) {
        query = query.eq("industry_id", options.industryId);
      }

      if (options?.vendorId) {
        query = query.eq("vendor_id", options.vendorId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map((cs) => ({
        ...cs,
        industry: cs.industries as Industry | null,
        vendor: cs.vendors as Vendor | null,
      })) as CaseStudy[];
    },
  });
}

export function useCaseStudy(slug: string) {
  return useQuery({
    queryKey: ["case-study", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select(`
          *,
          industries(*),
          vendors(*)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        industry: data.industries as Industry | null,
        vendor: data.vendors as Vendor | null,
      } as CaseStudy;
    },
    enabled: !!slug,
  });
}