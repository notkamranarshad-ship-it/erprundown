import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Author } from "@/types/database";
import { toast } from "sonner";

export function useAuthors() {
  return useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
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

export function useAuthor(slug: string) {
  return useQuery({
    queryKey: ["author", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Author;
    },
    enabled: !!slug,
  });
}

export function useDefaultAuthor() {
  return useQuery({
    queryKey: ["default-author"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("is_default", true)
        .single();

      if (error) throw error;
      return data as Author;
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
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
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
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
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
      toast.success("Author deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete author: ${error.message}`);
    },
  });
}
