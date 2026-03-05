import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Advisor {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  company: string | null;
  short_bio: string | null;
  long_bio: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useAdvisors() {
  return useQuery({
    queryKey: ["advisors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advisors" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as unknown as Advisor[];
    },
  });
}

export function useAdvisorBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["advisors", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advisors" as any)
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Advisor | null;
    },
  });
}

export function useCreateAdvisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (advisor: Omit<Advisor, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("advisors" as any).insert(advisor as any);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["advisors"] }); toast.success("Advisor added"); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateAdvisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...rest }: Partial<Advisor> & { id: string }) => {
      const { error } = await supabase.from("advisors" as any).update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["advisors"] }); toast.success("Advisor updated"); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteAdvisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("advisors" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["advisors"] }); toast.success("Advisor deleted"); },
    onError: (e: any) => toast.error(e.message),
  });
}
