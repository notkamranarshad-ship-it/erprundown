import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, Vendor, Industry } from "@/types/database";
import { toast } from "sonner";

export function useBlogPosts(options?: {
  limit?: number;
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["blog-posts", options],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.category) {
        query = query.eq("category", options.category);
      }

      if (options?.search) {
        query = query.ilike("title", `%${options.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Omit<BlogPost, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create blog post: ${error.message}`);
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update blog post: ${error.message}`);
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete blog post: ${error.message}`);
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!post) return null;

      // Get related vendors
      const { data: postVendors } = await supabase
        .from("blog_post_vendors")
        .select(`
          vendors(*)
        `)
        .eq("blog_post_id", post.id);

      // Get related industries
      const { data: postIndustries } = await supabase
        .from("blog_post_industries")
        .select(`
          industries(*)
        `)
        .eq("blog_post_id", post.id);

      return {
        ...post,
        vendors: postVendors?.map((pv) => pv.vendors as Vendor) || [],
        industries: postIndustries?.map((pi) => pi.industries as Industry) || [],
      } as BlogPost & { vendors: Vendor[]; industries: Industry[] };
    },
    enabled: !!slug,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      const categories = [...new Set(data?.map((p) => p.category).filter(Boolean))];
      return categories as string[];
    },
  });
}