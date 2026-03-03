import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Vendor } from "@/types/database";
import { toast } from "sonner";

export function useHeroVendors() {
  return useQuery({
    queryKey: ["hero-vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_vendors")
        .select(`
          vendor_id,
          display_order,
          vendors(*)
        `)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data?.map((hv: any) => hv.vendors).filter(Boolean) || []) as Vendor[];
    },
  });
}

export function useSetHeroVendors() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorIds: string[]) => {
      // Delete all existing hero vendors
      const { error: deleteError } = await supabase
        .from("hero_vendors")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

      if (deleteError) throw deleteError;

      // Insert new ones
      if (vendorIds.length > 0) {
        const rows = vendorIds.map((vendor_id, i) => ({
          vendor_id,
          display_order: i,
        }));

        const { error: insertError } = await supabase
          .from("hero_vendors")
          .insert(rows);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-vendors"] });
      toast.success("Hero vendors updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update hero vendors: ${error.message}`);
    },
  });
}
