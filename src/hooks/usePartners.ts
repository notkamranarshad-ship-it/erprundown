import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Partner } from "@/types/database";
import { toast } from "sonner";

export function usePartners(options?: {
  featured?: boolean;
  limit?: number;
  search?: string;
  region?: string;
  erp?: string;
  industry?: string;
}) {
  return useQuery({
    queryKey: ["partners", options],
    queryFn: async () => {
      let query = supabase
        .from("partners")
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

      let partners = (data as Partner[]) || [];

      // Client-side filtering for array fields
      if (options?.region) {
        partners = partners.filter((p) =>
          p.regions_served?.includes(options.region!)
        );
      }

      if (options?.erp) {
        partners = partners.filter((p) =>
          p.erp_specializations?.includes(options.erp!)
        );
      }

      if (options?.industry) {
        partners = partners.filter((p) =>
          p.industries_served?.includes(options.industry!)
        );
      }

      return partners;
    },
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: Omit<Partner, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("partners")
        .insert(partner)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create partner: ${error.message}`);
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Partner> & { id: string }) => {
      const { data, error } = await supabase
        .from("partners")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update partner: ${error.message}`);
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete partner: ${error.message}`);
    },
  });
}

export function usePartner(slug: string) {
  return useQuery({
    queryKey: ["partner", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Partner | null;
    },
    enabled: !!slug,
  });
}
