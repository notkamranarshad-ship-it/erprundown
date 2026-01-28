import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LeadFormData } from "@/types/database";
import { toast } from "sonner";

export function useSubmitLead() {
  return useMutation({
    mutationFn: async (data: LeadFormData) => {
      // Check honeypot - if filled, silently reject
      if (data.honeypot) {
        // Pretend success but don't store
        return { success: true, spam: true };
      }

      const { error } = await supabase.from("leads").insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        role: data.role || null,
        company_size: data.company_size || null,
        industry: data.industry || null,
        vendors_interested: data.vendors_interested || [],
        message: data.message || null,
        source_page: data.source_page || null,
        status: "New",
      });

      if (error) throw error;
      return { success: true, spam: false };
    },
    onSuccess: (result) => {
      if (!result.spam) {
        toast.success("Thank you! We'll be in touch soon.");
      }
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
}