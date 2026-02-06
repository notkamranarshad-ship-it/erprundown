import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Author } from "@/types/database";
import { toast } from "sonner";

// Type for public author data (excludes email)
export type PublicAuthor = Omit<Author, "email">;

// Public hooks - use the authors_public view (excludes email)
export function useAuthors() {
  return useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      // Use the public view that excludes email for public read access
      const { data, error } = await supabase
        .from("authors_public")
        .select("*")
        .order("is_default", { ascending: false })
        .order("name");

      if (error) throw error;
      return data as PublicAuthor[];
    },
  });
}

export function useAuthor(slug: string) {
  return useQuery({
    queryKey: ["author", slug],
    queryFn: async () => {
      // Use the public view that excludes email for public read access
      const { data, error } = await supabase
        .from("authors_public")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return (data as PublicAuthor) ?? null;
    },
    enabled: !!slug,
  });
}

export function useDefaultAuthor() {
  return useQuery({
    queryKey: ["default-author"],
    queryFn: async () => {
      // Use the public view that excludes email for public read access
      const { data, error } = await supabase
        .from("authors_public")
        .select("*")
        .eq("is_default", true)
        .maybeSingle();

      if (error) throw error;
      return data as PublicAuthor | null;
    },
  });
}

// Admin hooks - use the full authors table (includes email, requires admin role)
export function useAuthorsAdmin() {
  return useQuery({
    queryKey: ["authors-admin"],
    queryFn: async () => {
      // Admins can access the full authors table via RLS
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("is_default", { ascending: false })
        .order("name");

      if (error) throw error;
      return data as Author[];
    },
  });
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (author: Omit<Author, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("authors")
        .insert(author)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("No author returned (not authorized or insert failed)");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors-admin"] });
      toast.success("Author created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create author: ${error.message}`);
    },
  });
}

export function useUpdateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Author> & { id: string }) => {
      const { data, error } = await supabase
        .from("authors")
        .update(updates)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("No author updated (not authorized or record missing)");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors-admin"] });
      toast.success("Author updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update author: ${error.message}`);
    },
  });
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("authors")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors-admin"] });
      toast.success("Author deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete author: ${error.message}`);
    },
  });
}
