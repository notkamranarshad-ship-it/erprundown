import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Industry, Vendor } from "@/types/database";
import { toast } from "sonner";

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

export function useCreateIndustry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (industry: Omit<Industry, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("industries")
        .insert(industry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      toast.success("Industry created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create industry: ${error.message}`);
    },
  });
}

export function useUpdateIndustry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Industry> & { id: string }) => {
      const { data, error } = await supabase
        .from("industries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      toast.success("Industry updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update industry: ${error.message}`);
    },
  });
}

export function useDeleteIndustry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("industries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      toast.success("Industry deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete industry: ${error.message}`);
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