import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Industry, Vendor } from "@/types/database";

export function useIndustries(options?: {
  featured?: boolean;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["industries", options],
    queryFn: async () => {
      let query = supabase
        .from("industries")
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
      return data as Industry[];
    },
  });
}

export function useIndustry(slug: string) {
  return useQuery({
    queryKey: ["industry", slug],
    queryFn: async () => {
      const { data: industry, error } = await supabase
        .from("industries")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!industry) return null;

      // Get vendors for this industry
      const { data: vendorIndustries } = await supabase
        .from("vendor_industries")
        .select(`
          vendors(*)
        `)
        .eq("industry_id", industry.id);

      return {
        ...industry,
        vendors: vendorIndustries?.map((vi) => vi.vendors as Vendor) || [],
      } as Industry & { vendors: Vendor[] };
    },
    enabled: !!slug,
  });
}