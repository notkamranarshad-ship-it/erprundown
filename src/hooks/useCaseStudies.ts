import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CaseStudy, Vendor, Industry } from "@/types/database";
import { toast } from "sonner";

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

export function useCreateCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseStudy: Omit<CaseStudy, "id" | "created_at" | "updated_at" | "industry" | "vendor">) => {
      const { data, error } = await supabase
        .from("case_studies")
        .insert(caseStudy)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
      toast.success("Case study created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create case study: ${error.message}`);
    },
  });
}

export function useUpdateCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CaseStudy> & { id: string }) => {
      // Remove relation fields before updating
      const { industry, vendor, ...dbUpdates } = updates as any;
      
      const { data, error } = await supabase
        .from("case_studies")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
      toast.success("Case study updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update case study: ${error.message}`);
    },
  });
}

export function useDeleteCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("case_studies")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
      toast.success("Case study deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete case study: ${error.message}`);
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