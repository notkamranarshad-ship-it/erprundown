import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Publication {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  created_at: string;
}

export function usePublications() {
  return useQuery({
    queryKey: ["featured_publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("featured_publications" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as unknown as Publication[];
    },
  });
}

export function useCreatePublication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pub: { name: string; logo_url?: string; website_url?: string; display_order?: number }) => {
      const { error } = await supabase.from("featured_publications" as any).insert(pub as any);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["featured_publications"] }); toast.success("Publication added"); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdatePublication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...rest }: { id: string; name?: string; logo_url?: string; website_url?: string; display_order?: number }) => {
      const { error } = await supabase.from("featured_publications" as any).update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["featured_publications"] }); toast.success("Publication updated"); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeletePublication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("featured_publications" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["featured_publications"] }); toast.success("Publication deleted"); },
    onError: (e: any) => toast.error(e.message),
  });
}
